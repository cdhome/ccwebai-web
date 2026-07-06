import DocsLayout from "./DocsLayout";
import { CodeBlock, DocSection, InfoList } from "./DocsComponents";
import { useHashScroll } from "./useHashScroll";

export default function DocsRoutingPage() {
  useHashScroll("routing-models");

  return (
    <DocsLayout title="路由与会话" summary="调度模型与直达模型共存，会话复用通过 session_id / thread_id 归一化实现。">
      <DocSection id="routing-models" title="模型与路由" summary="调用端保持简单：ccwebai（调度）与 ccwebai-<provider>（直达）。">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoList
            title="模型命名"
            items={[
              "`ccwebai`：调度入口模型",
              "`ccwebai-deepseek / ccwebai-doubao / ccwebai-yuanbao / ccwebai-gemini / ccwebai-wenxin / ccwebai-kimi`：直达模型",
              "`ccwebai-google-ai-search`：直达 Google AI Search",
            ]}
          />
          <InfoList
            title="调度模式（侧边栏）"
            items={[
              "`specified`：按排序选择第一个可用平台",
              "`primary_backup`：主备模式，失败回退到后续候选",
              "调度层优先保证“同一线程尽量命中同一网页会话”，而不是追求平均分流",
            ]}
          />
        </div>
      </DocSection>

      <DocSection id="sessions" title="session_id / thread_id" summary="把无状态 HTTP 请求稳定映射到网页平台的真实会话。">
        <div className="space-y-4">
          <InfoList
            title="核心原则"
            items={[
              "`session_id` 是网关扩展字段：用于复用网页会话，不破坏 OpenAI 客户端语义。",
              "显式会话在首次出现且尚无绑定时仍视为新线程（fresh），避免串线；写入绑定后才稳定 sticky。",
              "直达模型只影响 provider 选择，不改变 session 复用语义。",
            ]}
          />
          <InfoList
            title="Codex 会话管理（兼容）"
            items={[
              "Codex 通常把 `session_id / thread_id / turn_id` 放在 `client_metadata` 中（两者经常是同一个值）。",
              "网关会优先读取顶层字段，其次读取 `client_metadata.session_id / client_metadata.thread_id`，因此 Codex 可直接续聊。",
              "`prompt_cache_key` 会被保留用于兼容，但不会参与 threadKey 的主键生成。",
              "续聊稳定的关键是：后续轮次持续携带一致的 `session_id / thread_id`。",
            ]}
          />
          <InfoList
            title="建议实践"
            items={[
              "客户端：每次请求都传入相同 `session_id`（同一对话）。",
              "复杂 Agent：优先用直达模型锁定平台，减少调度变量。",
              "长上下文：必要时关闭简单模式，启用分包策略。",
            ]}
          />
          <CodeBlock
            title="Codex（Responses）最小示例"
            lang="json"
            content={`{
  "model": "ccwebai",
  "stream": true,
  "prompt_cache_key": "<codex-prompt-cache-key>",
  "client_metadata": {
    "session_id": "<codex-session-id>",
    "thread_id": "<codex-thread-id>",
    "turn_id": "<codex-turn-id>",
    "x-codex-installation-id": "<installation-id>"
  },
  "input": [
    {
      "type": "message",
      "role": "user",
      "content": [{ "type": "input_text", "text": "hello" }]
    }
  ]
}`}
          />
        </div>
      </DocSection>

      <DocSection id="simple-mode" title="简单模式" summary="纯文本续写与追问更稳，但会弱化工具调用与严格格式约束。">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoList
            title="适用"
            items={[
              "连续追问、续写、纯文本 Q&A",
              "希望最大化复用网页端原生会话上下文",
              "希望减少桥接层 prompt 重组成本",
            ]}
          />
          <InfoList
            title="不适用"
            items={[
              "Tool Calling 场景（工具协议与结果包装更依赖 Prompt 壳）",
              "必须严格格式化输出（JSON schema/固定格式）",
              "超长上下文强约束场景（可能需要分包和引导）",
            ]}
          />
        </div>
      </DocSection>
    </DocsLayout>
  );
}

