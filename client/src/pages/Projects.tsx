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
  <div className="flex h-screen w-full" style={{ background: 'var(--void)' }}>
    {/* Sidebar skeleton */}
    <div className="w-[300px] flex-shrink-0" style={{ borderRight: '1px solid var(--seam)', background: 'var(--space)' }}>
      <div className="h-11 skeleton" style={{ borderBottom: '1px solid var(--seam)' }} />
      <div className="p-4 flex flex-col gap-3">
        {[70, 55, 85, 45, 65].map((w, i) => (
          <div key={i} className="skeleton rounded h-3" style={{ width: `${w}%`, opacity: 0.6 }} />
        ))}
      </div>
    </div>
    {/* Canvas skeleton */}
    <div className="flex-1 flex flex-col">
      <div className="h-11 skeleton" style={{ borderBottom: '1px solid var(--seam)' }} />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full h-full skeleton rounded-lg" style={{ opacity: 0.4 }} />
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

  if (loading) return <CockpitSkeleton />;

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--void)' }}>
        <div className="text-center">
          <p className="text-xs font-mono tracking-cosmic mb-3" style={{ color: 'var(--star-3)' }}>SIGNAL LOST</p>
          <p className="text-sm font-medium mb-4" style={{ color: 'var(--star-1)' }}>Project not found</p>
          <Link to="/projects" className="text-xs font-mono tracking-cosmic" style={{ color: 'var(--signal)' }}>
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
    <div
      className="flex flex-col h-screen w-full overflow-hidden"
      style={{ background: 'var(--void)', color: 'var(--star-1)' }}
    >
      {/* ── Cockpit Toolbar ─────────────────────────────────────── */}
      <header
        className="flex items-center h-11 flex-shrink-0 px-3 gap-3"
        style={{
          background: 'rgba(8, 12, 20, 0.95)',
          borderBottom: '1px solid var(--seam)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Left: Forge logo + project name */}
        <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
          {/* Logo mark */}
          <button
            onClick={() => navigate("/")}
            className="size-6 rounded-sm flex items-center justify-center flex-shrink-0 transition-all hover:shadow-[0_0_10px_rgba(239, 68, 68,0.4)]"
            style={{ background: 'linear-gradient(135deg, var(--signal), var(--pulse))' }}
            title="Home"
          >
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M2 10L7 4L12 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Divider */}
          <div className="w-px h-4 flex-shrink-0" style={{ background: 'var(--seam-glow)' }} />

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded transition-colors"
            style={{
              color: sidebarOpen ? 'var(--signal)' : 'var(--star-3)',
              background: sidebarOpen ? 'var(--signal-dim)' : 'transparent',
            }}
            title="Toggle panel"
          >
            <PanelLeftIcon className="size-3.5" />
          </button>

          {/* Project name */}
          <div className="flex items-center gap-2 min-w-0">
            <p className="text-xs font-medium truncate max-w-[160px]" style={{ color: 'var(--star-2)' }}>
              {project.name}
            </p>
            {isGenerating && (
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="animate-signal size-1.5 rounded-full" style={{ background: 'var(--signal)' }} />
                <span className="text-[9px] font-mono tracking-cosmic" style={{ color: 'var(--signal)' }}>
                  RENDERING
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Device viewport picker */}
        <div
          className="hidden sm:flex items-center gap-0.5 mx-auto rounded px-1 py-1"
          style={{ background: 'var(--nebula)', border: '1px solid var(--seam)' }}
        >
          {([
            { key: 'phone',   Icon: SmartphoneIcon, label: 'MOB' },
            { key: 'tablet',  Icon: TabletIcon,      label: 'TAB' },
            { key: 'desktop', Icon: MonitorIcon,      label: 'DSK' },
          ] as const).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setDevice(key)}
              title={label}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-mono tracking-cosmic transition-all"
              style={{
                color: device === key ? 'var(--signal)' : 'var(--star-3)',
                background: device === key ? 'var(--signal-dim)' : 'transparent',
                border: device === key ? '1px solid var(--seam-glow)' : '1px solid transparent',
              }}
            >
              <Icon className="size-3" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Right: Action controls */}
        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">

          {/* System Telemetry */}
          <div className="hidden lg:flex items-center gap-3 mr-4 px-3 py-1 rounded"
            style={{ border: '1px solid var(--seam)', background: 'var(--space)' }}>
            <div className="flex items-center gap-1.5" title="System Load">
              <CpuIcon className="size-2.5" style={{ color: 'var(--star-3)' }} />
              <span className="text-[9px] font-mono tracking-cosmic" style={{ color: 'var(--star-2)' }}>14%</span>
            </div>
            <div className="flex items-center gap-1.5" title="Network Status">
              <WifiIcon className="size-2.5" style={{ color: 'var(--signal)' }} />
              <span className="text-[9px] font-mono tracking-cosmic" style={{ color: 'var(--star-2)' }}>32ms</span>
            </div>
          </div>

          {/* Ghost buttons */}
          {[
            { label: "SAVE", Icon: SaveIcon, onClick: saveProject, hidden: false },
            { label: "EXPORT", Icon: DownloadIcon, onClick: downloadCode, hidden: false },
          ].map(({ label, Icon, onClick, hidden }) => (
            <button
              key={label}
              onClick={onClick}
              className={`${hidden ? 'hidden sm:flex' : 'hidden sm:flex'} items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono tracking-cosmic rounded transition-all hover:text-[var(--signal)] hover:border-[var(--seam-glow)]`}
              style={{ color: 'var(--star-3)', border: '1px solid var(--seam)', background: 'transparent' }}
            >
              <Icon className="size-3" />
              {label}
            </button>
          ))}

          {/* Preview link */}
          <Link
            target="_blank"
            to={`/preview/${projectId}`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono tracking-cosmic rounded transition-all hover:text-[var(--signal)] hover:border-[var(--seam-glow)]"
            style={{ color: 'var(--star-3)', border: '1px solid var(--seam)' }}
          >
            <FullscreenIcon className="size-3" />
            PREVIEW
          </Link>

          {/* Publish — primary CTA */}
          <button
            onClick={togglePublish}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-cosmic rounded text-white transition-all hover:shadow-[0_0_10px_rgba(239, 68, 68,0.2)] active:scale-95"
            style={{
              background: project.isPublished
                ? 'var(--nebula)'
                : 'linear-gradient(135deg, var(--signal), var(--pulse))',
              border: `1px solid ${project.isPublished ? 'var(--seam)' : 'rgba(239, 68, 68,0.3)'}`,
            }}
          >
            {project.isPublished ? (
              <><EyeOffIcon className="size-3" /> UNPUBLISH</>
            ) : (
              <><EyeIcon className="size-3" /> DEPLOY</>
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
        <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: 'var(--void)' }}>

          {/* Viewport label */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-2.5 py-1 rounded hud-corners"
            style={{
              background: 'rgba(8,12,20,0.7)',
              border: '1px solid var(--seam)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          >
            <SatelliteIcon className="size-2.5" style={{ color: 'var(--signal)' }} />
            <span className="text-[9px] font-mono tracking-cosmic" style={{ color: 'var(--star-3)' }}>
              VIEWPORT · {device.toUpperCase()} ·{' '}
              {device === 'phone' ? '390px' : device === 'tablet' ? '768px' : 'FULL'}
            </span>
          </div>

          {/* ── First-time onboarding hint ── */}
          {showOnboarding && project.current_code && (
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-3 rounded-lg hud-corners animate-fade-up"
              style={{
                background: 'rgba(11, 16, 32, 0.92)',
                border: '1px solid var(--seam-glow)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.08)',
                maxWidth: '380px',
                width: 'calc(100% - 40px)',
              }}
            >
              <div className="size-7 rounded flex-shrink-0 flex items-center justify-center"
                style={{ background: 'var(--signal-dim)', border: '1px solid var(--seam-glow)' }}>
                <MousePointerClickIcon className="size-3.5" style={{ color: 'var(--signal)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: 'var(--star-1)' }}>Click any section to edit it</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--star-2)' }}>
                  Select an element, then describe your change in the panel.
                </p>
              </div>
              <button
                onClick={dismissOnboarding}
                className="flex-shrink-0 p-1 rounded transition-colors hover:text-[var(--star-1)] focus-visible:ring-2"
                style={{ color: 'var(--star-3)' }}
                aria-label="Dismiss tip"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-5 overflow-hidden pt-10">
            <div
              className="h-full overflow-hidden rounded-lg transition-all duration-300 hud-corners"
              style={{
                width: DEVICE_WIDTHS[device],
                maxWidth: '100%',
                border: '1px solid var(--seam)',
                boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 1px rgba(239, 68, 68,0.08)',
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
