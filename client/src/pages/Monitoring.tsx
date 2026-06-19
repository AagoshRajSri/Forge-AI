import { Activity, Cpu, Wifi, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const METRICS = [
  { label: "Avg. Generation Time", value: "42s", sub: "last 24h", color: "text-[#E040A0]" },
  { label: "Successful Builds", value: "99.2%", sub: "all time", color: "text-green-500" },
  { label: "WebSocket Uptime", value: "100%", sub: "last 30 days", color: "text-blue-500" },
  { label: "Avg. Revision Time", value: "14s", sub: "last 24h", color: "text-purple-500" },
];

const SERVICES = [
  { name: "API Server", status: "Operational", icon: <Cpu className="w-4 h-4" /> },
  { name: "WebSocket Gateway", status: "Operational", icon: <Wifi className="w-4 h-4" /> },
  { name: "AI Model Inference", status: "Operational", icon: <Activity className="w-4 h-4" /> },
  { name: "Database", status: "Operational", icon: <CheckCircle2 className="w-4 h-4" /> },
  { name: "File Storage", status: "Operational", icon: <Clock className="w-4 h-4" /> },
];

export default function Monitoring() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#E040A0] rounded-lg flex items-center justify-center shadow-[0_4px_12px_rgba(224,64,160,0.3)]">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-bold tracking-widest text-[#E040A0] uppercase">Monitoring</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3">System Status</h1>
              <p className="text-slate-500 text-lg">Real-time health of the FORGE infrastructure.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-green-600">All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <p className={`text-3xl font-extrabold mb-1 ${m.color}`}>{m.value}</p>
              <p className="text-xs font-semibold text-slate-700">{m.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Service Status */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Services</h2>
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-10">
          {SERVICES.map((s) => (
            <div key={s.name} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                  {s.icon}
                </div>
                <span className="text-sm font-semibold">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-green-600">{s.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incident log */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Incident Log</h2>
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No incidents in the last 90 days.</p>
        </div>
      </div>
    </div>
  );
}
