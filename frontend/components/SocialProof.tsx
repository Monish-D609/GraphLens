export default function SocialProof() {
  const testimonials = [
    {
      quote:
        '"This tool prevents single-point production incidents. We finally have a map of what calls what in real time."',
      initials: "RM",
      role: "Elara Chen",
      company: "Staff Platform Engineer, DataFlow",
      color: "text-primary",
    },
    {
      quote:
        '"Outstanding — our staff engineers behave as an informed collective rather than operating in silos."',
      initials: "NP",
      role: "Nikhil Patel",
      company: "VP Engineering, Meridian AI",
      color: "text-tertiary",
    },
    {
      quote:
        '"It\'s the first documentation tool that actually understands distributed system architecture as it evolves."',
      initials: "RN",
      role: "Robin Nakamura",
      company: "Staff Architect, DataStream Labs",
      color: "text-secondary",
    },
  ];

  return (
    <section className="w-full px-margin py-24 bg-surface border-t border-outline-variant/20">
      <div className="max-w-7xl mx-auto">
        {/* Metrics strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20 border-b border-outline-variant/20">
          {[
            { val: "99.4%", label: "Dependency Accuracy", sub: "Grounded via AST and runtime endpoint tracing", color: "text-primary" },
            { val: "10x Faster", label: "Architectural Audits", sub: "Accelerated RFC reviews and migration approvals", color: "text-tertiary" },
            { val: "0", label: "Blind Deployments", sub: "Pre-deploy blast-radius calculation for every PR", color: "text-secondary" },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className={`font-geist text-display-lg font-bold ${m.color} mb-2`}>{m.val}</div>
              <div className="font-geist text-title-md text-on-surface font-medium">{m.label}</div>
              <p className="font-inter text-body-sm text-on-surface-variant mt-1">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="pt-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-label-xs uppercase tracking-widest text-primary font-semibold">Social Proof</span>
            <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mt-2">
              Trusted by teams running mission-critical software
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {testimonials.map((t) => (
              <div
                key={t.initials}
                className="p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant/70 transition-colors"
              >
                <span className="material-symbols-outlined text-outline-variant text-[28px] mb-4 block">format_quote</span>
                <p className="font-geist text-title-md text-on-surface italic leading-relaxed mb-6">{t.quote}</p>
                <div className="pt-4 border-t border-outline-variant/20 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-geist text-title-md ${t.color} font-bold`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-geist text-title-md text-on-surface font-medium">{t.role}</div>
                    <div className="font-inter text-body-sm text-on-surface-variant">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
