import { useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import DataBars from "@/components/DataBars";
import TrendChart from "@/components/TrendChart";
import { usePortalStore } from "@/store/usePortalStore";

export default function AdminUsagePage() {
  const { overview, loadOverview, error } = usePortalStore();

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  return (
    <AdminShell
      title="使用分析"
      subtitle="从请求趋势、平台占比和峰值活跃观察真实用户行为，判断哪些平台值得优先优化。"
    >
      {error ? (
        <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-10 text-amber-100">
          当前未能读取使用分析：{error}
        </div>
      ) : overview ? (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <TrendChart title="请求量趋势" points={overview.usageTrend} />
          <DataBars title="平台调用占比" items={overview.providers} />
        </div>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">加载使用数据中...</div>
      )}
    </AdminShell>
  );
}
