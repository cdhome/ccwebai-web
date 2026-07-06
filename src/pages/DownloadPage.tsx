import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, MonitorDown } from "lucide-react";
import GlowPanel from "@/components/GlowPanel";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNativeHostRelease, type NativeHostRelease } from "@/lib/api";

type Platform = "macos" | "windows" | "linux" | "unknown";

function detectPlatform(): Platform {
  const ua = String(navigator.userAgent || "").toLowerCase();
  if (ua.includes("mac")) return "macos";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

export default function DownloadPage() {
  const [release, setRelease] = useState<NativeHostRelease | null>(null);
  const [error, setError] = useState<string>("");
  const platform = useMemo(() => (typeof window === "undefined" ? "unknown" : detectPlatform()), []);

  useEffect(() => {
    let alive = true;
    getNativeHostRelease()
      .then((data) => {
        if (!alive) return;
        setRelease(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(String((err as Error)?.message || err));
      });
    return () => {
      alive = false;
    };
  }, []);

  const downloads = release?.latest?.downloads || {};
  const windowsUrl = downloads["windows-x64"] || "";
  const linuxUrl = downloads["linux-x64"] || "";
  const macArmUrl = downloads["macos-arm64"] || "";
  const macX64Url = downloads["macos-x64"] || "";

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-10">
        <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Downloads
            </p>
            <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.12em] text-white lg:text-5xl">
              下载 CC-WebAI 完整包
            </h1>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              完整包包含 Chrome 插件 + 本地 Host 守护进程。本地客户端继续调用 OpenAI 风格接口（默认
              <span className="mx-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
                http://localhost:18000/v1
              </span>
              ）即可接入网页端算力。
            </p>

            <div className="mt-8 space-y-3 text-sm leading-7 text-slate-300">
              <div className="flex items-start gap-3">
                <span className="mt-1 font-display text-lg text-emerald-400">01</span>
                <span>下载与你的系统匹配的 Host 包。</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 font-display text-lg text-emerald-400">02</span>
                <span>解压后运行安装脚本，自动写入 Native Messaging 配置。</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 font-display text-lg text-emerald-400">03</span>
                <span>回到扩展侧边栏确认“本地网关已启动”，如提示升级可再次回到此页更新。</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <GlowPanel>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Latest
                  </p>
                  <p className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                    {release?.available && release.latest ? `v${release.latest.version}` : "暂未发布"}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                  <MonitorDown className="h-5 w-5 text-emerald-400" />
                </div>
              </div>

              {error ? (
                <p className="mt-4 text-sm leading-7 text-rose-200">当前无法读取发布信息：{error}</p>
              ) : null}
              {!error && release && !release.available ? (
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  当前还没有在后台发布可用的 Host 完整包，请稍后再试。
                </p>
              ) : null}
            </GlowPanel>

            <div className="grid gap-4 md:grid-cols-2">
              <a
                href={platform === "windows" && windowsUrl ? windowsUrl : windowsUrl || "#"}
                className="group rounded-[26px] border border-white/10 bg-white/[0.04] px-6 py-5 transition hover:border-emerald-400/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Windows
                    </p>
                    <p className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                      x64
                    </p>
                  </div>
                  <ArrowDownToLine className="h-5 w-5 text-emerald-400 transition group-hover:translate-y-0.5" />
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-400">
                  安装脚本：install-native-host.ps1
                </p>
              </a>

              <a
                href={platform === "linux" && linuxUrl ? linuxUrl : linuxUrl || "#"}
                className="group rounded-[26px] border border-white/10 bg-white/[0.04] px-6 py-5 transition hover:border-emerald-400/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Linux
                    </p>
                    <p className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                      x64
                    </p>
                  </div>
                  <ArrowDownToLine className="h-5 w-5 text-emerald-400 transition group-hover:translate-y-0.5" />
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-400">
                  安装脚本：install-native-host.sh
                </p>
              </a>

              <a
                href={platform === "macos" && macArmUrl ? macArmUrl : macArmUrl || "#"}
                className="group rounded-[26px] border border-white/10 bg-white/[0.04] px-6 py-5 transition hover:border-emerald-400/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      macOS
                    </p>
                    <p className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                      ARM64
                    </p>
                  </div>
                  <ArrowDownToLine className="h-5 w-5 text-emerald-400 transition group-hover:translate-y-0.5" />
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-400">
                  Apple Silicon（M 系列）
                </p>
              </a>

              <a
                href={platform === "macos" && macX64Url ? macX64Url : macX64Url || "#"}
                className="group rounded-[26px] border border-white/10 bg-white/[0.04] px-6 py-5 transition hover:border-emerald-400/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      macOS
                    </p>
                    <p className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                      x64
                    </p>
                  </div>
                  <ArrowDownToLine className="h-5 w-5 text-emerald-400 transition group-hover:translate-y-0.5" />
                </div>
                <p className="mt-3 text-xs leading-6 text-slate-400">Intel</p>
              </a>
            </div>
          </div>
        </section>
        <SiteFooter />
      </main>
    </div>
  );
}
