import { ExternalLink } from "lucide-react";
import DocsLayout from "./DocsLayout";
import GlowPanel from "@/components/GlowPanel";
import { DocSection } from "./DocsComponents";
import { buildPublicSiteUrl } from "@/config/site";

export default function DocsIssueWorkflowPage() {
  return (
    <DocsLayout title="问题反馈" summary="插件端只做入口。问题提交、日志关联、后续跟踪统一在官网完成。">
      <DocSection id="issue-workflow" title="问题反馈" summary="建议始终带 deviceId 提交，便于和匿名遥测关联。">
        <GlowPanel className="p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm leading-7 text-slate-300">
                官网问题中心支持带 <code className="rounded bg-white/5 px-1.5 py-0.5 text-white">deviceId</code>{" "}
                提交问题，后续可和匿名遥测、平台状态、使用记录关联，便于优先排查高热度与高影响问题。
              </p>
            </div>
            <a
              href={buildPublicSiteUrl("/issues/new")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500/20"
            >
              打开问题中心
              <ExternalLink className="h-4 w-4 text-emerald-300" />
            </a>
          </div>
        </GlowPanel>
      </DocSection>
    </DocsLayout>
  );
}

