import { useCallback, useEffect, useState } from "react";
import type { Project } from "../types";
import { PlusIcon, TrashIcon, ExternalLinkIcon, LayoutGrid } from "lucide-react";
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
    if (!confirm("Delete this project? This action is irreversible.")) return;
    try {
      await api.delete(`/api/project/${projectId}`);
      setProjects(ps => ps.filter(p => p.id !== projectId));
      toast.success("Project deleted");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (session?.user) fetchProjects();
  }, [session?.user, fetchProjects]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-[#E040A0] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(224,64,160,0.3)]">
                <LayoutGrid className="size-3.5 text-white" />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#E040A0] uppercase">
                My Projects
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">All Builds</h1>
            {!loading && (
              <p className="text-sm text-slate-400 mt-1">
                {projects.length} {projects.length === 1 ? "project" : "projects"} created
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-[#E040A0] hover:bg-[#c9328d] shadow-[0_4px_14px_rgba(224,64,160,0.3)] transition-all active:scale-[0.98]"
          >
            <PlusIcon className="size-4" />
            New Project
          </button>
        </div>

        {/* ── Loading skeletons ─────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white border border-slate-100 animate-pulse">
                <div className="h-44 bg-slate-100" />
                <div className="p-4 flex flex-col gap-2.5">
                  <div className="h-3 bg-slate-100 rounded" style={{ width: '65%' }} />
                  <div className="h-2.5 bg-slate-100 rounded" style={{ width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────── */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-6 border border-pink-100">
              <LayoutGrid className="size-9 text-[#E040A0]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No projects yet</h2>
            <p className="text-slate-500 max-w-sm mb-8">
              Start building your first AI-powered website in seconds.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 text-sm font-bold rounded-xl text-white bg-[#E040A0] hover:bg-[#c9328d] shadow-[0_4px_14px_rgba(224,64,160,0.3)] transition-all"
            >
              Create First Project
            </button>
          </div>
        )}

        {/* ── Project grid ─────────────────────────────────────── */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 bg-white border border-slate-100 hover:border-pink-100 hover:shadow-[0_8px_30px_rgba(224,64,160,0.07)] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Thumbnail viewport */}
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-slate-50">
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
                      <span className="size-1.5 rounded-full bg-[#E040A0] animate-pulse" />
                      <span className="text-[9px] font-bold text-[#E040A0] uppercase tracking-wide">
                        RENDERING…
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 bg-black/20 backdrop-blur-sm">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/preview/${project.id}`); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-white bg-white/20 border border-white/30 hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                      <ExternalLinkIcon className="size-3" />
                      Preview
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-[#E040A0] hover:bg-[#c9328d] transition-all"
                    >
                      Open
                    </button>
                  </div>

                  {/* Published badge */}
                  {project.isPublished && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-green-500/90 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      <span className="text-[8px] font-bold text-white uppercase">Live</span>
                    </div>
                  )}
                </div>

                {/* Project meta */}
                <div className="px-4 py-3.5 border-t border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{project.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(project.createdAt).toLocaleDateString([], {
                          month: 'short', day: '2-digit', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={e => deleteProject(e, project.id)}
                      className="flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="Delete project"
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
