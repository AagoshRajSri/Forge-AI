import api from "@/configs/axios";
import { authClient } from "@/lib/auth-client";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Rocket, Zap, Shield, Network, LayoutTemplate, ArrowRight } from "lucide-react";

const Home = () => {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [scrollY, setScrollY] = React.useState(0);
  const textareaRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return toast.error("Authentication required to initialize build sequence");
    if (!input.trim()) return toast.error("Provide mission parameters");

    try {
      setLoading(true);
      const { data } = await api.post("/api/user/project", { initial_prompt: input });
      navigate(`/projects/${data.projectId}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden font-sans">
      
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center pt-32 pb-12 px-6 relative z-10">
        
        {/* Background ambient glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

        {/* Parallax 3D Elements */}
        {/* Shape 1: Top right pink sphere */}
        <div 
          className="absolute top-[10%] right-[15%] w-32 h-32 rounded-full pointer-events-none opacity-60 mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #f472b6, #db2777)',
            boxShadow: '-10px 20px 30px rgba(219, 39, 119, 0.2)',
            transform: `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.1}deg) scale(${1 + scrollY * 0.0005})`,
          }}
        />

        {/* Shape 2: Bottom left blue sphere */}
        <div 
          className="absolute top-[35%] left-[10%] w-48 h-48 rounded-full pointer-events-none opacity-50 mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #93c5fd, #2563eb)',
            boxShadow: '10px 20px 40px rgba(37, 99, 235, 0.2)',
            transform: `translateY(${scrollY * -0.2}px) scale(${1 - scrollY * 0.0002})`,
          }}
        />

        {/* Shape 3: Middle right small magenta sphere */}
        <div 
          className="absolute top-[30%] right-[5%] w-16 h-16 rounded-full pointer-events-none opacity-80 mix-blend-multiply z-10"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #f9a8d4, #E040A0)',
            boxShadow: '-5px 10px 20px rgba(224, 64, 160, 0.3)',
            transform: `translateY(${scrollY * -0.5}px) translateX(${scrollY * 0.2}px)`,
          }}
        />

        {/* Shape 4: Top left purple pill */}
        <div 
          className="absolute top-[15%] left-[20%] w-24 h-40 rounded-full pointer-events-none opacity-40 mix-blend-multiply"
          style={{
            background: 'linear-gradient(135deg, #c084fc, #7e22ce)',
            boxShadow: '10px 10px 30px rgba(126, 34, 206, 0.2)',
            transform: `translateY(${scrollY * 0.2}px) rotate(${45 + scrollY * -0.05}deg)`,
          }}
        />

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#fdf2f8] border border-[#fbcfe8] rounded-full mb-8">
          <Zap className="w-3.5 h-3.5 text-[#E040A0]" />
          <span className="text-xs font-bold tracking-wide text-[#E040A0] uppercase">
            V2.4 ENGINE DEPLOYED
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center max-w-4xl leading-[1.1] mb-6 text-slate-900">
          Synthesize the web.<br />
          <span className="text-[#E040A0] italic">Command the DOM.</span>
        </h1>

        <p className="text-center text-slate-500 text-lg max-w-2xl mb-12">
          A premium AI build system for modern architects. Input your directive and watch the future unfold in real-time.
        </p>

        {/* Command Input */}
        <form 
          onSubmit={onSubmit}
          className="w-full max-w-3xl flex items-center bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-2 relative z-20 transition-all focus-within:shadow-[0_8px_30px_rgba(224,64,160,0.1)] focus-within:border-[#E040A0]/20"
        >
          <div className="pl-4 pr-3 py-3 flex-shrink-0">
            <div className="w-6 h-4 border-2 border-[#E040A0] rounded-sm relative flex items-center justify-center">
              <div className="w-3 h-0.5 bg-[#E040A0]" />
            </div>
          </div>
          <input
            ref={textareaRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Type your directive here... e.g., 'Architecture portfolio'"
            className="flex-1 bg-transparent border-none outline-none text-slate-700 text-lg px-2 placeholder:text-slate-300"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 px-8 py-4 bg-[#E040A0] hover:bg-[#c9328d] text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(224,64,160,0.39)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Initiate Protocol"}
            <Rocket className="w-4 h-4" />
          </button>
        </form>

        {/* 3D Visual Element */}
        <div className="mt-16 relative w-full max-w-4xl mx-auto flex justify-center">
          
          {/* Shape 5: Parallax element behind the image */}
          <div 
            className="absolute top-[20%] right-[0%] w-40 h-40 rounded-3xl pointer-events-none opacity-40 mix-blend-multiply"
            style={{
              background: 'linear-gradient(135deg, #f472b6, #818cf8)',
              boxShadow: '0px 10px 40px rgba(244, 114, 182, 0.3)',
              transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.2}deg)`,
            }}
          />
          <div 
            className="absolute top-[60%] left-[5%] w-20 h-20 rounded-full pointer-events-none opacity-60 mix-blend-multiply z-10"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #38bdf8, #3b82f6)',
              boxShadow: '-5px 10px 20px rgba(56, 189, 248, 0.3)',
              transform: `translateY(${scrollY * -0.3}px) translateX(${scrollY * -0.1}px)`,
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent z-10 pointer-events-none" />
          {/* A soft glowing drop shadow behind the image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#E040A0]/20 blur-[80px] rounded-full pointer-events-none" />
          
          <img 
            src="/forge_hero.png" 
            alt="Forge Abstract Core" 
            className="relative z-0 w-full max-w-2xl object-contain mix-blend-multiply opacity-90 rounded-3xl"
          />
        </div>
      </main>

      {/* ── Feature Grid ──────────────────────────────────────────────────── */}
      <section className="w-full relative z-20 overflow-hidden bg-white/40 backdrop-blur-3xl">
        
        {/* Shape 6: Feature Grid Right Orange-Pink Sphere */}
        <div 
          className="absolute top-[10%] right-[5%] w-56 h-56 rounded-full pointer-events-none opacity-30 mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fb923c, #f43f5e)',
            boxShadow: '10px 20px 40px rgba(244, 63, 94, 0.2)',
            transform: `translateY(${(scrollY - 500) * -0.15}px) scale(${1 + (scrollY - 500) * 0.0003})`,
          }}
        />

        {/* Shape 7: Feature Grid Left Blue Pill */}
        <div 
          className="absolute bottom-[20%] left-[2%] w-32 h-64 rounded-full pointer-events-none opacity-20 mix-blend-multiply"
          style={{
            background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
            boxShadow: '-10px 10px 30px rgba(139, 92, 246, 0.2)',
            transform: `translateY(${(scrollY - 500) * 0.25}px) rotate(${30 + (scrollY - 500) * 0.05}deg)`,
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Architecture at Speed</h2>
              <p className="text-slate-500 max-w-md">
                The FORGE engine utilizes structural AI to maintain peak performance across complex deployments.
              </p>
            </div>
            <a href="#" className="flex items-center gap-2 text-[#E040A0] font-semibold text-sm hover:underline">
              View Architecture Specs <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Zero-Latency Synthesis",
                desc: "Instant generation cycles that keep your creative momentum flowing without interruption.",
                icon: <Zap className="w-5 h-5 text-[#E040A0]" />,
                bg: "bg-pink-50",
              },
              {
                title: "Secure Core",
                desc: "Encrypted directive pipelines ensuring your intellectual property remains within your perimeter.",
                icon: <Shield className="w-5 h-5 text-blue-500" />,
                bg: "bg-blue-50",
              },
              {
                title: "Multi-Node",
                desc: "Distribute your workloads across a global mesh of specialized inference clusters.",
                icon: <Network className="w-5 h-5 text-purple-500" />,
                bg: "bg-purple-50",
              },
              {
                title: "Structural AI",
                desc: "Intelligent layout orchestration that understands hierarchy and spatial relationships.",
                icon: <LayoutTemplate className="w-5 h-5 text-slate-600" />,
                bg: "bg-slate-100",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all">
                <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="w-full bg-white border-t border-slate-100 py-8 mt-auto relative overflow-hidden">
        {/* Shape 8: Footer Bottom Parallax Glow */}
        <div 
          className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-3/4 h-64 rounded-[100%] pointer-events-none opacity-30 mix-blend-multiply"
          style={{
            background: 'radial-gradient(ellipse at center, #f472b6, transparent 70%)',
            transform: `translateY(${(scrollY - 1000) * -0.1}px)`,
          }}
        />

        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-tight text-[#E040A0]">
              FORGE
            </span>
            <span className="text-xs text-slate-400">
              © 2026 FORGE AI · Built by{" "}
              <span className="text-slate-600 font-medium">Aagosh Raj Srivastava</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-800 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-800 transition-colors">API Reference</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
