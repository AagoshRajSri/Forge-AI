import { useEffect, useState } from "react";

const STEPS = [
  { label: "Intercepting parameters", sub: "Analyzing architectural request" },
  { label: "Assimilating layout matrix", sub: "Compiling structural grid" },
  { label: "Sequencing DOM elements", sub: "Enforcing new order" },
  { label: "Executing integrity checks", sub: "Resolving anomalies" },
  { label: "Severing redundant ties", sub: "Optimization complete" },
  { label: "Finalizing Forge protocol", sub: "Systems nominal" },
];

const LoaderSteps = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIdx(i => Math.min(i + 1, STEPS.length - 1));
    }, 18000);

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return p + 0.02;
        return p + 0.35;
      });
    }, 250);

    const elapsedInterval = setInterval(() => {
      setElapsed(s => s + 1);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(elapsedInterval);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: 'var(--void)' }}
    >
      {/* Soft background nebula */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(239, 68, 68,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-xs w-full px-6">

        {/* Orbit ring */}
        <div className="relative size-24 flex items-center justify-center hud-corners" style={{ padding: '4px' }}>
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" fill="none">
            {/* Outer tech ring */}
            <circle cx="50" cy="50" r="48" stroke="var(--seam)" strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="50" cy="50" r="42" stroke="var(--seam-glow)" strokeWidth="1" opacity="0.3" />
            
            {/* Progress arc */}
            <circle
              cx="50" cy="50" r="42"
              stroke="url(#progressGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - Math.min(progress, 98) / 100)}`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            
            {/* Inner tech crosshair */}
            <line x1="50" y1="15" x2="50" y2="25" stroke="var(--signal)" strokeWidth="1" opacity="0.5" />
            <line x1="50" y1="75" x2="50" y2="85" stroke="var(--signal)" strokeWidth="1" opacity="0.5" />
            <line x1="15" y1="50" x2="25" y2="50" stroke="var(--signal)" strokeWidth="1" opacity="0.5" />
            <line x1="75" y1="50" x2="85" y2="50" stroke="var(--signal)" strokeWidth="1" opacity="0.5" />
            
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--signal)" />
                <stop offset="100%" stopColor="var(--pulse)" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center percent */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-mono font-medium tracking-cosmic text-white text-shadow-signal">
              {Math.floor(Math.min(progress, 98))}
            </span>
          </div>
        </div>

        {/* Step label */}
        <div className="text-center">
          <p
            key={stepIdx}
            className="text-sm font-medium mb-1 animate-fade-up tracking-tight"
            style={{ color: 'var(--star-1)' }}
          >
            {STEPS[stepIdx].label}
          </p>
          <p
            key={`sub-${stepIdx}`}
            className="text-xs font-mono animate-fade-up"
            style={{ color: 'var(--star-3)', letterSpacing: '0.06em' }}
          >
            {STEPS[stepIdx].sub}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-400"
              style={{
                width: i === stepIdx ? '18px' : '4px',
                height: '3px',
                background: i < stepIdx
                  ? 'var(--signal)'
                  : i === stepIdx
                    ? 'linear-gradient(90deg, var(--signal), var(--pulse))'
                    : 'var(--seam-glow)',
              }}
            />
          ))}
        </div>

        {/* HUD info row */}
        <div className="flex items-center justify-between w-full text-[10px] font-mono tracking-cosmic"
          style={{ color: 'var(--star-2)', borderTop: '1px solid var(--seam)', paddingTop: '12px' }}>
          <span>FORGE·SYNC v{stepIdx + 1}.0</span>
          <span>T+{formatTime(elapsed)}</span>
          <span style={{ color: 'var(--signal)' }}>ETA ~2m</span>
        </div>
      </div>
    </div>
  );
};

export default LoaderSteps;
