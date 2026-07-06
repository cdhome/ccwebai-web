import DocsLayout from "./DocsLayout";
import { DocSection } from "./DocsComponents";
import { supportedPlatforms } from "./docs-data";

export default function DocsPlatformsPage() {
  return (
    <DocsLayout title="支持平台与限制" summary="列表展示：平台、model 名、以及真实限制与风险点。">
      <DocSection id="supported-platforms" title="支持平台与限制" summary="尽量按真实接通状态展示，不夸大。">
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-12 border-b border-white/10 bg-white/[0.02] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <div className="col-span-3">平台</div>
            <div className="col-span-3">Model</div>
            <div className="col-span-2">状态</div>
            <div className="col-span-4">说明 / 限制</div>
          </div>
          {supportedPlatforms.map((row) => (
            <div
              key={row.model}
              className="grid grid-cols-12 gap-3 border-b border-white/5 px-5 py-4 text-sm text-slate-200 last:border-b-0"
            >
              <div className="col-span-3 font-semibold text-white">{row.provider}</div>
              <div className="col-span-3">
                <code className="rounded bg-white/5 px-2 py-1 text-xs text-white">{row.model}</code>
              </div>
              <div className="col-span-2">
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  {row.status}
                </span>
              </div>
              <div className="col-span-4 space-y-1.5 text-sm leading-6 text-slate-300">
                {row.notes.map((note) => (
                  <div key={note} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DocSection>
    </DocsLayout>
  );
}

