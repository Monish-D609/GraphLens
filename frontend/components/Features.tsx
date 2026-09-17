export default function Features() {
  const features = [
    {
      icon: "account_tree",
      title: "Dependency Mapping",
      desc: "Automatically identify which services rely on specific APIs or databases without manual tagging.",
      micro: {
        icon: "polyline",
        iconColor: "text-tertiary",
        label: "Auto-Discovered: BillingGateway → AuthEngine",
        badge: "Zero-Config",
        badgeClass: "bg-primary/15 text-primary border border-primary/30",
      },
    },
    {
      icon: "link",
      title: "Source-Linked Answers",
      desc: "Every response includes direct links to the specific lines of documentation used to generate the answer.",
      micro: {
        icon: "description",
        iconColor: "text-on-surface-variant",
        label: "Citation: internal/auth/auth_handler.go:142",
        badge: "Jump to Code",
        badgeClass: "text-primary",
        isLink: true,
      },
    },
    {
      icon: "crisis_alert",
      title: "Change Impact Analysis",
      desc: "Type in a planned change to see a list of downstream systems that might be affected before you deploy.",
      micro: {
        icon: "warning",
        iconColor: "text-error",
        label: "Deprecate /api/v1/sessions",
        badge: "High Risk / 4 Downstream Services",
        badgeClass: "bg-error-container text-on-error-container font-semibold",
      },
    },
    {
      icon: "autorenew",
      title: "Automated Indexing",
      desc: "The knowledge graph updates whenever you merge a PR or edit a wiki page, keeping your insights current.",
      micro: {
        icon: "fiber_manual_record",
        iconColor: "text-primary animate-ping",
        label: "PR #1042 merged · main",
        badge: "Graph re-indexed in 4.2s",
        badgeClass: "text-primary font-medium",
        badgeRight: true,
      },
    },
  ];

  return (
    <section className="w-full px-margin py-24 bg-surface-container-lowest border-t border-outline-variant/20" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-label-xs uppercase tracking-widest text-primary font-semibold">Core Capabilities</span>
            <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mt-2">
              Engineered for high-concurrency architectures
            </h2>
          </div>
          <p className="font-inter text-body-md text-on-surface-variant max-w-md">
            Built for teams navigating distributed systems where manual documentation becomes legacy the second it is merged.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/40 hover:border-primary/40 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[24px]">{f.icon}</span>
              </div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold mb-3">{f.title}</h3>
              <p className="font-inter text-body-md text-on-surface-variant mb-6 leading-relaxed">{f.desc}</p>

              <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`material-symbols-outlined text-[16px] ${f.micro.iconColor}`}>{f.micro.icon}</span>
                  <span className="font-mono text-code-sm text-on-surface truncate">{f.micro.label}</span>
                </div>
                <span className={`font-mono text-label-xs px-2 py-0.5 rounded whitespace-nowrap ml-2 ${f.micro.badgeClass}`}>
                  {f.micro.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
