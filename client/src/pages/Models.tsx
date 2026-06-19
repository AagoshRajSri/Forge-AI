import { Brain, Zap, Shield, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const MODELS = [
  {
    name: "Qwen 2.5 Coder 32B",
    tag: "Primary",
    desc: "Our flagship model for full website generation. Produces production-ready, richly designed HTML with animations.",
    speed: "~45s",
    quality: "Premium",
    color: "bg-pink-50 border-pink-100",
    iconColor: "text-[#E040A0]",
    badge: "bg-[#E040A0] text-white",
  },
  {
    name: "Qwen 2.5 Coder 7B",
    tag: "Revisions",
    desc: "Faster, lighter model used for targeted edits and revisions to existing websites.",
    speed: "~15s",
    quality: "Fast",
    color: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-500",
    badge: "bg-blue-500 text-white",
  },
];

const FEATURES = [
  { icon: <Zap className="w-5 h-5 text-[#E040A0]" />, title: "Low Latency", desc: "Optimized inference pipelines keep generation fast." },
  { icon: <Shield className="w-5 h-5 text-blue-500" />, title: "Secure", desc: "Your prompts and code are never stored or shared." },
  { icon: <Globe className="w-5 h-5 text-purple-500" />, title: "Global CDN", desc: "Model endpoints are distributed across multiple regions." },
  { icon: <Sparkles className="w-5 h-5 text-amber-500" />, title: "Context-Aware", desc: "Models understand your full site history for consistent edits." },
];

export default function Models() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-pink-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#E040A0] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(224,64,160,0.3)]">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#E040A0] uppercase">AI Models</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Inference Engine</h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            FORGE uses state-of-the-art code generation models, automatically selecting the best one for your task.
          </p>
        </div>

        {/* Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {MODELS.map((model) => (
            <div key={model.name} className={`bg-white rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${model.color}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${model.color}`}>
                  <Brain className={`w-5 h-5 ${model.iconColor}`} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${model.badge}`}>{model.tag}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{model.name}</h3>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{model.desc}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>⚡ {model.speed} avg</span>
                <span>✦ {model.quality} output</span>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Infrastructure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">{f.title}</h4>
              <p className="text-xs text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#E040A0] hover:bg-[#c9328d] text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(224,64,160,0.3)] transition-all">
          Start Building <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
