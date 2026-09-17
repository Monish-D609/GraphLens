export default function Features() {
  const features = [
    {
      icon: "account_tree",
      title: "AST Dependency Extraction",
      desc: "Parses service endpoints, client invocations, and database schemas directly from source code and protobuf definitions.",
      micro: {
        icon: "polyline",
        iconColor: "text-tertiary",
        label: "Discovered: BillingGateway → AuthEngine:v1",
        badge: "AST Node",
        badgeClass: "bg-primary/15 text-primary border border-primary/30",
      },
    },
    {
      icon: "link",
      title: "Source-Linked Line Citations",
      desc: "Every generated answer links back to the exact line of code and documentation source used to formulate the relationship.",
      micro: {
        icon: "description",
        iconColor: "text-on-surface-variant",
        label: "Citation: services/auth/handler.go:88",
        badge: "Verified AST",
        badgeClass: "text-primary font-mono",
      },
    },
    {
      icon: "crisis_alert",
      title: "Transitive Impact Analysis",
      desc: "Traverses graph edges to compute downstream blast-radius paths when an API endpoint or contract undergoes modification.",
      micro: {
        icon: "warning",
        iconColor: "text-error",
        label: "Path: /v1/tokens/introspect → Mobile GW",
        badge: "Downstream Deprecation",
        badgeClass: "bg-error-container text-on-error-container font-semibold",
      },
    },
    {
      icon: "compare_arrows",
      title: "Dual RAG Comparison Engine",
      desc: "Executes side-by-side retrieval benchmarks comparing standard vector cosine search against graph-augmented retrieval.",
      micro: {
        icon: "data_thresholding",
        iconColor: "text-secondary",
        label: "Mode: 'vanilla' vs 'graph' query",
        badge: "Evaluation Benchmark",
        badgeClass: "bg-secondary-container text-on-secondary-container font-medium",
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
              Engineered for distributed system architectures
            </h2>
          </div>
          <p className="font-inter text-body-md text-on-surface-variant max-w-md">
            Combines dense vector embeddings with deterministic in-memory NetworkX multigraph traversal for deep dependency tracing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-space-xl rounded-2xl bg-surface-container-low border border-outline-variant/40 hover:border-primary/40 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-primary mb-6">
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
