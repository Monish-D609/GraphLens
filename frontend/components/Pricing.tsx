export default function Pricing() {
  return (
    <section className="w-full px-margin py-24 bg-surface-container-lowest border-t border-outline-variant/20" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-label-xs uppercase tracking-widest text-primary font-semibold">Pricing</span>
          <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mt-2">
            Predictable pricing for engineering velocity
          </h2>
          <p className="font-inter text-body-lg text-on-surface-variant mt-3">
            Don't hire new team members to manage your ever-growing service mesh scales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Team plan */}
          <div className="p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-mono text-label-xs text-on-surface-variant uppercase tracking-wider mb-1">Team Plan</div>
                  <div className="font-geist text-display-lg text-on-surface font-semibold">
                    $30
                    <span className="font-inter text-body-md text-on-surface-variant font-normal ml-1">/ month</span>
                  </div>
                </div>
                <span className="font-mono text-label-xs bg-surface-container-high text-on-surface-variant px-2 py-1 rounded border border-outline-variant/40">
                  PER SEAT / BILLED ANNUALLY
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "GitHub and Confluence connectors",
                  "Scoped all-language query support",
                  "Up to 400 microservices indexed",
                  "Visitor annotation (Read, write, admin)",
                  "Priority support and onboarding",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-inter text-body-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="#"
              className="w-full inline-flex items-center justify-center py-3 rounded-lg border border-primary/50 text-primary font-geist text-title-md font-medium hover:bg-primary/10 transition-colors"
            >
              Start Free Trial
            </a>
          </div>

          {/* Enterprise plan */}
          <div className="p-space-xl rounded-xl bg-surface-container-high border border-primary/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-mono text-label-xs text-primary uppercase tracking-wider mb-1">Enterprise</div>
                  <div className="font-geist text-display-lg text-on-surface font-semibold">
                    Custom pricing
                  </div>
                </div>
                <span className="font-mono text-label-xs bg-primary text-on-primary px-2 py-1 rounded font-semibold">
                  MOST POPULAR
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "SOC2 Type II Compliance, 0-wait events",
                  "Dedicated VPC, Isolated deployment",
                  "Visitor annotations (Admin, read, write, custom roles)",
                  "Unlimited microservices, repos, and wikis",
                  "SLA-backed priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 font-inter text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="#"
              className="relative z-10 w-full inline-flex items-center justify-center py-3 rounded-lg bg-primary-container text-on-primary-container font-geist text-title-md font-medium hover:bg-primary transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Contact sales &amp; security
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
