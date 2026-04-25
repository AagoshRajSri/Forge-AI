import { useLocation } from "react-router-dom";
import { AuthView } from "@daveyplate/better-auth-ui";
// Forced refresh for Vercel build

export default function AuthPage() {
  const { pathname } = useLocation();
  const isSignIn = pathname.includes("signin");

  return (
    <main className="flex justify-center items-center min-h-[90vh] px-6 py-12 pt-24 relative animate-fade-up">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[var(--signal-glow)] opacity-[0.03] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch h-full">
        
        {/* Left Side: System Overview Panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-black/40 backdrop-blur-3xl border border-[var(--seam)] hud-corners relative overflow-hidden group">
          <div className="absolute inset-0 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="2" cy="2" r="1" fill="white"/></svg>')`,
              backgroundSize: '20px 20px'
            }} />
            
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-8 bg-[var(--signal)] rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M2 10L7 4L12 10" stroke="white" strokeWidth="2"/></svg>
              </div>
              <h2 className="text-xl font-bold tracking-[0.3em] font-mono">FORGE_IDENTITY</h2>
            </div>

            <div className="space-y-6">
              <div className="p-4 border border-[var(--seam)] bg-black/20 rounded">
                <p className="text-[10px] font-mono text-[var(--signal)] mb-2 uppercase">Core_Manifesto</p>
                <p className="text-xs leading-relaxed opacity-60 font-light italic">
                  "Architectural dominance is not granted. It is compiled. Synthesize your reality through the Forge Matrix."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-[var(--seam)] bg-black/20 rounded">
                  <span className="text-[18px] font-bold font-mono block">1.2ms</span>
                  <span className="text-[8px] font-mono uppercase opacity-40">Uplink_Latency</span>
                </div>
                <div className="p-4 border border-[var(--seam)] bg-black/20 rounded">
                  <span className="text-[18px] font-bold font-mono block text-[var(--signal)]">ACTIVE</span>
                  <span className="text-[8px] font-mono uppercase opacity-40">Neural_Bridge</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-10">
            <div className="flex items-center gap-4 text-[9px] font-mono tracking-widest opacity-30">
              <span className="animate-pulse">●</span>
              <span>SECURE_CONNECTION_ESTABLISHED</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex flex-col justify-center">
          <div className="text-center lg:text-left mb-10">
            <h1 className="text-4xl font-bold tracking-tighter mb-2 uppercase font-mono"
              style={{
                background: 'linear-gradient(135deg, var(--signal) 0%, var(--pulse) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(239, 68, 68, 0.2)',
              }}>
              {isSignIn ? "ACCESS_GATE" : "NODE_CREATION"}
            </h1>
            <p className="text-[10px] font-mono tracking-widest opacity-50 uppercase" style={{ color: 'var(--star-2)' }}>
              {isSignIn ? "Input identifiers for matrix synchronization" : "Initialize new system identity module"}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-2xl border border-[var(--seam)] p-1 rounded-lg hud-corners holo-input shadow-2xl overflow-hidden">
            <AuthView
              pathname={pathname}
              classNames={{
                base: "bg-transparent border-none shadow-none",
                header: "mb-6 pt-6 px-8",
                title: "text-lg font-bold tracking-tight text-white uppercase font-mono",
                description: "text-[10px] font-mono opacity-50 text-[var(--star-2)]",
                content: "px-8 pb-8",
                input: "bg-black/40 border-[var(--seam)] text-sm font-mono focus:border-[var(--signal)] focus:ring-[var(--signal-dim)] rounded-none h-12",
                button: "bg-[linear-gradient(135deg,var(--signal),var(--pulse))] hover:opacity-90 active:scale-95 text-[10px] font-mono tracking-widest uppercase text-white rounded-none h-12 border border-[rgba(239,68,68,0.3)] shadow-[0_0_15px_rgba(239,68,68,0.15)]",
                footer: "bg-black/20 border-t border-[var(--seam)] p-8 text-[10px] font-mono tracking-tighter text-center",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
