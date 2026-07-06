import { useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import IssueList from "@/components/IssueList";
import { usePortalStore } from "@/store/usePortalStore";

export default function AdminIssuesPage() {
  const { issues, loadIssues, supportIssue, error } = usePortalStore();

  useEffect(() => {
    void loadIssues();
  }, [loadIssues]);

  return (
    <AdminShell
      title="问题治理"
      subtitle="这里按支持热度和状态观察问题池。后续管理员备注、状态切换和优先级调整也都从这里扩展。"
    >
      {error ? (
        <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-10 text-amber-100">
          当前未能读取问题治理数据：{error}
        </div>
      ) : (
        <IssueList issues={issues} onSupport={(issueId) => void supportIssue(issueId)} />
      )}
    </AdminShell>
  );
}
