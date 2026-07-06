import { useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import DataBars from "@/components/DataBars";
import { usePortalStore } from "@/store/usePortalStore";

export default function AdminRegionsPage() {
  const { overview, loadOverview, error } = usePortalStore();

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  return (
    <AdminShell
      title="地区分布"
      subtitle="快速识别地区热点、语言偏好和增长重心，为官网国际化与渠道投放提供依据。"
    >
      {error ? (
        <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-10 text-amber-100">
          当前未能读取地区分布：{error}
        </div>
      ) : overview ? (
        <DataBars title="地区排行" items={overview.regions} />
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">加载地区分布中...</div>
      )}
    </AdminShell>
  );
}
