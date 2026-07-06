import { useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import TrendChart from "@/components/TrendChart";
import { usePortalStore } from "@/store/usePortalStore";

export default function AdminInstallationsPage() {
  const { overview, loadOverview, error } = usePortalStore();

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  return (
    <AdminShell
      title="安装分析"
      subtitle="重点看官网转化能力、版本渗透和安装增长速度，帮助你判断发布节奏和推广效果。"
    >
      {error ? (
        <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-10 text-amber-100">
          当前未能读取安装分析：{error}
        </div>
      ) : overview ? (
        <TrendChart title="官网安装趋势" points={overview.installationTrend} />
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">加载安装趋势中...</div>
      )}
    </AdminShell>
  );
}
