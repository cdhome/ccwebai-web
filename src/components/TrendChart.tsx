import GlowPanel from "@/components/GlowPanel";

type Point = {
  date: string;
  value: number;
};

function buildPath(points: Point[]) {
  const max = Math.max(...points.map((point) => point.value), 1);
  const stepX = 100 / Math.max(points.length - 1, 1);

  return points
    .map((point, index) => {
      const x = index * stepX;
      const y = 100 - (point.value / max) * 100;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function TrendChart({ title, points }: { title: string; points: Point[] }) {
  const path = buildPath(points);

  return (
    <GlowPanel>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg uppercase tracking-[0.18em] text-white">{title}</h3>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-400">{points.length} days</span>
      </div>
      <div className="rounded-[24px] border border-white/6 bg-[#050918] p-4">
        <svg viewBox="0 0 100 100" className="h-48 w-full">
          <defs>
            <linearGradient id={`line-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </linearGradient>
          </defs>
          <path d={`${path} L 100 100 L 0 100 Z`} fill="rgba(34, 211, 238, 0.08)" />
          <path d={path} fill="none" stroke={`url(#line-${title})`} strokeWidth="2.6" />
        </svg>
        <div className="mt-3 flex justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
          {points.map((point) => (
            <span key={point.date}>{point.date}</span>
          ))}
        </div>
      </div>
    </GlowPanel>
  );
}
