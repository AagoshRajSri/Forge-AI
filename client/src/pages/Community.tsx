import { useCallback, useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import api from "@/configs/axios";
import { toast } from "sonner";

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get("/api/project/published");
      setProjects(data.projects || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <>
      <div className="px-4 md:px-16 lg:px-24 xl:px-32 pt-24">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2Icon className="size-7 animate-spin text-indigo-200" />
          </div>
        ) : projects.length > 0 ? (
          <div className="py-16 min-h-[80vh] animate-fade-up">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                style={{
                  background: 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(239, 68, 68, 0.2)',
                }}>
                NEURAL_NETWORK
              </h1>
              <p className="text-sm max-w-md mx-auto mt-2 tracking-cosmic uppercase opacity-60" style={{ color: 'var(--star-2)' }}>
                Access shared architectural matrices from the global collective.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/view/${project.id}`}
                  target="_blank"
                  className="relative group w-72 max-sm:mx-auto cursor-pointer
             bg-black/40 backdrop-blur-xl border border-[var(--seam)] rounded-lg
             overflow-hidden hover:border-[var(--signal)]
             transition-all duration-500 hud-corners holo-input"
                >
                  {/* 👇 Preview viewport (HEIGHT MATTERS) */}
                  <div className="relative h-52 w-full bg-black/80 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    {project.current_code ? (
                      <iframe
                        srcDoc={project.current_code}
                        className="absolute top-0 left-0 w-[1200px] h-[800px] origin-top-left pointer-events-none grayscale group-hover:grayscale-0 transition-all duration-700"
                        sandbox="allow-scripts"
                        referrerPolicy="no-referrer"
                        style={{ transform: "scale(0.24)" }}
                        title={`project-preview-${project.id}`}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] font-mono tracking-widest uppercase opacity-40">
                        <p>PREVIEW_UNAVAILABLE</p>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="px-5 py-6 text-white transition-colors relative">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-sm font-bold tracking-tight line-clamp-1 uppercase opacity-90">
                        {project.name}
                      </h2>
                      <div className="px-2 py-0.5 text-[8px] font-mono border border-[var(--seam)] rounded bg-black/20 text-[var(--star-2)]">
                        v1.0
                      </div>
                    </div>
                    <p className="text-[10px] font-mono leading-relaxed h-8 line-clamp-2 opacity-50" style={{ color: 'var(--star-2)' }}>
                      {project.initial_prompt}
                    </p>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--seam)]">
                      <span className="text-[9px] font-mono tracking-widest opacity-40 uppercase">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2 group/user">
                        <div className="size-5 rounded-full border border-[var(--seam)] bg-black/40 flex items-center justify-center text-[10px] font-bold group-hover/user:border-[var(--signal)] transition-colors">
                          {project.user?.name?.slice(0, 1)}
                        </div>
                        <span className="text-[10px] font-mono tracking-tighter opacity-60">
                          {project.user?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh] animate-fade-up">
            <h1 className="text-3xl font-bold tracking-tight mb-8 opacity-40 uppercase font-mono">
              ZERO_PROJECTS_FOUND
            </h1>
            <button
              onClick={() => navigate("/")}
              className="py-3 px-8 font-mono tracking-widest text-[10px] uppercase text-white transition-all active:scale-95 hud-corners"
              style={{
                background: 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
              }}
            >
              INITIATE_FIRST_BUILD
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Community;
