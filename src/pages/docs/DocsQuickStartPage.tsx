import DocsLayout from "./DocsLayout";
import GlowPanel from "@/components/GlowPanel";
import { DocSection, InfoList } from "./DocsComponents";
import { useHashScroll } from "./useHashScroll";

export default function DocsQuickStartPage() {
  useHashScroll("quick-start");

  return (
    <DocsLayout
      title="快速入门"
      summary="最短路径：安装扩展与 Host，然后把客户端目标地址改为本地网关。"
    >
      <DocSection id="quick-start" title="快速入门" summary="三步接通：扩展、Host、baseURL。">
        <div className="grid gap-4 md:grid-cols-3">
          <GlowPanel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Step 01</div>
            <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-white">安装扩展</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">安装 Chrome 扩展，并确认目标平台网页已登录。</p>
          </GlowPanel>
          <GlowPanel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Step 02</div>
            <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-white">启动 Host</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">安装并启动本地 Native Host，确认侧边栏状态为“已启动”。</p>
          </GlowPanel>
          <GlowPanel className="p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Step 03</div>
            <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-white">改目标地址</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              把客户端目标地址指向{" "}
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-white">http://localhost:18000/v1</code>。
            </p>
          </GlowPanel>
        </div>
      </DocSection>

      <DocSection id="client-config" title="客户端配置" summary="网关对外是 OpenAI 风格 API，你只需要改 baseURL。">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoList
            title="通用配置"
            items={[
              "Base URL：`http://localhost:18000/v1`",
              "Header：`Authorization: Bearer mock`",
              "推荐开启 `stream: true` 以获得打字机式输出",
            ]}
          />
          <InfoList
            title="模型选择"
            items={[
              "`model=ccwebai`：按侧边栏调度模式与排序选择平台",
              "`model=ccwebai-<provider>`：直达指定平台，例如 `ccwebai-gemini`",
            ]}
          />
        </div>
      </DocSection>
    </DocsLayout>
  );
}

