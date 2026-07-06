const platforms = [
  { name: "豆包", x: 180, tone: "blue" },
  { name: "元宝", x: 340, tone: "green" },
  { name: "Gemini", x: 500, tone: "blue" },
  { name: "文心", x: 660, tone: "green" },
] as const;

export default function ArchitectureFlowScene() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,14,24,0.96),rgba(13,20,35,0.78))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <div className="rounded-[22px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_26%),linear-gradient(180deg,#0d1422,#0b0f19)] px-4 py-5 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Flow Diagram</p>
            <h3 className="mt-2 font-display text-xl uppercase tracking-[0.08em] text-white">本地接口完全兼容OpenAPI标准接口</h3>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-blue-100">
              蓝色 = 请求
            </span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-100">
              绿色 = SSE 回流
            </span>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[780px]">
            <svg viewBox="0 0 840 320" className="h-auto w-full" role="img" aria-label="CC-WebAI 架构流程图">
              <defs>
                <linearGradient id="requestStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="streamStroke" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.55" />
                </linearGradient>
                <filter id="blueGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="greenGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M420 84 L420 138 L420 192 L420 228"
                fill="none"
                stroke="url(#requestStroke)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                opacity="0.85"
              />
              <path
                d="M420 250 L420 270 Q420 286 404 286 L340 286"
                fill="none"
                stroke="url(#requestStroke)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                opacity="0.85"
              />
              <path
                d="M340 286 L404 286 Q420 286 420 270 L420 250 L420 192 L420 138 L420 84"
                fill="none"
                stroke="url(#streamStroke)"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                opacity="0.85"
              />

              {platforms
                .filter((platform) => platform.x !== 340)
                .map((platform) => (
                  <path
                    key={platform.name}
                    d={`M420 286 L${platform.x} 286`}
                    fill="none"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="1.5"
                    strokeDasharray="5 8"
                  />
                ))}

              <circle r="7" fill="#60A5FA" filter="url(#blueGlow)">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M420 84 L420 138 L420 192 L420 228 L420 250 L420 270 Q420 286 404 286 L340 286" />
              </circle>
              <circle r="5" fill="#93C5FD" filter="url(#blueGlow)" opacity="0.82">
                <animateMotion dur="2.8s" begin="0.8s" repeatCount="indefinite" path="M420 84 L420 138 L420 192 L420 228 L420 250 L420 270 Q420 286 404 286 L340 286" />
              </circle>
              <circle r="7" fill="#10B981" filter="url(#greenGlow)">
                <animateMotion dur="2.2s" begin="0.4s" repeatCount="indefinite" path="M340 286 L404 286 Q420 286 420 270 L420 250 L420 192 L420 138 L420 84" />
              </circle>
              <circle r="5" fill="#6EE7B7" filter="url(#greenGlow)" opacity="0.86">
                <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path="M340 286 L404 286 Q420 286 420 270 L420 250 L420 192 L420 138 L420 84" />
              </circle>

              <LayerBox
                x={330}
                y={24}
                width={180}
                height={48}
                title="AI Client"
                subtitle="Codex / Cursor / CC Switch"
                tone="blue"
              />
              <LayerBox
                x={310}
                y={104}
                width={220}
                height={48}
                title="Local Host"
                subtitle="localhost:18000 /v1"
                tone="blue"
              />
              <LayerBox
                x={300}
                y={184}
                width={240}
                height={48}
                title="Browser Extension"
                subtitle="Native Messaging + 网页桥接"
                tone="green"
              />

              {platforms.map((platform) => (
                <PlatformBox
                  key={platform.name}
                  x={platform.x - 60}
                  y={262}
                  width={120}
                  height={48}
                  title={platform.name}
                  active={platform.x === 340}
                  tone={platform.tone}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayerBox({
  x,
  y,
  width,
  height,
  title,
  subtitle,
  tone,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  tone: "blue" | "green";
}) {
  const stroke = tone === "green" ? "rgba(16,185,129,0.38)" : "rgba(59,130,246,0.38)";
  const fill = tone === "green" ? "rgba(16,185,129,0.10)" : "rgba(59,130,246,0.10)";

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="16" fill={fill} stroke={stroke} />
      <text x={x + width / 2} y={y + 20} textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="700">
        {title}
      </text>
      <text x={x + width / 2} y={y + 35} textAnchor="middle" fill="#94A3B8" fontSize="11">
        {subtitle}
      </text>
    </g>
  );
}

function PlatformBox({
  x,
  y,
  width,
  height,
  title,
  active,
  tone,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  active: boolean;
  tone: "blue" | "green";
}) {
  const stroke = active
    ? tone === "green"
      ? "rgba(16,185,129,0.55)"
      : "rgba(59,130,246,0.55)"
    : "rgba(255,255,255,0.12)";
  const fill = active
    ? tone === "green"
      ? "rgba(16,185,129,0.16)"
      : "rgba(59,130,246,0.16)"
    : "rgba(255,255,255,0.03)";

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="16" fill={fill} stroke={stroke} />
      <text x={x + width / 2} y={y + 21} textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="700">
        {title}
      </text>
      <text x={x + width / 2} y={y + 36} textAnchor="middle" fill={active ? "#A7F3D0" : "#64748B"} fontSize="10">
        {active ? "active route" : "standby"}
      </text>
    </g>
  );
}
