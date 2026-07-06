import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center lg:px-10">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">404</p>
        <h1 className="mt-4 font-display text-6xl uppercase tracking-[0.18em]">页面未找到</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
          当前路径还没有接入。你可以先回到官网首页，或者进入后台与问题中心。
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
        >
          返回首页
        </Link>
      </main>
    </div>
  );
}
