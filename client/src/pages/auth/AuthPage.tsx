import { useLocation } from "react-router-dom";
import { AuthView } from "@daveyplate/better-auth-ui";

export default function AuthPage() {
  const { pathname } = useLocation();
  const isSignIn = pathname.includes("signin");

  return (
    <main className="flex justify-center items-center min-h-[90vh] px-6 py-12 pt-24 relative overflow-hidden bg-slate-50">
      
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-pink-100/60 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-50/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full relative z-10">
        
        {/* Left Side: System Overview Panel */}
        <div className="hidden lg:flex flex-col justify-center p-12 relative overflow-hidden h-full">
          <div className="relative z-10 max-w-md">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
              Welcome to <span className="text-[#E040A0]">FORGE</span>
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              Join the next generation of modern architects. Synthesize intelligent components, manage dynamic deployments, and command the DOM in real-time.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#E040A0] font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Zero-Latency Synthesis</h4>
                  <p className="text-sm text-slate-500 mt-1">Instant generation cycles keep your creative momentum flowing.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Secure Core</h4>
                  <p className="text-sm text-slate-500 mt-1">Encrypted directive pipelines ensuring your IP remains safe.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex flex-col justify-center w-full max-w-md mx-auto">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {isSignIn ? "Sign back in" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-500">
              {isSignIn ? "Enter your details to access your workspace." : "Get started with Forge today."}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <AuthView
              pathname={pathname}
              classNames={{
                base: "bg-transparent border-none shadow-none",
                header: "mb-4 pt-4 px-6",
                title: "text-lg font-bold text-slate-900 hidden", // hiding since we added our own header
                description: "text-sm text-slate-500 hidden",
                content: "px-6 pb-6",
                footer: "bg-slate-50/50 border-t border-slate-100 p-6 text-sm text-slate-500 text-center",
                form: {
                  input: "bg-white border-slate-200 text-slate-900 text-sm focus:border-[#E040A0] focus:ring-[#E040A0]/20 rounded-xl h-12 shadow-sm transition-all",
                  button: "bg-[#E040A0] hover:bg-[#c9328d] transition-all text-white font-bold rounded-xl h-12 shadow-[0_4px_14px_0_rgba(224,64,160,0.39)] hover:shadow-[0_6px_20px_rgba(224,64,160,0.23)] active:scale-[0.98]",
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
