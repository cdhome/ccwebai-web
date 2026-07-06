export type DocsNavChild = {
  id: string;
  label: string;
};

export type DocsNavItem = {
  id: string;
  label: string;
  to: string;
  children?: DocsNavChild[];
};

export type DocsNavGroup = {
  label: string;
  items: DocsNavItem[];
};

export const docsNav: DocsNavGroup[] = [
  {
    label: "快速入门",
    items: [
      { id: "quick-start", label: "快速入门", to: "/docs/quick-start" },
      { id: "client-config", label: "客户端配置", to: "/docs/quick-start#client-config" },
    ],
  },
  {
    label: "API 参考",
    items: [
      {
        id: "api-reference",
        label: "概览",
        to: "/docs/api",
        children: [
          { id: "api-health", label: "GET /health" },
          { id: "api-models", label: "GET /v1/models" },
          { id: "api-chat", label: "POST /v1/chat/completions" },
          { id: "api-responses", label: "POST /v1/responses" },
        ],
      },
    ],
  },
  {
    label: "路由与会话",
    items: [
      { id: "routing-models", label: "模型与路由", to: "/docs/routing#routing-models" },
      { id: "sessions", label: "session_id / thread_id", to: "/docs/routing#sessions" },
      { id: "simple-mode", label: "简单模式", to: "/docs/routing#simple-mode" },
    ],
  },
  {
    label: "平台支持",
    items: [{ id: "supported-platforms", label: "支持平台与限制", to: "/docs/platforms" }],
  },
  {
    label: "核心问题",
    items: [{ id: "core-problems", label: "核心问题如何解决", to: "/docs/problems" }],
  },
  {
    label: "问题反馈",
    items: [{ id: "issue-workflow", label: "问题反馈", to: "/docs/issues" }],
  },
] as const;

export const supportedPlatforms = [
  {
    provider: "DeepSeek",
    model: "ccwebai-deepseek",
    status: "稳定可用",
    notes: ["标准文本链路稳定，适合作为默认文本平台。"],
  },
  {
    provider: "字节豆包",
    model: "ccwebai-doubao",
    status: "稳定可用",
    notes: [
      "平台原生 skill 较强，可能抢占网页端的“工具执行/结构化输出”语义，需要通过 Prompt 与工具桥接策略显式约束。",
      "适合文本与轻量 Agent 场景；复杂 Tool Calling 场景需谨慎评估。",
    ],
  },
  {
    provider: "腾讯元宝",
    model: "ccwebai-yuanbao",
    status: "稳定可用",
    notes: [
      "文本链路稳定，适合日常持续使用。",
      "多媒体能力可继续扩展（例如对生成资源 URL 的提取）。",
    ],
  },
  {
    provider: "百度文心",
    model: "ccwebai-wenxin",
    status: "已接入待扩展",
    notes: ["文本能力已接通，可继续补齐更多模态和页面适配。"],
  },
  {
    provider: "Google Gemini",
    model: "ccwebai-gemini",
    status: "已接通，需额度",
    notes: [
      "输入预算更紧，长上下文往往需要分包发送，不适合超复杂 Agent 任务。",
      "回答主链路不是标准 SSE，而是 `wrb.fr` 帧协议，需要专用解析器。",
    ],
  },
  {
    provider: "Kimi",
    model: "ccwebai-kimi",
    status: "已接入待增强",
    notes: ["可用，但平台策略与页面结构波动时需要进一步适配与稳定性验证。"],
  },
] as const;

export const implementationNotes = [
  { title: "路由与调度总览", path: "ccwebai/docs/implementation-notes/[已实现] 路由与调度总览.md" },
  { title: "Session 与线程绑定管理", path: "ccwebai/docs/implementation-notes/[已实现] Session 与线程绑定管理.md" },
  {
    title: "OpenAI 标准化与网页 Prompt 适配",
    path: "ccwebai/docs/implementation-notes/[已实现] OpenAI 标准化与网页 Prompt 适配.md",
  },
  { title: "单输入框网页模型适配", path: "ccwebai/docs/implementation-notes/[已实现] 单输入框网页模型适配.md" },
  {
    title: "健康探测、自动拉起与恢复",
    path: "ccwebai/docs/implementation-notes/[已实现] 健康探测、自动拉起与恢复.md",
  },
  { title: "Tool Calling 桥接", path: "ccwebai/docs/implementation-notes/[已实现] Tool Calling 桥接.md" },
  { title: "日志、调试与可观测性", path: "ccwebai/docs/implementation-notes/[已实现] 日志、调试与可观测性.md" },
  { title: "Gemini 流解析与 wrb.fr 帧协议", path: "ccwebai/docs/implementation-notes/[已实现] Gemini 流解析与 wrb.fr 帧协议.md" },
  { title: "国际化 i18n 体系与文案规范", path: "ccwebai/docs/implementation-notes/[已实现] 国际化 i18n 体系与文案规范.md" },
] as const;

export const officialRepoUrl = "https://github.com/cdhome/ccwebai";

