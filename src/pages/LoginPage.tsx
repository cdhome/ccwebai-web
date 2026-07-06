import { useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import GlowPanel from "@/components/GlowPanel";
import { usePortalStore } from "@/store/usePortalStore";

export default function LoginPage() {
  const location = useLocation();
  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const raw = String(params.get("next") || "/admin").trim();
    return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/admin";
  }, [location.search]);
  const errorText = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return String(params.get("error") || "").trim();
  }, [location.search]);
  const { loadGoogleLogin, googleConfigured, googleLoginUrl, loadSession, session, logout } =
    usePortalStore();

  useEffect(() => {
    void loadSession();
    void loadGoogleLogin(nextPath);
  }, [loadGoogleLogin, loadSession, nextPath]);

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <GlowPanel className="text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">google auth</p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.16em]">登录入口</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            插件端不登录，官网只在问题提交、投票和后台访问时需要身份。当前页面已经预留 Google OAuth 接入位。
          </p>

          {errorText ? (
            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
              登录失败：{errorText}
            </div>
          ) : null}

          <div className="mt-10">
            {session?.isAdmin ? (
              <div className="space-y-4">
                <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm text-emerald-100">
                  已使用超管账号登录：{session.email}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to={nextPath}
                    className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
                  >
                    进入后台
                  </Link>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : googleConfigured ? (
              <a
                href={googleLoginUrl}
                className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
              >
                使用 Google 登录超管账号
              </a>
            ) : session ? (
              <div className="space-y-4">
                <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-6 py-3 text-sm text-amber-100">
                  当前账号 {session.email} 没有后台权限，请切换到超管账号。
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    退出当前账号
                  </button>
                </div>
              </div>
            ) : (
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-slate-300">
                当前未配置 Google Client ID / Secret，页面接入位已保留。
              </div>
            )}
          </div>
        </GlowPanel>
        <SiteFooter />
      </main>
    </div>
  );
}
