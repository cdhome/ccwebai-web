import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import GlowPanel from "@/components/GlowPanel";
import { getOrCreateDeviceId } from "@/lib/device";
import { usePortalStore } from "@/store/usePortalStore";

const providers = ["gemini", "yuanbao", "wenxin", "doubao", "kimi", "system"];

export default function IssueSubmitPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDeviceId = useMemo(
    () => searchParams.get("deviceId") || getOrCreateDeviceId(),
    [searchParams]
  );
  const submitIssue = usePortalStore((state) => state.submitIssue);
  const loading = usePortalStore((state) => state.loading);

  const [form, setForm] = useState({
    title: "",
    description: "",
    providerId: "gemini",
    extensionVersion: "0.8.4",
    deviceId: defaultDeviceId,
    reproductionSteps: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const issueId = await submitIssue(form);
    navigate(`/issues/${issueId}`);
  }

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <GlowPanel>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">submit issue</p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-[0.16em]">提交问题</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            插件端点击“提交问题”后会跳到这里。`deviceId` 已自动生成并预填，后续能把问题和匿名遥测数据关联起来。
          </p>

          <form className="mt-10 grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="text-sm text-slate-300">问题标题</span>
              <input
                value={form.title}
                onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))}
                className="rounded-2xl border border-white/10 bg-[#09101c] px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                placeholder="例如：Gemini 多轮对话偶发新起会话"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm text-slate-300">平台</span>
                <select
                  value={form.providerId}
                  onChange={(event) => setForm((state) => ({ ...state, providerId: event.target.value }))}
                  className="rounded-2xl border border-white/10 bg-[#09101c] px-4 py-3 text-white outline-none"
                >
                  {providers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">插件版本</span>
                <input
                  value={form.extensionVersion}
                  onChange={(event) =>
                    setForm((state) => ({ ...state, extensionVersion: event.target.value }))
                  }
                  className="rounded-2xl border border-white/10 bg-[#09101c] px-4 py-3 text-white outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-300">设备 ID</span>
                <input
                  value={form.deviceId}
                  onChange={(event) => setForm((state) => ({ ...state, deviceId: event.target.value }))}
                  className="rounded-2xl border border-white/10 bg-[#09101c] px-4 py-3 text-white outline-none"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-slate-300">问题描述</span>
              <textarea
                rows={6}
                value={form.description}
                onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))}
                className="rounded-[24px] border border-white/10 bg-[#09101c] px-4 py-4 text-white outline-none"
                placeholder="请描述现象、期望行为、影响范围。"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-slate-300">复现步骤 / 相关日志摘要</span>
              <textarea
                rows={6}
                value={form.reproductionSteps}
                onChange={(event) =>
                  setForm((state) => ({ ...state, reproductionSteps: event.target.value }))
                }
                className="rounded-[24px] border border-white/10 bg-[#09101c] px-4 py-4 text-white outline-none"
                placeholder="这里可以直接粘贴日志摘要，也可以描述详细复现步骤。"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-fit items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-300/10 disabled:opacity-50"
            >
              {loading ? "提交中..." : "提交问题"}
            </button>
          </form>
        </GlowPanel>
      </main>
    </div>
  );
}
