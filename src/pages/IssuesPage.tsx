import { useEffect } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import IssueList from "@/components/IssueList";
import { usePortalStore } from "@/store/usePortalStore";

export default function IssuesPage() {
  const { issues, loadIssues, supportIssue, loading, error } = usePortalStore();

  useEffect(() => {
    void loadIssues();
  }, [loadIssues]);

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">issue center</p>
            <h1 className="mt-3 font-display text-5xl uppercase tracking-[0.16em]">问题中心</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              用户可以在这里公开提交问题、附带日志、查看支持热度。支持数越高，后台处理优先级越高。
            </p>
          </div>
          <Link
            to="/issues/new"
            className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
          >
            提交新问题
          </Link>
        </div>

        {error ? (
          <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-10 text-amber-100">
            当前未能读取问题列表：{error}
          </div>
        ) : loading && issues.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">加载问题列表中...</div>
        ) : (
          <IssueList issues={issues} onSupport={(issueId) => void supportIssue(issueId)} />
        )}
      </main>
    </div>
  );
}
