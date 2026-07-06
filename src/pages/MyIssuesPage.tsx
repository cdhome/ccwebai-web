import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import IssueList from "@/components/IssueList";
import { usePortalStore } from "@/store/usePortalStore";

export default function MyIssuesPage() {
  const { issues, loadIssues } = usePortalStore();

  useEffect(() => {
    void loadIssues();
  }, [loadIssues]);

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">my issues</p>
        <h1 className="mt-3 font-display text-5xl uppercase tracking-[0.16em]">我的问题</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          这里会承接登录用户的个人问题记录、支持记录和状态流转。当前先用统一问题池展示结构。
        </p>

        <div className="mt-10">
          <IssueList issues={issues.slice(0, 3)} />
        </div>
      </main>
    </div>
  );
}
