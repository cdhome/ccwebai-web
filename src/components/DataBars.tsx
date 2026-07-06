import GlowPanel from "@/components/GlowPanel";

type Item = {
  label: string;
  value: number;
};

export default function DataBars({ title, items }: { title: string; items: Item[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <GlowPanel>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg uppercase tracking-[0.18em] text-white">{title}</h3>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">live ranking</span>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-3 rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#60a5fa,#c4b5fd)]"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlowPanel>
  );
}
