import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  Cpu,
  Layers3,
  Orbit,
  ShieldCheck,
  Workflow,
  Wrench,
} from "lucide-react";
import type { OverviewMetric } from "../../shared/portal";
import ArchitectureFlowScene from "@/components/ArchitectureFlowScene";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import GlowPanel from "@/components/GlowPanel";
import { usePortalStore } from "@/store/usePortalStore";

const whyChooseCards = [
  {
    index: "01",
    title: "协议平替：标准 API 原生对齐",
    badge: "OpenAI Compatible",
    icon: Workflow,
    points: [
      "全面兼容 `/v1/chat/completions` 接口规范",
      "完美对接打字机式 SSE 文本流",
      "内置 Tool Call 拦截解析，客户端侧无需改造",
    ],
  },
  {
    index: "02",
    title: "全模态重构：Web 算力本地解禁",
    badge: "Multimodal Bridge",
    icon: Orbit,
    points: [
      "本地图片自动转 Blob，并模拟网页异步上传",
      "动态监测网页生成结果，秒级提取高清图片",
      "支持提取腾讯元宝等平台生成的 `.mp4` 视频地址",
    ],
  },
  {
    index: "03",
    title: "核心护城河：Host 侧自适应滑窗",
    badge: "Adaptive Sliding Window",
    icon: Cpu,
    points: [
      "自动裁剪超长历史，仅保留最新核心上下文",
      "自动合并深层多轮乱序 Role，降低网页拒答率",
      "精准提炼关键域，突破网页输入框长度天花板",
    ],
  },
  {
    index: "04",
    title: "跨越壁垒：多平台支持与自由切换",
    badge: "Unified Routing",
    icon: Layers3,
    points: [
      "无缝聚合豆包、元宝、Gemini、文心等主流平台",
      "侧边栏控制中心可一键热切底层平台",
      "屏蔽各平台底层差异，对外保持统一调用体验",
    ],
  },
  {
    index: "05",
    title: "极致体验：无感部署与免登录",
    badge: "Zero Friction",
    icon: Wrench,
    points: [
      "无需配置，不绑定任何官方或第三方 API Key",
      "网关本身免登录，不设注册和身份门槛",
      "支持 Chatbox、Dify、NextChat 等通用客户端挂载",
    ],
  },
  {
    index: "06",
    title: "透明共享：生态资讯与匿名审计",
    badge: "Privacy First",
    icon: ShieldCheck,
    points: [
      "核心对话流量纯本地中转，不上传隐私文本",
      "中心端仅做匿名活跃度统计与资讯分发",
      "用透明广告收益反哺开源维护与持续更新",
    ],
  },
] as const;

const faqs = [
  ["它免费吗？", "免费。开源导向。纯本地转发。"],
  ["要填 API Key 吗？", "不用。直接复用网页端能力。"],
  ["数据会出网吗？", "不走第三方云转发。走本地链路。"],
  ["支持哪些客户端？", "Codex、Cursor、CC Switch 及标准 OpenAI 客户端。"],
  ["怎么反馈问题？", "进官网问题中心。直接提交。带日志。"],
  ["支持哪些平台？", "当前已接入 DeepSeek、豆包、元宝、文心、Gemini、Kimi。"],
];

export default function Home() {
  const { overview, loadOverview, error } = usePortalStore();

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const metricItems: Pick<OverviewMetric, "label" | "value">[] = overview?.metrics || [
    { label: "累计安装量", value: "--" },
    { label: "7日累计对话数", value: "--" },
    { label: "7日活跃设备数", value: "--" },
    { label: "覆盖全球国家数", value: "--" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10 lg:pt-16">
        <section id="download" className="relative overflow-hidden py-8 lg:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(16,185,129,0.14),transparent_22%),radial-gradient(circle_at_78%_24%,rgba(59,130,246,0.16),transparent_26%),radial-gradient(circle_at_50%_78%,rgba(255,255,255,0.05),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:88px_88px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.14fr_0.86fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Free · Open · Local First
              </div>
              <h1 className="mt-6 max-w-5xl font-display text-4xl uppercase leading-[0.95] tracking-[0.06em] text-white lg:text-6xl">
                桥接 Web 免费算力，
                <span className="block bg-[linear-gradient(90deg,#ffffff,#10B981,#3B82F6)] bg-clip-text text-transparent">
                  零成本驱动本地 AI 应用
                </span>
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300 lg:text-base">
                开源、免费、无感部署的 <strong className="text-white">本地 AI 多模态网关</strong>。
                只需一个浏览器插件，即可将豆包、元宝、Gemini 等网页端算力，一键转化为标准的
                <strong className="text-white"> OpenAI 格式 API</strong>，无缝对接 Codex、Cursor、CC Switch 及各类客户端。
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/download"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500 px-6 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.28)] transition hover:bg-emerald-400"
                >
                  <ArrowDownToLine className="h-5 w-5" />
                  一键下载 CC-WebAI 完整包
                </Link>
                <a
                  href="/issues"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  查看问题中心
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-4 text-sm text-slate-400">
                包含 Chrome 插件 + 跨平台本地 Host 守护进程 | 支持 Win / Mac / Linux
              </div>
              <div className="mt-5 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-white">
                🛡️ 100% 开源安全 | 纯本地数据转发 | 无需配置任何 API Key
              </div>
              {error ? <p className="mt-4 text-sm text-amber-300">实时看板读取失败：{error}</p> : null}

            </div>

            <div className="flex flex-col gap-6 lg:max-w-[460px] lg:justify-self-end">
              <div className="relative min-h-[380px]">
                <div className="absolute left-[8%] top-[10%] h-40 w-40 rounded-full bg-emerald-500/14 blur-3xl" />
                <div className="absolute right-[8%] top-[18%] h-44 w-44 rounded-full bg-blue-500/16 blur-3xl" />
                <div className="absolute inset-x-[13%] top-[8%] h-[72%] rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_30px_120px_rgba(0,0,0,0.36)] backdrop-blur-md">
                  <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_30%)]" />
                  <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-slate-400">
                    <span>CC-WebAI Flow</span>
                    <span>OpenAI Compatible</span>
                  </div>
                  <div className="absolute left-6 right-6 top-16 flex items-center justify-between">
                    <div className="rounded-2xl border border-white/8 bg-[#0f1727]/72 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Input</div>
                      <div className="mt-2 font-display text-xl uppercase tracking-[0.08em] text-white">/v1/chat/completions</div>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/18 bg-emerald-500/8 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-300/70">Output</div>
                      <div className="mt-2 font-display text-xl uppercase tracking-[0.08em] text-white">Web AI Responses</div>
                    </div>
                  </div>

                  <div className="absolute inset-x-10 bottom-10 top-32">
                    <div className="absolute left-[6%] top-[8%] h-4 w-4 rounded-full bg-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.65)] animate-[pulse_2.8s_ease-in-out_infinite]" />
                    <div className="absolute left-[30%] top-[28%] h-4 w-4 rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.75)] animate-[pulse_3.2s_ease-in-out_infinite_0.4s]" />
                    <div className="absolute left-[48%] top-[12%] h-5 w-5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.8)] animate-[pulse_2.6s_ease-in-out_infinite_0.2s]" />
                    <div className="absolute left-[68%] top-[38%] h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.8)] animate-[pulse_3s_ease-in-out_infinite_0.6s]" />
                    <div className="absolute right-[8%] top-[18%] h-5 w-5 rounded-full bg-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.85)] animate-[pulse_2.4s_ease-in-out_infinite]" />
                    <div className="absolute inset-0">
                      <svg className="h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none" role="img" aria-label="CC-WebAI Hero 流转图">
                        <defs>
                          <linearGradient id="heroFlow" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.75" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.75" />
                          </linearGradient>
                          <filter id="heroFlowGlow">
                            <feGaussianBlur stdDeviation="1.1" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <path
                          d="M6 10 C18 12, 24 32, 34 26 S50 7, 56 12 S72 34, 82 21 S90 8, 94 12"
                          fill="none"
                          stroke="rgba(255,255,255,0.10)"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M6 10 C18 12, 24 32, 34 26 S50 7, 56 12 S72 34, 82 21 S90 8, 94 12"
                          fill="none"
                          stroke="url(#heroFlow)"
                          strokeWidth="0.9"
                          strokeDasharray="2.2 1.6"
                          filter="url(#heroFlowGlow)"
                        >
                          <animate attributeName="stroke-dashoffset" values="0;-18" dur="2.4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.78;1;0.82;0.96;0.78" dur="3.6s" repeatCount="indefinite" />
                        </path>
                        <circle r="1.1" fill="#93C5FD" filter="url(#heroFlowGlow)">
                          <animateMotion dur="2.6s" repeatCount="indefinite" path="M6 10 C18 12, 24 32, 34 26 S50 7, 56 12 S72 34, 82 21 S90 8, 94 12" />
                          <animate attributeName="opacity" values="0.3;1;0.4" dur="2.6s" repeatCount="indefinite" />
                        </circle>
                        <circle r="0.95" fill="#6EE7B7" filter="url(#heroFlowGlow)">
                          <animateMotion dur="2.6s" begin="1.2s" repeatCount="indefinite" path="M6 10 C18 12, 24 32, 34 26 S50 7, 56 12 S72 34, 82 21 S90 8, 94 12" />
                          <animate attributeName="opacity" values="0.35;0.95;0.35" dur="2.6s" begin="1.2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="34" cy="26" r="2.2" fill="rgba(147,197,253,0.08)">
                          <animate attributeName="r" values="1.7;2.7;1.7" dur="2.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2.8s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="82" cy="21" r="2.2" fill="rgba(52,211,153,0.10)">
                          <animate attributeName="r" values="1.8;2.9;1.8" dur="2.3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.16;0.38;0.16" dur="2.3s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-1 bottom-8 rounded-2xl border border-white/10 bg-[#0d1422]/90 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.36)]">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Browser Extension</div>
                  <div className="mt-2 text-sm font-semibold text-white">内容拦截 / DOM 回传 / 会话桥接</div>
                </div>
                <div className="absolute right-0 top-6 rounded-2xl border border-emerald-500/18 bg-[#0d1422]/90 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.36)]">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-emerald-300/70">No API Key</div>
                  <div className="mt-2 text-sm font-semibold text-white">本地转发 · 无感接入 · 免费可用</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {metricItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-h-[108px] flex-col items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="font-display text-2xl uppercase tracking-[0.06em] text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">Architecture</p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.12em] text-white">核心流量路由架构</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              本地接口完全兼容 OpenAPI 标准接口。客户端无需改工作流，只需要把目标地址指向本地网关。
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                <strong className="text-white">1.</strong> 客户端继续调用 OpenAI 风格接口。
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                <strong className="text-white">2.</strong> 本地 Host 接住 `http://localhost:18000/v1` 请求。
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                <strong className="text-white">3.</strong> 浏览器插件负责把请求桥接到网页端平台。
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
                <strong className="text-white">4.</strong> 回答按流式逐段回传到客户端。
              </div>
            </div>
          </div>

          <div className="lg:max-w-[760px] lg:justify-self-end">
            <ArchitectureFlowScene />
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">Why Choose CCWebAI</p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.1em] text-white lg:text-4xl">为什么选择 CCWebAI</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              不只是把网页端模型接出来，而是把协议兼容、多模态桥接、上下文治理、平台切换和本地安全边界一起做完整。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {whyChooseCards.map((card) => {
              const Icon = card.icon;

              return (
                <GlowPanel
                  key={card.title}
                  className="group relative overflow-hidden border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-0"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%)] opacity-80" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.7),rgba(16,185,129,0.8),transparent)]" />
                  <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full bg-emerald-500/8 blur-2xl transition duration-500 group-hover:bg-emerald-500/12" />

                  <div className="relative p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                        <Icon className="h-[18px] w-[18px]" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{card.badge}</div>
                        <h3 className="mt-2 font-display text-lg uppercase leading-snug tracking-[0.04em] text-white lg:text-xl">
                          {card.title}
                        </h3>
                      </div>
                      <div className="font-display text-2xl text-slate-700">{card.index}</div>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {card.points.map((point: string) => (
                        <div key={point} className="flex items-start gap-2.5 text-xs leading-6 text-slate-300 sm:text-[13px]">
                          <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(16,185,129,0.25),rgba(59,130,246,0.12),transparent)]" />
                    </div>

                  </div>
                </GlowPanel>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">FAQ</p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.12em] text-white">常见问题</h2>
          </div>
          <div className="grid gap-4">
            {faqs.map(([question, answer], index) => (
              <GlowPanel key={question} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-sm font-semibold text-blue-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{question}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{answer}</p>
                </div>
              </GlowPanel>
            ))}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
