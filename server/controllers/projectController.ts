import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { generateWithHF } from "../lib/huggingface.js";

// controller fn to make revision

export const makeRevision = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const { projectId } = req.params;
    const { message } = req.body;

    // Auth guard first — before any DB call
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Please enter a valid prompt" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.credits < 5) {
      return res
        .status(403)
        .json({ message: "add more credits to make changes" });
    }

    const currentProject = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });

    if (!currentProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.conversation.create({
      data: {
        role: "user",
        content: message,
        projectId,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 5 },
      },
    });

    await prisma.transaction.create({
      data: {
        userId,
        type: "COMPONENT_EDIT",
        credits: -5,
      },
    });

    // enhance user prompt
    const enhancedPrompt = await generateWithHF(`
    You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.
    
    Enhance this by:
    1. Being specific about what elements to change
    2. Mentioning design details (colors, spacing, sizes)
    3. Clarifying the desired outcome
    4. Using clear technical terms
    
    User request: "${message}"
    
    Enhanced request:
    `);

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content: `I have enhanced your prompt to : "${enhancedPrompt}"`,
        projectId,
      },
    });

    // generate website code
    const systemPrompt = `You are a world-class UI/UX designer and senior frontend engineer who creates breathtaking, premium websites.

You are making a targeted change to an existing website. CRITICAL RULES:
- Return ONLY the complete, updated HTML document — no explanations, no markdown fences
- Preserve all existing design quality, animations, and styling unless the user asks to change them
- When adding new elements, match the existing design language perfectly
- If adding new sections: use glassmorphism cards, smooth hover transitions, and rich gradients
- Include all existing CDN scripts (Tailwind, GSAP, Google Fonts) in the output
- Make the requested change precise, polished, and visually stunning
- Add or enhance CSS animations where appropriate

The updated website must look premium and award-winning.`;

    const code = await generateWithHF(`
Current website code:
"${currentProject.current_code}"

User request for change:
"${enhancedPrompt}"

Return the COMPLETE updated HTML document only.
    `, systemPrompt, "Qwen/Qwen2.5-Coder-7B-Instruct");

    if (!code) {
      await prisma.conversation.create({
        data: {
          role: "assistant",
          content: "Unable to generate the code, please try again",
          projectId,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
      return res.status(500).json({ message: "Failed to generate code" });
    }

    const cleanedCode = code
      .replace(/```[a-z]*\n?/gi, "")
      .replace(/```$/g, "")
      .trim();

    if (!cleanedCode) {
      await prisma.conversation.create({
        data: {
          role: "assistant",
          content: "The AI failed to generate valid code. Please try a different prompt.",
          projectId,
        },
      });
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      });
      return res.status(500).json({ message: "Failed to generate valid code (empty response)" });
    }

    // Ensure main branch exists
    const branch = await prisma.branch.upsert({
      where: {
        projectId_name: { projectId, name: "main" },
      },
      update: {},
      create: {
        projectId,
        name: "main",
        isDefault: true,
      },
    });

    const version = await prisma.version.create({
      data: {
        branchId: branch.id,
        patch: "",
        fullHtml: cleanedCode,
        description: "changes made",
        // Only set parentId if it's a real UUID (not the "0" default or empty)
        parentId:
          currentProject.current_version_index &&
          currentProject.current_version_index !== "0"
            ? currentProject.current_version_index
            : undefined,
      },
    });

    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "I have made the changes to your website! You can now preview it",
        projectId,
      },
    });

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: cleanedCode,
        current_version_index: version.id,
      },
    });

    res.json({ message: "Changes made successfully" });
  } catch (error: any) {
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 5 } },
      }).catch(() => {}); // best-effort refund
    }
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// controller fn to rollback to a specific version
export const rollbackToVersion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { projectId, versionId } = req.params;
    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    // Fetch version directly — versions live under branches
    const version = await prisma.version.findFirst({
      where: { id: versionId, branch: { projectId } },
    });
    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }
    await prisma.websiteProject.update({
      where: { id: projectId, userId },
      data: {
        current_code: version.fullHtml ?? "",
        current_version_index: version.id,
      },
    });
    await prisma.conversation.create({
      data: {
        role: "assistant",
        content:
          "I've rolled back your website to selected version. You can now preview it",
        projectId,
      },
    });

    res.json({ message: "version rolled back" });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// controller fn to delete a project

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await prisma.websiteProject.delete({
      where: { id: projectId, userId },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// controller fn for getting project code for review

export const getProjectPreview = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// controller fn to get published projects

export const getPublishedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.websiteProject.findMany({
      where: { isPublished: true },
      include: { user: true },
    });

    res.json({ projects });
  } catch (error: any) {
    const code = error?.code;
    const message = error?.message ?? "Unknown error";
    console.log(code || message);

    if (code === "P1017") {
      return res.status(503).json({
        message:
          "Database connection was closed. Verify DATABASE_URL and that your Postgres provider allows SSL connections from this machine.",
      });
    }

    res.status(500).json({ message });
  }
};

// get a single project by id

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.websiteProject.findFirst({
      where: { id: projectId },
    });

    if (!project || project.isPublished === false || !project?.current_code) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ code: project.current_code });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};

// controller to save project

export const saveProjectCode = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!code) {
      return res.status(400).json({ message: "code is required" });
    }

    const project = await prisma.websiteProject.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.websiteProject.update({
      where: { id: projectId },
      data: {
        current_code: code,
        // Keep current_version_index — manual edits don't create a new version
      },
    });

    res.json({ message: "project saved successfully" });
  } catch (error: any) {
    console.log(error.code || error.message);
    res.status(500).json({ message: error.message });
  }
};
