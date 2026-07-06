import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import GlowPanel from "@/components/GlowPanel";
import { usePortalStore } from "@/store/usePortalStore";

export default function IssueDetailPage() {
  const { id = "" } = useParams();
  const { issueDetail, loadIssueDetail, loading, error } = usePortalStore();

  useEffect(() => {
    if (id) {
      void loadIssueDetail(id);
    }
  }, [id, loadIssueDetail]);

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
        {error ? (
          <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-10 text-amber-100">
            当前未能读取问题详情：{error}
          </div>
        ) : loading && !issueDetail ? (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">加载问题详情中...</div>
        ) : issueDetail ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <GlowPanel>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">{issueDetail.providerId}</p>
              <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.14em]">{issueDetail.title}</h1>
              <p className="mt-5 text-sm leading-8 text-slate-300">{issueDetail.description}</p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">复现步骤</p>
                  <pre className="mt-3 whitespace-pre-wrap rounded-[24px] border border-white/8 bg-[#07101e] p-5 text-sm leading-7 text-slate-200">
                    {issueDetail.reproductionSteps || "暂无"}
                  </pre>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">管理员备注</p>
                  <pre className="mt-3 whitespace-pre-wrap rounded-[24px] border border-white/8 bg-[#07101e] p-5 text-sm leading-7 text-slate-200">
                    {issueDetail.adminNote || "暂无"}
                  </pre>
                </div>
              </div>
            </GlowPanel>

            <div className="space-y-6">
              <GlowPanel>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">基础信息</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>支持数：{issueDetail.votes}</p>
                  <p>版本：{issueDetail.extensionVersion}</p>
                  <p>状态：{issueDetail.status}</p>
                  <p>地区：{issueDetail.relatedRegion}</p>
                </div>
              </GlowPanel>

              <GlowPanel>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">相关日志</p>
                <div className="mt-4 space-y-3">
                  {issueDetail.logFiles.length ? (
                    issueDetail.logFiles.map((file) => (
                      <div key={file.id} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200">
                        {file.fileName} · {file.size}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-400">暂无日志附件</div>
                  )}
                </div>
              </GlowPanel>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-slate-300">未找到对应问题。</div>
        )}
      </main>
    </div>
  );
}
