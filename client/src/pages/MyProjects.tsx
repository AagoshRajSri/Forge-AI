import { useCallback, useEffect, useState } from "react";
import type { Project } from "../types";
import { PlusIcon, TrashIcon, ExternalLinkIcon, GridIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/configs/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get("/api/user/projects");
      setProjects(data.projects || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (!confirm("Terminate this project? Action is irreversible.")) return;
    try {
      await api.delete(`/api/project/${projectId}`);
      setProjects(ps => ps.filter(p => p.id !== projectId));
      toast.success("Project terminated");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (session?.user) fetchProjects();
  }, [session?.user, fetchProjects]);

  return (
    <div className="min-h-screen pt-13" style={{ background: 'transparent' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <GridIcon className="size-3.5" style={{ color: 'var(--signal)' }} />
              <span className="text-[10px] font-mono tracking-cosmic uppercase" style={{ color: 'var(--signal)' }}>
                Mission Control
              </span>
            </div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--star-1)' }}>Projects</h1>
            {!loading && (
              <p className="text-xs font-mono tracking-cosmic mt-0.5" style={{ color: 'var(--star-3)' }}>
                {projects.length} {projects.length === 1 ? 'mission' : 'missions'} logged
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-cosmic rounded text-white transition-all hover:shadow-[0_0_14px_rgba(239, 68, 68,0.25)] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, var(--signal), var(--pulse))',
              border: '1px solid rgba(239, 68, 68,0.3)',
            }}
          >
            <PlusIcon className="size-3.5" />
            NEW MISSION
          </button>
        </div>

        {/* ── Loading skeletons ─────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--seam)', background: 'var(--space)' }}>
                <div className="skeleton h-44" style={{ opacity: 0.4 }} />
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="skeleton h-3 rounded" style={{ width: '65%', opacity: 0.5 }} />
                  <div className="skeleton h-2.5 rounded" style={{ width: '40%', opacity: 0.3 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────── */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-36">
            <div
              className="size-14 rounded-lg mb-5 flex items-center justify-center hud-corners"
              style={{
                background: 'var(--signal-dim)',
                border: '1px solid var(--seam-glow)',
              }}
            >
              <GridIcon className="size-5" style={{ color: 'var(--signal)' }} />
            </div>
            <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--star-1)' }}>No missions yet</p>
            <p className="text-xs mb-6 font-mono tracking-cosmic" style={{ color: 'var(--star-3)' }}>
              Begin your first build sequence
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 text-xs font-mono tracking-cosmic rounded text-white transition-all hover:shadow-[0_0_14px_rgba(239, 68, 68,0.25)]"
              style={{
                background: 'linear-gradient(135deg, var(--signal), var(--pulse))',
                border: '1px solid rgba(239, 68, 68,0.3)',
              }}
            >
              INITIALIZE MISSION
            </button>
          </div>
        )}

        {/* ── Project grid ─────────────────────────────────────── */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hud-corners"
                style={{
                  background: 'var(--space)',
                  border: '1px solid var(--seam)',
                  animationDelay: `${idx * 40}ms`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--seam-glow)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(239, 68, 68,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--seam)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail viewport */}
                <div className="relative h-44 overflow-hidden" style={{ background: 'var(--void)' }}>
                  {project.current_code ? (
                    <iframe
                      srcDoc={project.current_code}
                      className="absolute top-0 left-0 border-none pointer-events-none"
                      sandbox="allow-scripts"
                      referrerPolicy="no-referrer"
                      style={{
                        width: '1200px',
                        height: '800px',
                        transform: 'scale(0.25)',
                        transformOrigin: 'top left',
                      }}
                      title={`preview-${project.id}`}
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2">
                      <span className="animate-signal size-1.5 rounded-full" style={{ background: 'var(--signal)' }} />
                      <span className="text-[9px] font-mono tracking-cosmic" style={{ color: 'var(--star-3)' }}>
                        RENDERING…
                      </span>
                    </div>
                  )}

                  {/* Hover overlay — HUD style */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2"
                    style={{ background: 'rgba(5, 7, 10, 0.75)', backdropFilter: 'blur(4px)' }}
                  >
                    {/* Corner HUD markers */}
                    <div className="absolute top-2 left-2 size-4 border-t border-l" style={{ borderColor: 'var(--signal)' }} />
                    <div className="absolute top-2 right-2 size-4 border-t border-r" style={{ borderColor: 'var(--signal)' }} />
                    <div className="absolute bottom-2 left-2 size-4 border-b border-l" style={{ borderColor: 'var(--signal)' }} />
                    <div className="absolute bottom-2 right-2 size-4 border-b border-r" style={{ borderColor: 'var(--signal)' }} />

                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/preview/${project.id}`); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-cosmic rounded text-white transition-all hover:border-[var(--seam-glow)]"
                      style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
                    >
                      <ExternalLinkIcon className="size-2.5" />
                      VIEW
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-cosmic rounded text-white transition-all"
                      style={{
                        background: 'linear-gradient(135deg, var(--signal), var(--pulse))',
                        border: '1px solid rgba(239, 68, 68,0.4)',
                      }}
                    >
                      OPEN
                    </button>
                  </div>
                </div>

                {/* Project meta */}
                <div className="px-4 py-3" style={{ borderTop: '1px solid var(--seam)' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--star-1)' }}>
                        {project.name}
                      </p>
                      <p className="text-[10px] font-mono tracking-cosmic mt-0.5" style={{ color: 'var(--star-3)' }}>
                        {new Date(project.createdAt).toLocaleDateString([], {
                          month: 'short', day: '2-digit', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={e => deleteProject(e, project.id)}
                      className="flex-shrink-0 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all hover:text-red-400"
                      style={{ color: 'var(--star-3)' }}
                      title="Terminate project"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
