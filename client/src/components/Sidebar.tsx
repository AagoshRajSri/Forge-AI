import {
  SendIcon,
  RotateCcwIcon,
  EyeIcon,
  RadioIcon,
} from "lucide-react";
import type { Project, Message, Version } from "../types";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "@/configs/axios";
import { toast } from "sonner";

interface SidebarProps {
  isMenuOpen: boolean;
  project: Project;
  setProject: (project: Project) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const STEPS = [
  "Intercepting transmission…",
  "Assimilating structural parameters…",
  "Rewriting core architecture…",
  "Eliminating redundancies…",
  "Optimizing local environment…",
];

const Sidebar = ({ isMenuOpen, project, setProject, isGenerating, setIsGenerating }: SidebarProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${project.id}`);
      setProject(data.project);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isGenerating) {
      setStepIndex(0);
      stepTimer.current = setInterval(() => {
        setStepIndex(i => (i + 1) % STEPS.length);
      }, 2200);
    } else {
      if (stepTimer.current) clearInterval(stepTimer.current);
    }
    return () => { if (stepTimer.current) clearInterval(stepTimer.current); };
  }, [isGenerating]);

  const handleRollback = async (versionId: string) => {
    if (!confirm("Restore this version? Current state will be overwritten.")) return;
    try {
      setIsGenerating(true);
      const { data } = await api.get(`/api/project/rollback/${project.id}/${versionId}`);
      const { data: d2 } = await api.get(`/api/user/project/${project.id}`);
      toast.success(data.message);
      setProject(d2.project);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevisions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    try {
      setIsGenerating(true);
      interval = setInterval(fetchProject, 10000);
      await api.post(`/api/project/revision/${project.id}`, { message: input });
      fetchProject();
      toast.success("Modifications applied", {
        action: { label: "Undo", onClick: () => {} },
      });
      setInput("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project.conversation?.length, isGenerating]);

  const timeline = [
    ...(project.conversation || []),
    ...(project.versions || [])
  ].sort((a, b) =>
    new Date((a as any).timestamp).getTime() - new Date((b as any).timestamp).getTime()
  );

  return (
    <div
      className={`h-full flex flex-col flex-shrink-0 transition-all duration-200 ${
        isMenuOpen ? "max-sm:w-0 max-sm:overflow-hidden" : "w-full"
      } sm:w-[300px]`}
      style={{
        background: 'rgba(8, 12, 20, 0.9)',
        borderRight: '1px solid var(--seam)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* ── Panel Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-11 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--seam)' }}>
        <div className="flex items-center gap-2">
          <RadioIcon className="size-3" style={{ color: 'var(--signal)' }} />
          <span className="text-[10px] font-mono tracking-cosmic uppercase" style={{ color: 'var(--star-2)' }}>
            Command Log
          </span>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-1.5">
            <span className="animate-signal size-1.5 rounded-full" style={{ background: 'var(--signal)' }} />
            <span className="text-[10px] font-mono tracking-cosmic" style={{ color: 'var(--signal)' }}>
              ACTIVE
            </span>
          </div>
        )}
      </div>

      {/* ── Message Thread ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 flex flex-col gap-3">

        {/* Empty state */}
        {timeline.length === 0 && !isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="size-10 rounded-full mb-4 flex items-center justify-center"
              style={{ background: 'var(--signal-dim)', border: '1px solid var(--seam-glow)' }}>
              <RadioIcon className="size-4" style={{ color: 'var(--signal)' }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--star-2)' }}>
              Describe a change below to begin
            </p>
          </div>
        )}

        {timeline.map((item) => {
          const isMessage = "content" in item;

          if (isMessage) {
            const msg = item as Message;
            const isUser = msg.role === "user";
            return (
              <div key={msg.id} className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
                <span className="text-[10px] px-0.5 tracking-cosmic uppercase" style={{ color: 'var(--star-3)' }}>
                  {isUser ? "OPERATOR" : "SYSTEM_CORE"}
                </span>
                <div
                  className="max-w-[88%] px-3 py-2 text-xs leading-relaxed rounded hud-corners"
                  style={isUser
                    ? {
                        background: 'rgba(239, 68, 68,0.08)',
                        border: '1px solid var(--seam-glow)',
                        color: 'var(--star-1)',
                        boxShadow: 'inset 0 0 10px rgba(239, 68, 68,0.05)',
                      }
                    : {
                        background: 'var(--nebula)',
                        border: '1px solid var(--seam)',
                        color: 'var(--star-2)',
                      }
                  }
                >
                  {msg.content}
                </div>
              </div>
            );
          } else {
            const ver = item as Version;
            const isCurrent = project.current_version_index === ver.id;
            return (
              <div
                key={ver.id}
                className="rounded p-3 flex flex-col gap-2.5"
                style={{
                  background: 'rgba(239, 68, 68, 0.04)',
                  border: `1px solid ${isCurrent ? 'var(--seam-glow)' : 'var(--seam)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px]" style={{ color: 'var(--star-3)' }}>
                    Version saved
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono tracking-cosmic"
                      style={{ background: 'var(--signal-dim)', color: 'var(--signal)', border: '1px solid var(--seam-glow)' }}>
                      LIVE
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono" style={{ color: 'var(--star-2)' }}>
                  {new Date(ver.timestamp).toLocaleString([], {
                    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  {!isCurrent && (
                    <button
                      onClick={() => handleRollback(ver.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded transition-all hover:border-[var(--seam-glow)] hover:text-[var(--signal)]"
                      style={{ color: 'var(--star-2)', border: '1px solid var(--seam)', background: 'transparent' }}
                    >
                      <RotateCcwIcon className="size-3" />
                      Restore
                    </button>
                  )}
                  <Link
                    target="_blank"
                    to={`/preview/${project.id}/${ver.id}`}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-cosmic rounded transition-all hover:border-[var(--seam-glow)] hover:text-[var(--signal)]"
                    style={{ color: 'var(--star-3)', border: '1px solid var(--seam)', background: 'transparent' }}
                  >
                    <EyeIcon className="size-2.5" />
                    VIEW
                  </Link>
                </div>
              </div>
            );
          }
        })}

        {/* Generating state */}
        {isGenerating && (
          <div className="flex flex-col gap-1 items-start animate-fade-up">
            <span className="text-[10px] px-0.5 tracking-cosmic uppercase" style={{ color: 'var(--star-3)' }}>
              SYSTEM_CORE
            </span>
            <div className="px-4 py-3 rounded flex flex-col gap-2 hud-corners holo-input"
              style={{
                background: 'rgba(10, 16, 28, 0.5)',
              }}>
              {/* Energy bar */}
              <div className="w-full h-px rounded-full overflow-hidden" style={{ background: 'var(--seam)' }}>
                <div className="h-full energy-bar" style={{ width: '60%' }} />
              </div>
              <span key={stepIndex} className="text-xs font-mono animate-fade-up" style={{ color: 'var(--signal)' }}>
                {STEPS[stepIndex]}
              </span>
            </div>
          </div>
        )}

        <div ref={messageRef} />
      </div>

      {/* ── Command Input ──────────────────────────────────────────── */}
      <div className="flex-shrink-0" style={{ borderTop: '1px solid var(--seam)' }}>
        <form onSubmit={handleRevisions} className="p-3 flex flex-col gap-2">
          <div className="relative rounded holo-input hud-corners"
            style={{ background: 'var(--space)' }}>
            <span className="absolute top-2.5 left-3 text-[9px] font-mono tracking-cosmic text-blue-400 opacity-50">
              CMD ›
            </span>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={3}
              placeholder="Enter system modification…"
              disabled={isGenerating}
              className="w-full bg-transparent text-xs resize-none outline-none pt-2.5 pb-2.5 pr-3 pl-10 disabled:opacity-50"
              style={{
                color: 'var(--star-1)',
                caretColor: 'var(--signal)',
              }}
              onFocus={e => {
                (e.currentTarget.parentElement as HTMLElement).style.borderColor = 'var(--seam-glow)';
                (e.currentTarget.parentElement as HTMLElement).style.boxShadow = '0 0 12px rgba(239, 68, 68,0.08) inset';
              }}
              onBlur={e => {
                (e.currentTarget.parentElement as HTMLElement).style.borderColor = 'var(--seam)';
                (e.currentTarget.parentElement as HTMLElement).style.boxShadow = 'none';
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRevisions(e as any);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: 'var(--star-3)' }}>⌘ Enter</span>
            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded text-white transition-all active:scale-95 disabled:opacity-30 hover:shadow-[0_0_10px_rgba(239, 68, 68,0.2)] focus-visible:ring-2"
              style={{ background: 'linear-gradient(135deg, var(--signal), var(--pulse))', border: '1px solid rgba(239, 68, 68,0.3)' }}
            >
              <SendIcon className="size-3" />
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
