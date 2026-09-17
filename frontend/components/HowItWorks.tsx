export default function HowItWorks() {
  return (
    <section className="w-full px-margin py-24 bg-surface" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="font-mono text-label-xs uppercase tracking-widest text-primary font-semibold">How It Works</span>
          <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mt-2 mb-4">
            From scattered docs to an executable graph
          </h2>
          <p className="font-inter text-body-lg text-on-surface-variant">
            Turn passive documentation and code repositories into a queryable semantic knowledge network in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl relative">
          {/* Step 1 */}
          <div className="p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-code-md text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 font-semibold">01</span>
                <span className="material-symbols-outlined text-outline text-[24px]">cable</span>
              </div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold mb-2">Connect your tools.</h3>
              <p className="font-inter text-body-md text-on-surface-variant mb-6 leading-relaxed">
                Link your GitHub repositories, Confluence spaces, and internal wikis in minutes.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface-container border border-outline-variant/20">
              <div className="font-mono text-label-xs text-on-surface-variant mb-3 uppercase tracking-wider">Zero-Config Connectors</div>
              <div className="grid grid-cols-3 gap-2">
                {["GitHub", "Confluence", "Notion", "OpenAPI", "Slack", "GitLab"].map((t) => (
                  <div key={t} className="px-2.5 py-2 rounded bg-surface-container-high border border-outline-variant/40 text-center font-mono text-code-sm text-on-surface">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-code-md text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 font-semibold">02</span>
                <span className="material-symbols-outlined text-outline text-[24px]">hub</span>
              </div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold mb-2">Build the graph.</h3>
              <p className="font-inter text-body-md text-on-surface-variant mb-6 leading-relaxed">
                Our AI scans your documentation to map how services, APIs, and databases relate to one another.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-surface-container border border-outline-variant/20 font-mono text-code-sm space-y-2">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">data_object</span>
                  AST Syntax Extractor
                </span>
                <span className="text-tertiary">Parsed</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full w-full" />
              </div>
              <div className="flex items-center justify-between text-on-surface-variant pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary">share</span>
                  Vector Semantic Linking
                </span>
                <span className="text-secondary">4,812 Nodes</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-full w-4/5" />
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-space-xl rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-code-md text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20 font-semibold">03</span>
                <span className="material-symbols-outlined text-outline text-[24px]">chat_bubble_outline</span>
              </div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold mb-2">Query in English.</h3>
              <p className="font-inter text-body-md text-on-surface-variant mb-6 leading-relaxed">
                Ask questions like "What services depend on our Auth API?" and get an answer grounded in your specific architecture.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-mono text-code-sm text-on-surface font-medium">"What services depend on our Auth API?"</span>
              </div>
              <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/30 text-body-sm font-inter text-on-surface-variant">
                <p className="text-on-surface font-medium mb-1">Found 4 downstream services:</p>
                <ul className="space-y-0.5 font-mono text-code-sm text-tertiary">
                  <li>→ Billing Gateway (critical / REST)</li>
                  <li>→ User Profile Service (direct gRPC)</li>
                  <li>→ Legacy Mobile Gateway (warn)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
