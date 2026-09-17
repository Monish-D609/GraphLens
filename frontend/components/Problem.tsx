export default function Problem() {
  return (
    <section className="w-full px-margin py-20 bg-surface-container-lowest border-y border-outline-variant/20" id="problem">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 font-mono text-label-xs uppercase tracking-wider text-primary mb-3">
            <span className="material-symbols-outlined text-[15px]">architecture</span>
            Engineering Motivation &amp; Architecture Challenge
          </div>
          <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mb-4">
            Why traditional RAG fails on distributed software architectures
          </h2>
          <p className="font-inter text-body-lg text-on-surface-variant leading-relaxed">
            Standard Retrieval-Augmented Generation treats documentation as isolated text chunks.
            When engineers inquire about service blast radius or transitive dependencies, vector distance alone cannot reconstruct topological relationships.
          </p>
        </div>

        {/* Technical Architectural Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vanilla Vector RAG */}
          <div className="p-space-xl rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-label-xs uppercase tracking-wider text-error font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">cancel</span>
                  Vanilla Vector RAG (Baseline)
                </span>
                <span className="font-mono text-label-xs bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">
                  Text Chunking Only
                </span>
              </div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold mb-3">
                Chunk-Level Semantic Blindness
              </h3>
              <p className="font-inter text-body-md text-on-surface-variant leading-relaxed mb-6">
                Documents are split into arbitrary 500-token chunks. When Service A invokes Service B via gRPC, and Service B queries Database C, the call chain spans separate repositories. Vector embeddings cannot traverse these directional foreign relationships.
              </p>

              <div className="space-y-2.5 font-mono text-code-sm border-t border-outline-variant/20 pt-4">
                <div className="flex items-start gap-2 text-on-surface-variant">
                  <span className="text-error font-bold">✕</span>
                  <span>No concept of caller vs callee or multi-hop dependency paths</span>
                </div>
                <div className="flex items-start gap-2 text-on-surface-variant">
                  <span className="text-error font-bold">✕</span>
                  <span>Hallucinates connections when similarities overlap superficially</span>
                </div>
                <div className="flex items-start gap-2 text-on-surface-variant">
                  <span className="text-error font-bold">✕</span>
                  <span>Lacks AST groundings to verifiable source lines</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph-Augmented RAG */}
          <div className="p-space-xl rounded-2xl bg-surface-container-high border border-primary/40 shadow-[0_0_30px_rgba(6,182,212,0.12)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-label-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  GraphLens Approach (Graph RAG)
                </span>
                <span className="font-mono text-label-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">
                  AST + Knowledge Graph
                </span>
              </div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold mb-3">
                Topological Traversal + Hybrid Retrieval
              </h3>
              <p className="font-inter text-body-md text-on-surface leading-relaxed mb-6">
                GraphLens constructs a directed multigraph from AST parsers and documentation entities. Inbound user questions first identify entity seeds via vector search, then perform bounded graph traversals to gather deterministic call paths.
              </p>

              <div className="space-y-2.5 font-mono text-code-sm border-t border-outline-variant/20 pt-4">
                <div className="flex items-start gap-2 text-tertiary-fixed-dim">
                  <span className="text-primary font-bold">✓</span>
                  <span>Deterministic N-hop graph traversal over directed service edges</span>
                </div>
                <div className="flex items-start gap-2 text-tertiary-fixed-dim">
                  <span className="text-primary font-bold">✓</span>
                  <span>Exact source code citations linked to specific line numbers</span>
                </div>
                <div className="flex items-start gap-2 text-tertiary-fixed-dim">
                  <span className="text-primary font-bold">✓</span>
                  <span>Dual evaluation pipeline: Compare Vanilla vs Graph RAG output</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
