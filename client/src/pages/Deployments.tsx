import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import api from "@/configs/axios";
import { toast } from "sonner";
import {
  Globe,
  ExternalLink,
  EyeOff,
  Clock,
  Rocket,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import type { Project } from "../types";

const Deployments = () => {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isPending && !session?.user) navigate("/auth/signin");
  }, [session, isPending, navigate]);

  React.useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const { data } = await api.get("/api/user/projects");
        const published = (data.projects as Project[]).filter((p) => p.isPublished);
        setProjects(published);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user) fetchDeployments();
  }, [session]);

  const togglePublish = async (projectId: string) => {
    try {
      const { data } = await api.post(`/api/user/publish-toggle/${projectId}`);
      toast.success(data.message);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-pink-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#E040A0] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(224,64,160,0.3)]">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#E040A0] uppercase">
              Live Deployments
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Your Published Sites
          </h1>
          <p className="text-slate-500 text-lg">
            All projects that are currently live and accessible on the web.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mb-6 border border-pink-100">
              <Rocket className="w-9 h-9 text-[#E040A0]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              No deployments yet
            </h2>
            <p className="text-slate-500 max-w-sm mb-8">
              You haven't published any projects yet. Build a site and hit the DEPLOY button to make it live.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E040A0] hover:bg-[#c9328d] text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(224,64,160,0.3)] transition-all"
            >
              View My Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Deployed Projects Grid */}
        {!loading && projects.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-slate-500">
                {projects.length} site{projects.length !== 1 ? "s" : ""} deployed
              </p>
              <Link
                to="/projects"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#E040A0] hover:underline"
              >
                <LayoutDashboard className="w-4 h-4" />
                All Projects
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden group hover:shadow-[0_4px_20px_rgba(224,64,160,0.08)] hover:border-pink-100 transition-all duration-300"
                >
                  {/* Preview thumbnail */}
                  <div className="h-40 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
                    {project.current_code && (
                      <iframe
                        srcDoc={project.current_code}
                        className="w-full h-full scale-[0.5] origin-top-left pointer-events-none"
                        style={{ width: "200%", height: "200%" }}
                        sandbox=""
                        title={project.name}
                      />
                    )}
                    {/* Live badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Project info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 truncate text-base">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            {new Date(project.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/view/${project.id}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl bg-[#E040A0] text-white hover:bg-[#c9328d] shadow-[0_2px_8px_rgba(224,64,160,0.25)] transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Live Site
                      </Link>
                      <Link
                        to={`/projects/${project.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => togglePublish(project.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                        title="Unpublish"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Deployments;
