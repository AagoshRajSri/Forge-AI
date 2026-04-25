import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { UserButton } from "@daveyplate/better-auth-ui";
import api from "@/configs/axios";
import { Zap } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { data: session } = authClient.useSession();

  const getCredits = async () => {
    try {
      const { data } = await api.get("/api/user/credits");
      setCredits(data.credits);
    } catch {}
  };

  useEffect(() => {
    if (session?.user) getCredits();
  }, [session?.user]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16"
        style={{
          background: 'rgba(5, 7, 10, 0.7)',
          backdropFilter: 'blur(12px)',
          clipPath: 'polygon(0 0, 100% 0, 100% 75%, 98% 100%, 2% 100%, 0 75%)',
          borderBottom: '1px solid var(--signal-dim)',
        }}
      >
        {/* Hexagonal Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="49" viewBox="0 0 28 49"><path d="M13.9 49L0 41.1V25.2l13.9-7.9L27.8 25.2v15.9L13.9 49zM0 15.9V0l13.9 7.9L27.8 0v15.9l-13.9 7.9L0 15.9z" fill="none" stroke="red" stroke-width="1"/></svg>')`,
            backgroundSize: '14px 24.5px'
          }} />

        {/* Scrolling Hex Telemetry (Top Edge) */}
        <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden opacity-20 pointer-events-none border-b border-[var(--seam)] bg-black/40">
          <div className="flex animate-marquee whitespace-nowrap text-[7px] font-mono tracking-[0.3em] text-[var(--signal)] py-0.5">
            {Array(10).fill("46 4F 52 47 45 5F 4D 41 54 52 49 58 5F 53 59 53 54 45 4D 5F 4F 4E 4C 49 4E 45 5F 56 34 2E 32 2E 30 20 ").join("")}
          </div>
        </div>
        
        {/* Inner alignment container */}
        <div className="w-full flex items-center justify-between px-10 h-full relative mt-3">
          {/* Telemetry Indicator (Left) */}
          <div className="hidden 2xl:flex items-center gap-6 opacity-40 pointer-events-none">
            <div className="flex flex-col">
              <span className="text-[7px] font-mono text-[var(--signal)] uppercase">Kernel_Load</span>
              <div className="w-16 h-1 bg-black/40 rounded-full overflow-hidden border border-[var(--seam)] mt-0.5">
                <div className="h-full bg-[var(--signal)] animate-pulse w-[42%]" />
              </div>
            </div>
            <div className="h-8 w-px bg-[var(--seam)]" />
            <div className="flex flex-col">
              <span className="text-[7px] font-mono text-[var(--star-2)] uppercase">Buffer_State</span>
              <span className="text-[10px] font-mono text-white animate-pulse">OPTIMIZED</span>
            </div>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-6 rounded-sm flex items-center justify-center flex-shrink-0 transition-all group-hover:shadow-[0_0_10px_rgba(239, 68, 68,0.4)]"
              style={{ background: 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 10L7 4L12 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span 
              className="text-sm font-semibold tracking-cosmic" 
              style={{ color: 'var(--star-1)' }}
            >
              FORGE
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-black/20 p-1 rounded border border-[var(--seam)] backdrop-blur-md">
            {[
              { to: "/", label: "HOME" },
              { to: "/projects", label: "PROJECTS" },
              { to: "/community", label: "COLLECTIVE" },
              { to: "/pricing", label: "MATRIX" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="relative group px-4 py-1.5 text-[10px] font-mono tracking-[0.2em] transition-all hover:text-[var(--star-1)]"
                style={{ color: 'var(--star-2)' }}
              >
                <span className="relative z-10">{label}</span>
                <div className="absolute inset-0 bg-[var(--signal-dim)] opacity-0 group-hover:opacity-100 transition-opacity rounded-sm" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--signal)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 relative">
            {/* Telemetry Indicator (Right) */}
            <div className="hidden lg:flex items-center gap-3 mr-4 opacity-30 text-[8px] font-mono pointer-events-none">
              <span className="animate-pulse text-[var(--signal)]">●</span>
              <span>UPLINK_STABLE</span>
            </div>

            {!session?.user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/auth/signin"
                  className="text-[10px] font-mono tracking-widest text-[var(--star-2)] hover:text-[var(--signal)] transition-colors"
                >
                  SIGN_IN
                </Link>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="px-4 py-2 text-[10px] font-mono tracking-[0.2em] text-white transition-all active:scale-95 hud-corners"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--signal), var(--pulse))', 
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)'
                  }}
                >
                  INITIATE_PROTOCOL
                </button>
              </div>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border"
                  style={{ color: 'var(--star-2)', borderColor: 'var(--seam)', background: 'var(--space)' }}>
                  <Zap className="size-2.5" style={{ color: 'var(--signal)' }} />
                  <span className="font-mono tracking-cosmic">{credits}</span>
                </div>
                <UserButton size="icon" />
              </>
            )}

            <button
              className="md:hidden p-1.5 rounded"
              onClick={() => setMenuOpen(v => !v)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                {menuOpen ? (
                  <>
                    <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </>
                ) : (
                  <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-13 flex flex-col"
          style={{ background: 'rgba(5, 7, 10, 0.96)', backdropFilter: 'blur(20px)' }}>
          <div className="divider" />
          <div className="flex flex-col p-4 gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/projects", label: "Projects" },
              { to: "/community", label: "Community" },
              { to: "/pricing", label: "Pricing" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm rounded tracking-cosmic transition-colors hover:text-[var(--signal)]"
                style={{ color: 'var(--star-2)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
