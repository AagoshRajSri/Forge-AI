import { Queue, Worker, QueueEvents } from "bullmq";
import { Redis } from "ioredis";
import { generateWithHF } from "./huggingface.js";
import prisma from "./prisma.js";
import { WSManager } from "../src/api/websocket/wsManager.js";

const redisUrl = process.env.REDIS_URL;

// Only initialise BullMQ if REDIS_URL is configured
const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      retryStrategy: (times: number) => {
        if (times > 3) return null;
        return Math.min(times * 1000, 5000);
      },
    })
  : null;

if (redis) {
  redis.on("error", () => {}); // suppress connection noise
}

export const generateQueue = redis
  ? new Queue("generate", { connection: redis })
  : null;

export const queueEvents = redis
  ? new QueueEvents("generate", { connection: redis })
  : null;

// Full job processor — only active when Redis is available
export const generateWorker = redis
  ? new Worker(
      "generate",
      async (job) => {
        const { projectId, prompt, userId, isRevision } = job.data;

        await job.updateProgress(10);
        await prisma.jobTracker.updateMany({
          where: { projectId, userId, status: "PENDING" },
          data: { status: "RUNNING", progress: 10 },
        });

        const model = isRevision
          ? "Qwen/Qwen2.5-Coder-7B-Instruct"
          : "Qwen/Qwen2.5-Coder-32B-Instruct";

        const systemPrompt = `You are a world-class UI/UX designer and senior frontend engineer who creates breathtaking, award-winning websites. Your designs are featured on Awwwards and CSS Design Awards.

DESIGN PHILOSOPHY:
- Every website must feel PREMIUM, MODERN, and VISUALLY STUNNING on first glance
- Use bold typography with dramatic size contrasts (hero text 5xl-9xl, supporting text base-lg)
- Apply rich, curated color palettes — never plain defaults. Use vibrant gradients, deep jewel tones, or sophisticated neutrals
- Add glassmorphism cards: backdrop-blur, semi-transparent backgrounds with colored borders
- Use smooth CSS animations and transitions throughout (fade-in, slide-up, float, pulse glows)
- Every section needs a distinct visual identity while maintaining cohesion
- Add subtle texture with noise gradients, dot grids, or geometric shapes as decorative elements

TECHNICAL REQUIREMENTS:
- Return ONLY the complete, self-contained HTML document. No explanations. No markdown fences.
- Include: <script src="https://cdn.tailwindcss.com"></script>
- Include: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script> for animations
- Include Google Fonts via <link> for premium typography (Inter, Syne, Bricolage Grotesque, etc.)
- Use Tailwind CSS v3 utility classes throughout
- Add @keyframes in a <style> block for custom animations (float, shimmer, fade-up, etc.)
- Ensure mobile responsiveness with sm:/md:/lg: breakpoints
- Add hover effects on all interactive elements

STRUCTURE EVERY SITE WITH:
1. Fixed navbar with logo, navigation links, and CTA button with glass effect
2. Hero: Full-viewport with headline, subtext, CTA buttons, and floating 3D-style decorative elements
3. Social proof / stats bar with animated numbers
4. Features / services grid with icon cards using glassmorphism
5. Testimonials or showcase section
6. Final CTA section with gradient background
7. Footer with links and copyright

Make every pixel intentional. Create websites that make users say "wow".`;

        const code = await generateWithHF(prompt, systemPrompt, model);

        if (!code || !code.trim()) {
          await prisma.jobTracker.updateMany({
            where: { projectId, userId, status: "RUNNING" },
            data: { status: "FAILED", error: "Empty response from model" },
          });
          throw new Error("Empty code generated");
        }

        const cleanedCode = code
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/g, "")
          .trim();

        await job.updateProgress(80);

        await prisma.websiteProject.update({
          where: { id: projectId },
          data: { current_code: cleanedCode },
        });

        await prisma.jobTracker.updateMany({
          where: { projectId, userId, status: "RUNNING" },
          data: { status: "COMPLETED", progress: 100, result: JSON.stringify({ success: true }) },
        });

        await job.updateProgress(100);
        return { success: true, code: cleanedCode };
      },
      { connection: redis, concurrency: 2 }
    )
  : null;

if (generateWorker) {
  generateWorker.on("completed", async (job) => {
    console.log(`[Queue] Job ${job.id} completed`);
    await WSManager.publishJobUpdate(job.data.projectId, job.id!, "COMPLETED", 100);
  });

  generateWorker.on("failed", async (job) => {
    console.error(`[Queue] Job ${job?.id} failed`);
    if (job) {
      await WSManager.publishJobUpdate(job.data.projectId, job.id!, "FAILED", 0);
    }
  });
}

if (queueEvents) {
  queueEvents.on("progress", async ({ jobId, data }) => {
    const jobData = await generateQueue?.getJob(jobId);
    if (jobData) {
      const progress = typeof data === "number" ? data : (data as any)?.progress ?? 0;
      await WSManager.publishJobUpdate(jobData.data.projectId, jobId, "RUNNING", progress);
    }
  });
}

if (!redis) {
  console.log("[Queue] No REDIS_URL — job queue disabled (generation runs synchronously).");
}
