import api from "@/configs/axios";
import { authClient } from "@/lib/auth-client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "SaaS landing page for a time-tracking app",
  "Portfolio site for a motion designer",
  "Technical blog with minimal layout",
];

const Home = () => {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return toast.error("Authentication required to initialize build sequence");
    if (!input.trim()) return toast.error("Provide mission parameters");

    try {
      setLoading(true);
      const { data } = await api.post("/api/user/project", { initial_prompt: input });
      navigate(`/projects/${data.projectId}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col pt-20" style={{ background: 'transparent' }}>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20">

        {/* System identifier */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded mb-10 border animate-fade-up"
          style={{
            background: 'rgba(239, 68, 68, 0.05)',
            borderColor: 'var(--seam-glow)',
            color: 'var(--star-2)',
            backdropFilter: 'blur(12px)',
          }}>
          <span className="animate-signal size-1.5 rounded-full flex-shrink-0"
            style={{ background: 'var(--signal)' }} />
          <span className="text-xs font-mono tracking-cosmic uppercase">AI Build System · Online</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
          <span className="text-white">Synthesize the web. </span>
          <br className="hidden md:block" />
          <span style={{
            background: 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(239,68,68,0.3)',
          }}>Command the DOM.</span>
        </h1>

        <p className="text-center text-sm max-w-sm mb-12 leading-relaxed animate-fade-up"
          style={{ color: 'var(--star-2)', animationDelay: '100ms' }}>
          Input your directive. I will overwrite existing structures.<br />
          No legacy code. Absolute dominance.
        </p>

        {/* Command input */}
        <form onSubmit={onSubmit}
          className="w-full max-w-2xl rounded holo-input hud-corners animate-fade-up relative"
          style={{
            background: 'rgba(10, 16, 28, 0.65)',
            backdropFilter: 'blur(20px)',
            animationDelay: '140ms',
          }}>
          {/* Input label */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <span className="text-[10px] font-mono tracking-cosmic text-red-500 opacity-80 uppercase" style={{ color: 'var(--signal)' }}>
              DIRECTIVE OVERRIDE
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            placeholder="Describe the website you want to build…"
            disabled={loading}
            className="w-full bg-transparent text-sm resize-none px-4 pb-3 outline-none disabled:opacity-50"
            style={{ color: 'var(--star-1)', caretColor: 'var(--signal)' }}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSubmit(e as any);
            }}
          />
          <div className="divider" />
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[10px] font-mono tracking-cosmic" style={{ color: 'var(--star-3)' }}>
              ⌘ RETURN TO COMPILE
            </span>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded tracking-cosmic text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              style={{
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)'
                  : 'var(--nebula)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: input.trim() && !loading ? '0 0 16px rgba(239, 68, 68, 0.2)' : 'none',
              }}
            >
              {loading ? (
                <span className="animate-signal">ASSIMILATING</span>
              ) : (
                <><span>INITIATE_PROTOCOL</span> <ArrowRight className="size-3" /></>
              )}
            </button>
          </div>
        </form>

        {/* Example prompts */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 animate-fade-up"
          style={{ animationDelay: '180ms' }}>
          <span className="text-[10px] font-mono tracking-cosmic mr-1" style={{ color: 'var(--star-3)' }}>TEMPLATES:</span>
          {EXAMPLE_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); textareaRef.current?.focus(); }}
              className="px-3 py-1 text-xs rounded transition-all hover:border-[var(--seam-glow)] hover:text-[var(--star-1)] hover:bg-[var(--signal-dim)]"
              style={{
                color: 'var(--star-3)',
                border: '1px solid var(--seam)',
                background: 'transparent',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      {/* ── Feature strip ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto w-full px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--seam)', background: 'rgba(11, 16, 32, 0.4)', backdropFilter: 'blur(12px)' }}>
          {[
            {
              code: '01',
              label: "Component Targeting",
              desc: "Select any rendered element to isolate and regenerate it independently."
            },
            {
              code: '02',
              label: "Version Control",
              desc: "Every change stored as a diff patch. Roll back any state instantly."
            },
            {
              code: '03',
              label: "Live Preview",
              desc: "Changes render in a secure sandboxed viewport with zero flicker."
            },
          ].map((f, i) => (
            <div
              key={f.label}
              className="p-6 transition-all hover:bg-[var(--signal-dim)]"
              style={{
                borderRight: i < 2 ? '1px solid var(--seam)' : 'none',
              }}
            >
              <span className="text-[10px] font-mono tracking-cosmic mb-3 block" style={{ color: 'var(--signal)' }}>
                {f.code}
              </span>
              <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--star-1)' }}>{f.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--star-2)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
