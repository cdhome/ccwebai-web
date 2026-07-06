import { Check } from "lucide-react";
import GlowPanel from "@/components/GlowPanel";

export function DocSection({
  id,
  title,
  summary,
  children,
}: {
  id: string;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4">
        <h2 className="font-display text-3xl uppercase tracking-[0.1em] text-white">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-300">{summary}</p>
      </div>
      {children}
    </section>
  );
}

export function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <GlowPanel className="p-5">
      <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">{title}</h3>
      <div className="mt-4 space-y-2.5">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-300">
            <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </GlowPanel>
  );
}

export function CodeBlock({
  title,
  lang,
  content,
}: {
  title: string;
  lang: string;
  content: string;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#09101c]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{title}</div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-600">{lang}</div>
      </div>
      <pre className="overflow-x-auto px-5 py-5 text-sm leading-7 text-slate-200">{content}</pre>
    </div>
  );
}

export function Endpoint({
  id,
  method,
  path,
  description,
  requestExamples,
  responseExamples,
  notes,
}: {
  id: string;
  method: string;
  path: string;
  description: string;
  requestExamples: Array<{ title: string; lang: string; content: string }>;
  responseExamples: Array<{ title: string; lang: string; content: string }>;
  notes: string[];
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <GlowPanel className="p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Endpoint</div>
            <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
              <span className="mr-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-100">
                {method}
              </span>
              <code className="rounded bg-white/5 px-2 py-1 text-white">{path}</code>
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{description}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            {requestExamples.map((example) => (
              <CodeBlock key={example.title} title={example.title} lang={example.lang} content={example.content} />
            ))}
          </div>
          <div className="space-y-3">
            {responseExamples.map((example) => (
              <CodeBlock key={example.title} title={example.title} lang={example.lang} content={example.content} />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Notes</div>
          <div className="mt-3 space-y-2.5">
            {notes.map((note) => (
              <div key={note} className="flex items-start gap-3 text-sm leading-7 text-slate-300">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </GlowPanel>
    </section>
  );
}

