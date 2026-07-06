import { Link, NavLink } from "react-router-dom";
import { ArrowDownToLine, ArrowUpRight, Github, Radar } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/download", label: "下载" },
  { href: "/docs", label: "文档中心" },
  { href: "/issues", label: "问题中心" },
  { href: "https://github.com/cdhome/ccwebai", label: "GitHub", external: true },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0F19]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <Radar className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-display text-lg uppercase tracking-[0.2em] text-white">CC-WebAI</p>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">open web ai bridge</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) =>
            item.href.startsWith("/") && !item.external && !item.href.includes("#") ? (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white",
                    isActive && "bg-white/10 text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  item.label === "GitHub"
                    ? "border border-white/20 bg-white text-[#0B0F19] hover:border-white/30 hover:bg-white/90"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.label === "GitHub" ? <Github className="h-4 w-4 text-[#0B0F19]" /> : null}
                {item.label}
              </a>
            )
          )}
        </nav>

        <Link
          to="/download"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400 hover:bg-emerald-500/20"
        >
          <ArrowDownToLine className="h-4 w-4" />
          一键下载
          <ArrowUpRight className="h-4 w-4 text-emerald-300" />
        </Link>
      </div>
    </header>
  );
}
