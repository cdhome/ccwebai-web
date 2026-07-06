import GlowPanel from "@/components/GlowPanel";

type Metric = {
  label: string;
  value: string;
  delta: string;
};

export default function MetricGrid({ items }: { items: Metric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <GlowPanel key={item.label} className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.7),transparent)]" />
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.label}</p>
          <p className="mt-4 font-display text-4xl uppercase tracking-[0.14em] text-white">{item.value}</p>
          <p className="mt-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
            {item.delta}
          </p>
        </GlowPanel>
      ))}
    </div>
  );
}
