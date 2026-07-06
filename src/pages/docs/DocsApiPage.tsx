import DocsLayout from "./DocsLayout";
import { DocSection, Endpoint } from "./DocsComponents";
import { useHashScroll } from "./useHashScroll";

export default function DocsApiPage() {
  useHashScroll("api-reference");

  return (
    <DocsLayout title="API 参考" summary="每个端点都给出可复制的请求与响应示例。">
      <DocSection id="api-reference" title="API 概览" summary="对外保持 OpenAI 风格接口，兼容现有客户端的接入方式。">
        <div className="space-y-5">
          <Endpoint
            id="api-health"
            method="GET"
            path="/health"
            description="检查本地网关是否启动，以及浏览器扩展是否已连接 Native Host。"
            requestExamples={[
              { title: "curl", lang: "bash", content: `curl http://127.0.0.1:18000/health` },
            ]}
            responseExamples={[
              {
                title: "示例响应",
                lang: "json",
                content: `{
  "ok": true,
  "native": true,
  "version": "0.1.0",
  "mode": "native"
}`,
              },
            ]}
            notes={["无请求体，无需 API Key。", "适合在启动后第一时间自检。"]}
          />

          <Endpoint
            id="api-models"
            method="GET"
            path="/v1/models"
            description="返回网关对外暴露的模型列表，尽量对齐 OpenAI `models.list` 语义。"
            requestExamples={[
              { title: "curl", lang: "bash", content: `curl http://127.0.0.1:18000/v1/models` },
            ]}
            responseExamples={[
              {
                title: "示例响应（截断）",
                lang: "json",
                content: `{
  "object": "list",
  "data": [
    {
      "id": "ccwebai",
      "object": "model",
      "owned_by": "ccwebai",
      "metadata": { "routing_mode": "scheduled", "provider_id": null }
    },
    {
      "id": "ccwebai-gemini",
      "object": "model",
      "owned_by": "ccwebai",
      "metadata": { "routing_mode": "direct_provider", "provider_id": "gemini" }
    }
  ]
}`,
              },
            ]}
            notes={[
              "`ccwebai` 是调度入口模型；`ccwebai-<provider>` 是直达模型。",
              "未知模型会返回标准风格 `invalid_request_error`。",
            ]}
          />

          <Endpoint
            id="api-chat"
            method="POST"
            path="/v1/chat/completions"
            description="OpenAI 兼容聊天接口，支持 JSON 与 SSE 流式输出，同时支持顶层 `session_id`。"
            requestExamples={[
              {
                title: "curl（流式）",
                lang: "bash",
                content: `curl -N http://127.0.0.1:18000/v1/chat/completions \\
  -H 'content-type: application/json' \\
  -H 'authorization: Bearer mock' \\
  --data-binary @- <<'JSON'
{
  "model": "ccwebai",
  "session_id": "demo-chat-session",
  "stream": true,
  "messages": [
    { "role": "user", "content": "请用一句话解释 CC-WebAI。" }
  ]
}
JSON`,
              },
              {
                title: "curl（非流式）",
                lang: "bash",
                content: `curl http://127.0.0.1:18000/v1/chat/completions \\
  -H 'content-type: application/json' \\
  -H 'authorization: Bearer mock' \\
  --data-binary @- <<'JSON'
{
  "model": "ccwebai-yuanbao",
  "session_id": "demo-chat-session",
  "stream": false,
  "messages": [
    { "role": "user", "content": "这条请求固定走元宝。" }
  ]
}
JSON`,
              },
            ]}
            responseExamples={[
              {
                title: "示例响应（非流式）",
                lang: "json",
                content: `{
  "id": "chatcmpl_xxx",
  "object": "chat.completion",
  "session_id": "demo-chat-session",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "..." },
      "finish_reason": "stop"
    }
  ]
}`,
              },
            ]}
            notes={[
              "默认 `Authorization: Bearer mock` 即可。",
              "`session_id` 用于稳定复用网页会话；同一个 `session_id` 后续建议保持一致。",
            ]}
          />

          <Endpoint
            id="api-responses"
            method="POST"
            path="/v1/responses"
            description="兼容 Responses 风格调用。适合使用 `input` 结构的客户端。"
            requestExamples={[
              {
                title: "curl",
                lang: "bash",
                content: `curl -N http://127.0.0.1:18000/v1/responses \\
  -H 'content-type: application/json' \\
  -H 'authorization: Bearer mock' \\
  --data-binary @- <<'JSON'
{
  "model": "ccwebai",
  "session_id": "demo-responses-session",
  "stream": true,
  "input": [
    {
      "type": "message",
      "role": "user",
      "content": [{ "type": "input_text", "text": "继续上次的话题。" }]
    }
  ]
}
JSON`,
              },
            ]}
            responseExamples={[
              {
                title: "说明",
                lang: "text",
                content:
                  "响应会被归一化为 OpenAI 风格输出（JSON 或 SSE）。具体字段会随客户端兼容策略调整，建议优先使用 /v1/chat/completions。",
              },
            ]}
            notes={[
              "如果你的客户端原生走 Responses API，这个端点用于减少适配成本。",
              "复杂工具调用场景建议先确认 tool-calling 兼容程度。",
            ]}
          />
        </div>
      </DocSection>
    </DocsLayout>
  );
}

