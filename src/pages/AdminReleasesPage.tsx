import { useEffect, useState, type FormEvent } from "react";
import AdminShell from "@/components/AdminShell";
import GlowPanel from "@/components/GlowPanel";
import { usePortalStore } from "@/store/usePortalStore";

export default function AdminReleasesPage() {
  const { releases, error, loading, loadAdminReleases, createAdminRelease, activateAdminRelease } =
    usePortalStore();
  const [version, setVersion] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    void loadAdminReleases();
  }, [loadAdminReleases]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createAdminRelease({
      version,
      baseUrl,
      notes,
      isActive,
    });
    setVersion("");
    setBaseUrl("");
    setNotes("");
    setIsActive(true);
  }

  return (
    <AdminShell
      title="Release 管理"
      subtitle="在后台维护 Native Host 发布版本、下载基地址与当前生效版本，/download 页面与扩展升级入口会直接读取这里。"
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlowPanel>
          <h2 className="font-display text-2xl uppercase tracking-[0.12em] text-white">新增 Release</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            下载文件名沿用固定规则：`macos-arm64.zip`、`macos-x64.zip`、`windows-x64.zip`、
            `linux-x64.zip`。
          </p>

          <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">版本号</span>
              <input
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                placeholder="例如 1.2.3"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">下载基地址</span>
              <input
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
                placeholder="例如 https://github.com/cdhome/ccwebai/releases/download/v1.2.3"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">备注</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="记录平台支持、修复点或安装说明"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              创建后立即设为当前生效版本
            </label>

            <button
              type="submit"
              className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              保存 Release
            </button>
          </form>
        </GlowPanel>

        <div className="space-y-4">
          {error ? (
            <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-6 text-amber-100">
              当前未能读取 Release 列表：{error}
            </div>
          ) : null}

          {!error && releases.length === 0 && loading ? (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-slate-300">
              正在读取 Release 列表...
            </div>
          ) : null}

          {releases.map((release) => (
            <GlowPanel key={release.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
                      v{release.version}
                    </h3>
                    <span
                      className={
                        release.isActive
                          ? "rounded-full border border-emerald-500/30 bg-emerald-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200"
                          : "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300"
                      }
                    >
                      {release.isActive ? "当前生效" : "待切换"}
                    </span>
                  </div>
                  <p className="mt-3 break-all text-sm leading-7 text-slate-300">{release.baseUrl}</p>
                  {release.notes ? (
                    <p className="mt-3 text-sm leading-7 text-slate-400">{release.notes}</p>
                  ) : null}
                  <div className="mt-4 grid gap-2 text-xs text-slate-400 md:grid-cols-2">
                    <div>macOS ARM64: {release.downloads["macos-arm64"]}</div>
                    <div>macOS x64: {release.downloads["macos-x64"]}</div>
                    <div>Windows x64: {release.downloads["windows-x64"]}</div>
                    <div>Linux x64: {release.downloads["linux-x64"]}</div>
                  </div>
                </div>

                {!release.isActive ? (
                  <button
                    type="button"
                    onClick={() => void activateAdminRelease(release.id)}
                    className="inline-flex shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500/20"
                  >
                    设为当前生效版本
                  </button>
                ) : null}
              </div>
            </GlowPanel>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
