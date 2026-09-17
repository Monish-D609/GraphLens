"use client";

export default function FinalCTA() {
  return (
    <section className="w-full px-margin py-20 bg-surface-container-lowest" id="resources">
      <div className="max-w-5xl mx-auto rounded-3xl bg-surface-container border border-outline-variant/40 p-space-xl lg:p-14 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mb-6 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">account_tree</span>
          </div>

          <span className="font-mono text-label-xs uppercase tracking-widest text-primary font-semibold mb-3">
            Open-Source Architecture Project
          </span>

          <h2 className="font-geist text-headline-lg lg:text-display-lg text-on-surface font-bold tracking-tight mb-4">
            Graph-Augmented Retrieval over Technical Documentation
          </h2>
          <p className="font-inter text-body-lg text-on-surface-variant mb-8 max-w-2xl leading-relaxed">
            An open-source architecture intelligence engine evaluating dual-stream retrieval: combining dense vector similarity with deterministic in-memory multigraph traversal.
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <a
              href="https://github.com/Monish-D609/GraphLens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-space-xl py-3 rounded-xl bg-primary text-on-primary font-geist text-title-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>View on GitHub</span>
            </a>

            <a
              href="#demo-console"
              className="inline-flex items-center gap-2 px-space-lg py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 font-geist text-title-md text-on-surface font-medium transition-all"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
              <span>Test Interactive Console</span>
            </a>
          </div>

          {/* Architecture Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-label-xs text-on-surface-variant">
            <span className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/30">
              FastAPI
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/30">
              NetworkX Graph
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/30">
              Cloudflare Workers AI
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/30">
              OpenRouter Fallback
            </span>
            <span className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/30">
              Next.js 16 App Router
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
