import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, Bug, Globe, LayoutDashboard, LineChart, PackageCheck } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { cn } from "@/lib/utils";

const items = [
  { to: "/admin", label: "总览", icon: LayoutDashboard },
  { to: "/admin/installations", label: "安装分析", icon: BarChart3 },
  { to: "/admin/usage", label: "使用分析", icon: LineChart },
  { to: "/admin/regions", label: "地区分布", icon: Globe },
  { to: "/admin/issues", label: "问题治理", icon: Bug },
  { to: "/admin/releases", label: "Release 管理", icon: PackageCheck },
];

export default function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[220px_1fr] lg:px-10">
        <aside className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="px-3 pb-3 text-xs uppercase tracking-[0.28em] text-cyan-200/60">admin modules</p>
          <div className="space-y-2">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white",
                    isActive && "bg-cyan-400/10 text-white"
                  )
                }
              >
                <Icon className="h-4 w-4 text-cyan-300" />
                {label}
              </NavLink>
            ))}
          </div>
        </aside>

        <main className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/60">operations cockpit</p>
            <h1 className="mt-3 font-display text-4xl uppercase tracking-[0.16em]">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
