import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocsLayout from "@/pages/docs/DocsLayout";
import GlowPanel from "@/components/GlowPanel";
import { docsNav } from "@/pages/docs/docs-data";

const legacyHashRedirects: Record<string, { to: string; hash?: string }> = {
  "quick-start": { to: "/docs/quick-start" },
  "client-config": { to: "/docs/quick-start", hash: "client-config" },
  "api-reference": { to: "/docs/api" },
  "api-health": { to: "/docs/api", hash: "api-health" },
  "api-models": { to: "/docs/api", hash: "api-models" },
  "api-chat": { to: "/docs/api", hash: "api-chat" },
  "api-responses": { to: "/docs/api", hash: "api-responses" },
  "routing-models": { to: "/docs/routing", hash: "routing-models" },
  sessions: { to: "/docs/routing", hash: "sessions" },
  "simple-mode": { to: "/docs/routing", hash: "simple-mode" },
  "supported-platforms": { to: "/docs/platforms" },
  "core-problems": { to: "/docs/problems" },
  "issue-workflow": { to: "/docs/issues" },
};

export default function DocsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = String(location.hash || "");
    if (!hash.startsWith("#")) return;
    const key = hash.slice(1);
    if (!key) return;
    const target = legacyHashRedirects[key];
    if (!target) return;
    const next = target.hash ? `${target.to}#${target.hash}` : target.to;
    navigate(next, { replace: true });
  }, [location.hash, navigate]);

  return (
    <DocsLayout
      title="CC-WebAI 文档中心"
      summary="文档采用“一级多页面 + 二级锚点”的结构。左侧导航负责目录，右侧页面承接详细示例与实现说明。"
    >
      <GlowPanel className="p-6">
        <p className="text-sm leading-7 text-slate-300">
          你可以从左侧导航进入 Quick Start、API、路由与会话、平台限制，以及实现专题。
        </p>
      </GlowPanel>

      <div className="grid gap-4 md:grid-cols-2">
        {docsNav.map((group) => (
          <GlowPanel key={group.label} className="p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">{group.label}</div>
            <div className="mt-4 space-y-2">
              {group.items.map((item) => (
                <a
                  key={item.id}
                  href={item.to}
                  className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200 transition hover:bg-white/[0.06]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </GlowPanel>
        ))}
      </div>
    </DocsLayout>
  );
}

