export default function Problem() {
  return (
    <section className="w-full px-margin py-20 bg-surface-container-lowest border-y border-outline-variant/20">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-label-xs uppercase tracking-wider text-error mb-3">
            <span className="material-symbols-outlined text-[15px]">report_problem</span>
            The Cost of Architectural Blindness
          </div>
          <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mb-4">
            Microservices evolve faster than documentation.
          </h2>
          <p className="font-inter text-body-lg text-on-surface-variant">
            Engineering managers and staff engineers lose hours tracing service connections across stale wikis and Slack threads.
          </p>
        </div>

        {/* Stats contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <span className="font-mono text-label-xs uppercase tracking-wider text-error font-semibold flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-[14px]">history</span>
                Status Quo: Manual Tracing
              </span>
              <div className="font-geist text-display-lg text-on-surface font-semibold my-2">3.5 hrs</div>
              <p className="font-inter text-body-md text-on-surface-variant">
                Average time spent by a senior engineer to trace a single cross-service request path through out-of-date Confluence pages and scattered Slack threads.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 font-mono text-code-sm text-outline">
              <span className="material-symbols-outlined text-[16px]">close</span>
              Context switching, outdated confluence, broken staging tests
            </div>
          </div>

          <div className="p-space-xl rounded-xl bg-surface-container-high border border-primary/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <span className="font-mono text-label-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                With GraphLens
              </span>
              <div className="font-geist text-display-lg text-primary font-semibold my-2">&lt; 15 seconds</div>
              <p className="font-inter text-body-md text-on-surface">
                Ask a plain-English query and receive deterministic, source-linked dependency lineage mapped directly from your latest ASTs and repos.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 font-mono text-code-sm text-tertiary-fixed-dim">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Instant blast radius analysis, line-level code citations, zero manual tagging
            </div>
          </div>
        </div>

        {/* Quote cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {[
            {
              quote: '"We spend more time digging through Confluence than actually building features."',
              initials: "ED",
              role: "Engineering Director",
              company: "Tier-1 Fintech Platform",
              color: "text-primary",
            },
            {
              quote: '"I am terrified of changing a core API because I don\'t know who is actually consuming it."',
              initials: "PE",
              role: "Principal Platform Engineer",
              company: "Distributed SaaS Unicorn",
              color: "text-tertiary",
            },
            {
              quote: '"Onboarding new seniors takes months because our architectural knowledge is trapped in a few people\'s heads."',
              initials: "SI",
              role: "Staff Infrastructure Lead",
              company: "Cloud Infrastructure Provider",
              color: "text-secondary",
            },
          ].map((q) => (
            <div
              key={q.initials}
              className="p-space-lg rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col justify-between hover:border-outline-variant/70 transition-colors"
            >
              <div>
                <span className="material-symbols-outlined text-outline-variant text-[28px] mb-3">format_quote</span>
                <p className="font-geist text-title-md text-on-surface italic leading-relaxed mb-6">{q.quote}</p>
              </div>
              <div className="pt-4 border-t border-outline-variant/20 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-geist text-title-md ${q.color} font-bold`}>
                  {q.initials}
                </div>
                <div>
                  <div className="font-geist text-title-md text-on-surface font-medium">{q.role}</div>
                  <div className="font-inter text-body-sm text-on-surface-variant">{q.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
