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
      } sm:w-[300px] bg-white border-r border-slate-200/80`}
    >
      {/* ── Panel Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E040A0]" />
          <span className="text-xs font-bold tracking-wide text-slate-600 uppercase">
            Command Log
          </span>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-100">
            <span className="size-1.5 rounded-full bg-[#E040A0] animate-pulse" />
            <span className="text-[9px] font-bold tracking-wide text-[#E040A0] uppercase">
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
            <div className="size-12 rounded-2xl mb-4 flex items-center justify-center bg-pink-50 border border-pink-100">
              <RadioIcon className="size-5 text-[#E040A0]" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Ready to edit</p>
            <p className="text-xs text-slate-400">
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
                <span className="text-[10px] px-0.5 font-bold tracking-wide uppercase text-slate-400">
                  {isUser ? "YOU" : "FORGE AI"}
                </span>
                <div
                  className="max-w-[88%] px-3.5 py-2.5 text-xs leading-relaxed rounded-2xl"
                  style={isUser
                    ? {
                        background: '#E040A0',
                        color: 'white',
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        borderBottomLeftRadius: '4px',
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
                className="rounded-2xl p-3.5 flex flex-col gap-2.5 border"
                style={{
                  background: isCurrent ? '#fdf2f8' : '#f8fafc',
                  borderColor: isCurrent ? '#fbcfe8' : '#e2e8f0',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">
                    Version saved
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold text-[#E040A0] bg-pink-100 border border-pink-200">
                      LIVE
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-600">
                  {new Date(ver.timestamp).toLocaleString([], {
                    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  {!isCurrent && (
                    <button
                      onClick={() => handleRollback(ver.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#E040A0] hover:text-[#E040A0] transition-all"
                    >
                      <RotateCcwIcon className="size-3" />
                      Restore
                    </button>
                  )}
                  <Link
                    target="_blank"
                    to={`/preview/${project.id}/${ver.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-[#E040A0] hover:text-[#E040A0] transition-all"
                  >
                    <EyeIcon className="size-3" />
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
            <span className="text-[10px] px-0.5 font-bold tracking-wide uppercase text-slate-400">
              FORGE AI
            </span>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-pink-100 bg-pink-50 flex flex-col gap-2.5 max-w-[88%]">
              {/* Progress bar */}
              <div className="w-full h-1 rounded-full overflow-hidden bg-pink-100">
                <div
                  className="h-full rounded-full bg-[#E040A0] transition-all"
                  style={{
                    width: '60%',
                    animation: 'shimmer 1.5s ease-in-out infinite',
                    background: 'linear-gradient(90deg, #E040A0, #f472b6, #E040A0)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
              <span key={stepIndex} className="text-xs font-medium text-[#E040A0]">
                {STEPS[stepIndex]}
              </span>
            </div>
          </div>
        )}

        <div ref={messageRef} />
      </div>

      {/* ── Command Input ──────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-slate-100 bg-white">
        <form onSubmit={handleRevisions} className="p-3 flex flex-col gap-2.5">
          <div className="relative rounded-xl border border-slate-200 bg-slate-50 focus-within:border-[#E040A0] focus-within:ring-2 focus-within:ring-[#E040A0]/10 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={3}
              placeholder="Describe your change..."
              disabled={isGenerating}
              className="w-full bg-transparent text-xs resize-none outline-none pt-3 pb-3 px-4 disabled:opacity-50 text-slate-700 placeholder:text-slate-300"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRevisions(e as any);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400">⌘ Enter to apply</span>
            <button
              type="submit"
              disabled={isGenerating || !input.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-[#E040A0] hover:bg-[#c9328d] shadow-[0_2px_8px_rgba(224,64,160,0.3)] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
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
