import { Check } from "lucide-react";
import DocsLayout from "./DocsLayout";
import GlowPanel from "@/components/GlowPanel";
import { DocSection } from "./DocsComponents";
import { implementationNotes, officialRepoUrl } from "./docs-data";

export default function DocsProblemsPage() {
  return (
    <DocsLayout
      title="核心问题如何解决"
      summary="按实现专题组织：不是堆概念，而是对应真实代码的解决方案。"
    >
      <DocSection id="core-problems" title="核心问题如何解决" summary="从调度、会话、标准化、稳定性与平台特异协议五个维度。">
        <div className="space-y-10 text-sm leading-7 text-slate-300">
          <div>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">1) 路由与调度</h3>
            <p className="mt-3">调度贯穿请求生命周期：选路、探针、流收口、恢复与回补绑定。</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>调度模型与直达模型共存，调用端保持简单。</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>sticky 请求优先命中同一网页会话，避免多平台切换导致上下文丢失。</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>流探针只用于链路识别，真正输出以“可提取 delta”为准。</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-white/8" />

          <div>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">2) Session 与线程绑定</h3>
            <p className="mt-3">用 threadKey 把 HTTP 请求映射到网页平台真实会话，并支持 tab 关闭后的恢复。</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>显式 session 在首次出现且无绑定时仍按 fresh 处理，避免串线。</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>绑定写入后稳定 sticky，确保续聊命中同一网页会话。</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-white/8" />

          <div>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">3) OpenAI 标准化与单输入框适配</h3>
            <p className="mt-3">入站标准化 + prompt 重组 + 必要时分包，解决“网页输入框有限制”的现实。</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>支持 Chat/Responses 形态，尽量对齐 OpenAI 语义。</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>DOM 自动化专注“找到输入框 + 提交”，多语言 selector 必须覆盖。</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-white/8" />

          <div>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">4) 健康探测与恢复</h3>
            <p className="mt-3">稳定性靠“健康探测 + 恢复策略”闭环，而不是盲目重试。</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>只接收 top frame（frameId=0）上报，避免 iframe 干扰导致状态闪烁。</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>流中断进入可恢复窗口，弱收尾尽量保证输出完整。</span>
              </li>
            </ul>
          </div>

          <div className="h-px bg-white/8" />

          <div>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">5) 平台特异协议（Gemini）</h3>
            <p className="mt-3">
              Gemini 主链路是 StreamGenerate，回包是 wrb.fr 长度前缀帧协议，不是标准 SSE，需要专用解析器提取增量文本。
            </p>
          </div>

          <GlowPanel className="p-6">
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">实现专题（更深的细节）</h3>
            <p className="mt-3">
              以下实现专题文档位于仓库内（后续开源后会持续维护）。如果你要扩展新平台或排查复杂稳定性问题，建议按顺序阅读。
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {implementationNotes.map((doc) => (
                <a
                  key={doc.path}
                  href={`${officialRepoUrl}/blob/main/${encodeURI(doc.path)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.06]"
                >
                  {doc.title}
                </a>
              ))}
            </div>
          </GlowPanel>
        </div>
      </DocSection>
    </DocsLayout>
  );
}

