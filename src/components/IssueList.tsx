import { Link } from "react-router-dom";
import { ChevronRight, CircleDot, ThumbsUp } from "lucide-react";
import type { IssueItem } from "../../shared/portal";
import GlowPanel from "@/components/GlowPanel";

const statusMap: Record<IssueItem["status"], string> = {
  open: "待确认",
  triaging: "处理中",
  planned: "已规划",
  resolved: "已解决",
};

export default function IssueList({
  issues,
  onSupport,
}: {
  issues: IssueItem[];
  onSupport?: (issueId: string) => void;
}) {
  if (!issues.length) {
    return (
      <GlowPanel>
        <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-white">当前还没有问题记录</h3>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          数据库已经接通，但问题表还是空的。后续当插件或官网开始提交问题后，这里会展示真实列表和支持热度。
        </p>
      </GlowPanel>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <GlowPanel key={issue.id}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                <span className="rounded-full border border-white/10 px-3 py-1">{issue.providerId}</span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-200">
                  {statusMap[issue.status]}
                </span>
                <span>{issue.extensionVersion}</span>
              </div>
              <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-white">{issue.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{issue.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSupport?.(issue.id)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-slate-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
              >
                <ThumbsUp className="h-4 w-4 text-cyan-300" />
                支持 {issue.votes}
              </button>
              <Link
                to={`/issues/${issue.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
              >
                进入详情
                <ChevronRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                <CircleDot className="h-4 w-4 text-cyan-300" />
                {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </GlowPanel>
      ))}
    </div>
  );
}
