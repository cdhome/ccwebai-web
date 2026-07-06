import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-20 rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl uppercase tracking-[0.12em] text-white">CC-WebAI</p>
          <p className="mt-2 text-sm text-slate-400">开源、免费、本地优先的网页端 AI 网关。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/download"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500/20"
          >
            下载完整包
          </Link>
          <Link
            to="/issues"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            问题中心
          </Link>
          <a
            href="https://github.com/cdhome/ccwebai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-[#0B0F19] transition hover:bg-white/90"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
