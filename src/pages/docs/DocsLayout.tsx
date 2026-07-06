import { ArrowUpRight, Github } from "lucide-react";
import { NavLink } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import GlowPanel from "@/components/GlowPanel";
import { buildPublicSiteUrl } from "@/config/site";
import { docsNav, officialRepoUrl } from "./docs-data";

export default function DocsLayout({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-400">Docs</p>
          <h1 className="mt-3 font-display text-4xl uppercase tracking-[0.12em] text-white lg:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{summary}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <GlowPanel className="p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Navigation</div>
              <nav className="mt-4 space-y-3">
                {docsNav.map((group) => (
                  <div key={group.label}>
                    <div className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {group.label}
                    </div>
                    <div className="mt-2 space-y-1">
                      {group.items.map((item) => (
                        <DocsNavItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Official</p>
                <a
                  href={buildPublicSiteUrl("/issues/new")}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white"
                >
                  提交问题
                  <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                </a>
                <a
                  href={officialRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white"
                >
                  查看 GitHub
                  <Github className="h-4 w-4 text-emerald-300" />
                </a>
              </div>
            </GlowPanel>
          </aside>

          <div className="space-y-10">{children}</div>
        </div>
      </main>
    </div>
  );
}

function DocsNavItem({
  item,
}: {
  item: {
    label: string;
    to: string;
    children?: Array<{ id: string; label: string }>;
  };
}) {
  const to = String(item.to || "/docs");
  const isHashLink = to.includes("#");
  const basePath = isHashLink ? to.split("#")[0] : to;

  return (
    <div>
      {isHashLink ? (
        <a
          href={to}
          className="block rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          {item.label}
        </a>
      ) : (
        <NavLink
          to={basePath}
          className={({ isActive }) =>
            [
              "block rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white",
              isActive ? "bg-white/10 text-white" : "",
            ].join(" ")
          }
          end
        >
          {item.label}
        </NavLink>
      )}

      {item.children?.length ? (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => (
            <a
              key={child.id}
              href={`${basePath}#${child.id}`}
              className="ml-3 block rounded-xl px-3 py-2 text-[13px] text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {child.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

