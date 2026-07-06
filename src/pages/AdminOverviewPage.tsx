import { useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import DataBars from "@/components/DataBars";
import MetricGrid from "@/components/MetricGrid";
import TrendChart from "@/components/TrendChart";
import { usePortalStore } from "@/store/usePortalStore";

export default function AdminOverviewPage() {
  const { overview, loadOverview, error } = usePortalStore();

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  return (
    <AdminShell
      title="增长总览"
      subtitle="集中观察安装情况、使用情况、平台占比、地区分布和版本渗透。官网和插件的增长反馈都在这里收口。"
    >
      {error ? (
        <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-10 text-amber-100">
          当前未能读取后台总览：{error}
        </div>
      ) : overview ? (
        <>
          <MetricGrid items={overview.metrics} />
          <div className="grid gap-6 xl:grid-cols-2">
            <TrendChart title="安装趋势" points={overview.installationTrend} />
            <TrendChart title="请求趋势" points={overview.usageTrend} />
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <DataBars title="地区分布" items={overview.regions} />
            <DataBars title="平台占比" items={overview.providers} />
            <DataBars title="版本分布" items={overview.versions} />
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">加载后台数据中...</div>
      )}
    </AdminShell>
  );
}
