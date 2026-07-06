import { Globe2, Layers3, Sparkles, Zap } from "lucide-react";

const chips = [
  { icon: Sparkles, label: "多平台 AI 聚合" },
  { icon: Zap, label: "OpenAI 风格接口" },
  { icon: Layers3, label: "统一诊断与日志" },
  { icon: Globe2, label: "全球用户增长面板" },
];

export default function HeroScene() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-16 lg:px-10 lg:pb-24 lg:pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_50%_120%,rgba(124,58,237,0.16),transparent_35%)]" />
      <div className="absolute inset-x-0 top-10 h-[520px] bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
            www.ccwebai.com / growth cockpit
          </div>
          <h1 className="max-w-4xl font-display text-5xl uppercase leading-[0.94] tracking-[0.08em] text-white lg:text-7xl">
            把分散的平台 AI
            <span className="block bg-[linear-gradient(90deg,#b7fff7,#7dd3fc,#c4b5fd)] bg-clip-text text-transparent">
              接成一个可运营的入口
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 lg:text-lg">
            CCWebAI 不只是插件。它把多平台对话能力、统一网关、匿名设备统计、问题治理和全球增长面板接进同一个体系，让免费开源项目也具备真正的产品增长能力。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {chips.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <Icon className="h-4 w-4 text-cyan-300" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0b1120]/80 p-6 shadow-[0_0_80px_rgba(59,130,246,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">mission control</p>
                <p className="mt-2 font-display text-2xl uppercase tracking-[0.2em] text-white">增长驾驶舱</p>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                live
              </div>
            </div>

            <div className="grid gap-4">
              {[
                ["安装曲线", "1,512 / day"],
                ["活跃设备", "4,892 / 7d"],
                ["问题支持榜", "46 supports"],
                ["全球地区覆盖", "27 regions"],
              ].map(([label, value], index) => (
                <div key={label} className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-20 overflow-hidden rounded-2xl bg-[#040813] p-3">
                    <div
                      className="h-full rounded-2xl bg-[linear-gradient(90deg,rgba(34,211,238,0.16),rgba(96,165,250,0.3),rgba(196,181,253,0.22))]"
                      style={{
                        clipPath:
                          index % 2 === 0
                            ? "polygon(0 80%,15% 52%,32% 64%,47% 30%,62% 42%,78% 18%,100% 10%,100% 100%,0 100%)"
                            : "polygon(0 68%,20% 48%,36% 58%,52% 24%,67% 38%,84% 50%,100% 20%,100% 100%,0 100%)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
