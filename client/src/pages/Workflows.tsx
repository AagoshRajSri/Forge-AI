import { GitBranch, ArrowRight, Wand2, Layers, RefreshCcw, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const STEPS = [
  { icon: <Wand2 className="w-5 h-5 text-[#E040A0]" />, title: "1. Prompt", desc: "Describe the website you want. Be as detailed or as brief as you like — FORGE handles the rest.", color: "bg-pink-50 border-pink-100" },
  { icon: <Layers className="w-5 h-5 text-purple-500" />, title: "2. Generate", desc: "Your request is enhanced by AI and sent to our 32B code model, which synthesizes a complete, styled website.", color: "bg-purple-50 border-purple-100" },
  { icon: <Eye className="w-5 h-5 text-blue-500" />, title: "3. Preview", desc: "Your site renders live in an isolated viewport. Switch between mobile, tablet, and desktop instantly.", color: "bg-blue-50 border-blue-100" },
  { icon: <RefreshCcw className="w-5 h-5 text-green-500" />, title: "4. Refine", desc: "Click any section, describe a change, and FORGE applies it precisely — preserving your full design.", color: "bg-green-50 border-green-100" },
];

export default function Workflows() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#E040A0] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(224,64,160,0.3)]">
              <GitBranch className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#E040A0] uppercase">Workflows</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">How FORGE Works</h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            A simple, powerful pipeline from idea to deployed website in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[28px] top-10 bottom-10 w-px bg-gradient-to-b from-[#E040A0]/30 via-purple-200 to-blue-200 hidden md:block" />

          <div className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className={`w-14 h-14 rounded-2xl border flex-shrink-0 flex items-center justify-center ${step.color} relative z-10`}>
                  {step.icon}
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 flex-1 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Version Control callout */}
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="w-5 h-5 text-[#E040A0]" />
            <h3 className="text-lg font-bold text-slate-900">Built-in Version Control</h3>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Every generation creates a saved version. Roll back to any previous state instantly — no data is ever lost.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#E040A0] hover:underline">
            Start your first build <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
