import {
  EyeIcon,
  EyeOffIcon,
  DownloadIcon,
  SaveIcon,
  FullscreenIcon,
  SmartphoneIcon,
  TabletIcon,
  MonitorIcon,
  PanelLeftIcon,
  SatelliteIcon,
  XIcon,
  MousePointerClickIcon,
  CpuIcon,
  WifiIcon,
} from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Project } from "../types";
import Sidebar from "../components/Sidebar";
import ProjectPreview, { type ProjectPreviewRef } from "../components/ProjectPreview";
import api from "@/configs/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type DeviceMode = "phone" | "tablet" | "desktop";

/* ─── Loading skeleton ──────────────────────────────────────────── */
const CockpitSkeleton = () => (
  <div className="flex h-screen w-full bg-slate-50">
    {/* Sidebar skeleton */}
    <div className="w-[300px] flex-shrink-0 bg-white border-r border-slate-100">
      <div className="h-11 border-b border-slate-100" />
      <div className="p-4 flex flex-col gap-3">
        {[70, 55, 85, 45, 65].map((w, i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded h-3" style={{ width: `${w}%`, opacity: 0.6 }} />
        ))}
      </div>
    </div>
    {/* Canvas skeleton */}
    <div className="flex-1 flex flex-col">
      <div className="h-11 border-b border-slate-100" />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full h-full bg-slate-100 animate-pulse rounded-lg" style={{ opacity: 0.4 }} />
      </div>
    </div>
  </div>
);

const Projects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  const [project, setProject] = React.useState<Project | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(true);
  const [device, setDevice] = React.useState<DeviceMode>("desktop");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('forge_onboarding_dismissed')
  );

  const dismissOnboarding = () => {
    localStorage.setItem('forge_onboarding_dismissed', '1');
    setShowOnboarding(false);
  };
  const previewRef = useRef<ProjectPreviewRef>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`);
      setProject(data.project);
      setIsGenerating(!data.project?.current_code);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [projectId]);

  const saveProject = async () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) return toast.error("Nothing to save");
    try {
      await api.put(`/api/project/save/${projectId}`, { code });
      toast.success("State saved");
      fetchProject();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const downloadCode = () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) return;
    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([code], { type: "text/html" }));
    el.download = `${project?.name || "site"}.html`;
    el.click();
  };

  const togglePublish = async () => {
    try {
      const { data } = await api.get(`/api/user/publish-toggle/${projectId}`);
      toast.success(data.message);
      fetchProject();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (session?.user) fetchProject();
    else if (!isPending && !session?.user) navigate("/");
  }, [session?.user, isPending, navigate, fetchProject]);

  useEffect(() => {
    if (project && !project.current_code) {
      const id = setInterval(fetchProject, 10000);
      return () => clearInterval(id);
    }
  }, [project, fetchProject]);

  useEffect(() => {
    if (!projectId || !project) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const apiHost = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/^https?:\/\//, '')
      : window.location.host;
    const wsUrl = `${protocol}//${apiHost}/ws?projectId=${projectId}`;

    let ws: WebSocket;
    let pollFallback: ReturnType<typeof setInterval> | null = null;

    try {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const { event: eventType, data } = JSON.parse(event.data);
          if (eventType === "job:update") {
            if (data.status === "COMPLETED") {
              setIsGenerating(false);
              fetchProject();
            } else if (data.status === "FAILED") {
              setIsGenerating(false);
              toast.error("Code generation failed. Please try again.");
            }
          }
        } catch (e) {
          console.error("[WS] Parse error:", e);
        }
      };

      ws.onerror = () => {
        console.warn("[WS] Connection failed — falling back to polling");
        pollFallback = setInterval(fetchProject, 5000);
      };

      ws.onclose = () => {
        if (pollFallback) clearInterval(pollFallback);
      };
    } catch (e) {
      console.error("[WS] Failed to initialise:", e);
      pollFallback = setInterval(fetchProject, 5000);
    }

    return () => {
      ws?.close();
      if (pollFallback) clearInterval(pollFallback);
    };
  }, [projectId, project, fetchProject]);

  if (loading) return <CockpitSkeleton />;

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-xs font-bold tracking-wider mb-3 text-slate-400 uppercase">SIGNAL LOST</p>
          <p className="text-sm font-medium mb-4 text-slate-600">Project not found</p>
          <Link to="/projects" className="text-xs font-semibold text-[#E040A0] hover:underline">
            ← RETURN TO BASE
          </Link>
        </div>
      </div>
    );
  }

  const DEVICE_WIDTHS: Record<DeviceMode, string> = {
    phone: "390px",
    tablet: "768px",
    desktop: "100%",
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* ── Cockpit Toolbar ─────────────────────────────────────── */}
      <header className="flex items-center h-14 flex-shrink-0 px-4 gap-4 bg-white border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative z-20">
        {/* Left: Forge logo + project name */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          {/* Logo mark */}
          <button
            onClick={() => navigate("/")}
            className="size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all bg-[#E040A0] hover:bg-[#c9328d] shadow-[0_2px_8px_rgba(224,64,160,0.3)]"
            title="Home"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 10L7 4L12 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-5 flex-shrink-0 bg-slate-200" />

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-2 rounded-lg transition-colors text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            style={{
              color: sidebarOpen ? '#E040A0' : undefined,
              background: sidebarOpen ? '#fdf2f8' : undefined,
            }}
            title="Toggle panel"
          >
            <PanelLeftIcon className="size-4" />
          </button>

          {/* Project name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <p className="text-sm font-semibold truncate max-w-[160px] text-slate-800">
              {project.name}
            </p>
            {isGenerating && (
              <div className="flex items-center gap-1.5 flex-shrink-0 px-2 py-0.5 rounded-full bg-pink-50 border border-pink-100">
                <span className="size-1.5 rounded-full bg-[#E040A0] animate-pulse" />
                <span className="text-[9px] font-bold tracking-wide text-[#E040A0] uppercase">
                  RENDERING
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Device viewport picker */}
        <div className="hidden sm:flex items-center gap-1 mx-auto rounded-xl p-1 bg-slate-100 border border-slate-200/60">
          {([
            { key: 'phone',   Icon: SmartphoneIcon, label: 'MOB' },
            { key: 'tablet',  Icon: TabletIcon,      label: 'TAB' },
            { key: 'desktop', Icon: MonitorIcon,      label: 'DSK' },
          ] as const).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              title={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all"
              style={{
                color: device === key ? '#E040A0' : '#64748b',
                background: device === key ? '#ffffff' : 'transparent',
                boxShadow: device === key ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Right: Action controls */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">

          {/* System Telemetry */}
          <div className="hidden lg:flex items-center gap-4 mr-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-1.5" title="System Load">
              <CpuIcon className="size-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">14%</span>
            </div>
            <div className="flex items-center gap-1.5" title="Network Status">
              <WifiIcon className="size-3.5 text-[#E040A0]" />
              <span className="text-xs font-semibold text-slate-600">32ms</span>
            </div>
          </div>

          {/* Ghost buttons */}
          {[
            { label: "SAVE", Icon: SaveIcon, onClick: saveProject },
            { label: "EXPORT", Icon: DownloadIcon, onClick: downloadCode },
          ].map(({ label, Icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-all active:scale-[0.98]"
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}

          {/* Preview link */}
          <Link
            target="_blank"
            to={`/preview/${projectId}`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-all"
          >
            <FullscreenIcon className="size-3.5" />
            PREVIEW
          </Link>

          {/* Publish — primary CTA */}
          <button
            onClick={togglePublish}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-sm active:scale-[0.98]"
            style={{
              background: project.isPublished
                ? '#64748b'
                : '#E040A0',
              boxShadow: project.isPublished ? 'none' : '0 4px 12px rgba(224, 64, 160, 0.25)',
            }}
          >
            {project.isPublished ? (
              <><EyeOffIcon className="size-3.5" /> UNPUBLISH</>
            ) : (
              <><EyeIcon className="size-3.5" /> DEPLOY</>
            )}
          </button>
        </div>
      </header>

      {/* ── Cockpit Body ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Command Panel */}
        {sidebarOpen && (
          <Sidebar
            isMenuOpen={false}
            project={project}
            setProject={p => setProject(p)}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        )}

        {/* Main Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">

          {/* Viewport label */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md pointer-events-none">
            <SatelliteIcon className="size-3.5 text-[#E040A0]" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500">
              VIEWPORT · {device.toUpperCase()} ·{' '}
              {device === 'phone' ? '390px' : device === 'tablet' ? '768px' : 'FULL'}
            </span>
          </div>

          {/* ── First-time onboarding hint ── */}
          {showOnboarding && project.current_code && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-5 py-4 bg-white/95 border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md max-w-sm w-[calc(100%-32px)] animate-fade-up">
              <div className="size-9 rounded-xl flex-shrink-0 flex items-center justify-center bg-pink-50 border border-pink-100">
                <MousePointerClickIcon className="size-4 text-[#E040A0]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">Click any section to edit it</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select an element, then describe your change in the panel.
                </p>
              </div>
              <button
                onClick={dismissOnboarding}
                className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Dismiss tip"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden pt-14">
            <div
              className="h-full overflow-hidden rounded-2xl transition-all duration-300 bg-white"
              style={{
                width: DEVICE_WIDTHS[device],
                maxWidth: '100%',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
              }}
            >
              <ProjectPreview
                ref={previewRef}
                project={project}
                isGenerating={isGenerating}
                device={device}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
