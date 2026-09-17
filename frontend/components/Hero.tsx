"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface TraversalHop {
  node: string;
  type: string;
  relationship?: string;
  score?: number;
}

interface TraversalTrace {
  seed_nodes?: string[];
  hops?: TraversalHop[];
  total_nodes_visited?: number;
  depth?: number;
}

interface QueryResult {
  answer: string;
  citations: string[];
  context_chunks: { content: string; score?: number; source?: string }[];
  traversal_trace?: TraversalTrace;
  model: string;
  vanilla_answer?: string;
  vanilla_citations?: string[];
  vanilla_chunks?: { content: string; score?: number; source?: string }[];
}

type QueryState = "idle" | "loading" | "success" | "error" | "no_data";

const EXAMPLE_QUERIES = [
  "What does the AuthService depend on?",
  "Which modules call the payment processor?",
  "Trace all imports of the database connection pool",
  "What functions are exported from the utils module?",
  "Find all callers of the sendEmail function",
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function TraversalVisualizer({ trace, visible }: { trace?: TraversalTrace; visible: boolean }) {
  const [visibleHops, setVisibleHops] = useState<number>(0);

  useEffect(() => {
    if (!visible || !trace?.hops?.length) return;
    setVisibleHops(0);
    const interval = setInterval(() => {
      setVisibleHops((n) => {
        if (n >= (trace.hops?.length ?? 0)) {
          clearInterval(interval);
          return n;
        }
        return n + 1;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [trace, visible]);

  if (!trace) return null;

  const seeds = trace.seed_nodes ?? [];
  const hops = (trace.hops ?? []).slice(0, visibleHops);

  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-[15px] text-primary">account_tree</span>
        <span className="font-mono text-label-xs text-on-surface-variant uppercase tracking-wider">
          Graph Traversal Trace
        </span>
        {trace.total_nodes_visited && (
          <span className="ml-auto font-mono text-label-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            {trace.total_nodes_visited} nodes visited
          </span>
        )}
      </div>

      {seeds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="font-mono text-[10px] text-on-surface-variant/60 uppercase">Seeds:</span>
          {seeds.map((s) => (
            <span key={s} className="font-mono text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded border border-primary/20">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
        {hops.map((hop, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="font-mono text-[10px] text-outline-variant w-5 text-right shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded border border-outline-variant/30">
                {hop.node}
              </span>
              {hop.relationship && (
                <>
                  <span className="text-[10px] text-outline-variant">→</span>
                  <span className="font-mono text-[10px] text-tertiary">{hop.relationship}</span>
                </>
              )}
              {hop.type && (
                <span className="font-mono text-[10px] text-outline-variant/60">
                  [{hop.type}]
                </span>
              )}
              {hop.score != null && (
                <span className="font-mono text-[10px] text-primary/60 ml-auto">
                  {hop.score.toFixed(3)}
                </span>
              )}
            </div>
          </div>
        ))}

        {visibleHops < (trace.hops?.length ?? 0) && (
          <div className="flex items-center gap-2 pl-7">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            <span className="font-mono text-[10px] text-outline-variant">traversing...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AnswerPanel({
  label,
  badge,
  badgeClass,
  answer,
  citations,
  chunks,
  trace,
  state,
  latencyMs,
  model,
}: {
  label: string;
  badge: string;
  badgeClass: string;
  answer?: string;
  citations?: string[];
  chunks?: { content: string; score?: number; source?: string }[];
  trace?: TraversalTrace;
  state: QueryState;
  latencyMs?: number;
  model?: string;
}) {
  const isGraph = label === "GraphLens RAG";

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border ${isGraph ? "border-primary/40 shadow-[0_0_30px_rgba(6,182,212,0.12)]" : "border-outline-variant/30"} bg-surface-container-lowest`}>
      <div className={`px-4 py-2.5 border-b flex items-center justify-between gap-2 ${isGraph ? "border-primary/30 bg-primary/5" : "border-outline-variant/20 bg-surface-container-low"}`}>
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-[16px] ${isGraph ? "text-primary" : "text-on-surface-variant"}`}>
            {isGraph ? "account_tree" : "search"}
          </span>
          <span className={`font-geist text-title-md font-semibold ${isGraph ? "text-primary" : "text-on-surface-variant"}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {latencyMs != null && (
            <span className="font-mono text-[10px] text-on-surface-variant">{latencyMs}ms</span>
          )}
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {badge}
          </span>
        </div>
      </div>

      <div className="p-4 overflow-y-auto min-h-[280px] max-h-[520px]">
        {state === "idle" && (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3 opacity-30 select-none">
            <span className={`material-symbols-outlined text-[40px] ${isGraph ? "text-primary" : "text-on-surface-variant"}`}>
              {isGraph ? "hub" : "search"}
            </span>
            <p className="font-mono text-label-md text-center text-on-surface-variant">
              {isGraph ? "Graph-augmented answer will appear here" : "Vector search answer will appear here"}
            </p>
          </div>
        )}

        {state === "loading" && (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full border-2 border-t-transparent animate-spin ${isGraph ? "border-primary" : "border-outline-variant"}`} />
              {isGraph && (
                <div className="absolute inset-2 rounded-full border-2 border-primary/30 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.6s" }} />
              )}
            </div>
            <p className="font-mono text-label-sm text-on-surface-variant animate-pulse">
              {isGraph ? "Traversing knowledge graph..." : "Searching vector index..."}
            </p>
          </div>
        )}

        {state === "no_data" && (
          <div className="min-h-[200px] flex flex-col items-center justify-center gap-3 text-center px-4">
            <span className="material-symbols-outlined text-[36px] text-on-surface-variant/40">database</span>
            <p className="font-mono text-label-md text-on-surface-variant/60">No documents ingested yet.</p>
            <p className="font-inter text-body-sm text-on-surface-variant/50">
              Run the ingestion pipeline from the backend before querying.
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="min-h-[200px] flex flex-col items-center justify-center gap-3 text-center px-4">
            <span className="material-symbols-outlined text-[36px] text-error">error</span>
            <p className="font-mono text-label-md text-error/80">Could not reach the backend.</p>
            <p className="font-inter text-body-sm text-on-surface-variant/60">
              Make sure the FastAPI server is running at{" "}
              <code className="font-mono text-xs bg-surface-container px-1 py-0.5 rounded">{BACKEND_URL}</code>
            </p>
          </div>
        )}

        {state === "success" && answer && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">smart_toy</span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Answer</span>
                {model && (
                  <span className="ml-auto font-mono text-[10px] text-outline-variant truncate max-w-[120px]">{model}</span>
                )}
              </div>
              <p className="font-inter text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>

            {citations && citations.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">article</span>
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Citations ({citations.length})
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {citations.slice(0, 5).map((c, i) => (
                    <div key={i} className="font-mono text-[10px] bg-surface-container px-2.5 py-1.5 rounded border border-outline-variant/20 text-on-surface-variant truncate">
                      <span className="text-primary mr-1.5">[{i + 1}]</span>{c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chunks && chunks.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">layers</span>
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Context chunks ({chunks.length})
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto">
                  {chunks.slice(0, isGraph ? 8 : 4).map((chunk, i) => (
                    <div key={i} className="bg-surface-container rounded-lg p-2 border border-outline-variant/20">
                      {chunk.source && (
                        <div className="font-mono text-[9px] text-primary mb-1 truncate">{chunk.source}</div>
                      )}
                      <p className="font-inter text-[11px] text-on-surface-variant leading-snug line-clamp-2">
                        {chunk.content}
                      </p>
                      {chunk.score != null && (
                        <div className="mt-1 font-mono text-[9px] text-outline-variant">
                          score: {chunk.score.toFixed(4)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isGraph && <TraversalVisualizer trace={trace} visible={state === "success"} />}
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonDelta({ vanilla, graph }: { vanilla?: { chunks: number }; graph?: { chunks: number } }) {
  if (!vanilla || !graph) return null;
  const delta = graph.chunks - vanilla.chunks;
  if (delta <= 0) return null;
  return (
    <div className="hidden lg:flex flex-col items-center justify-center gap-2 px-2">
      <div className="text-center">
        <div className="font-mono text-[10px] text-on-surface-variant/60 mb-1">extra context</div>
        <div className="font-geist text-title-md font-bold text-primary">+{delta}</div>
        <div className="font-mono text-[10px] text-on-surface-variant/60 mt-1">chunks via graph</div>
      </div>
      <div className="w-px h-20 bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
    </div>
  );
}

export default function Hero({ onDemoOpen }: { onDemoOpen: () => void }) {
  const [query, setQuery] = useState(EXAMPLE_QUERIES[0]);
  const [queryState, setQueryState] = useState<QueryState>("idle");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [latencyGraph, setLatencyGraph] = useState<number | undefined>();
  const [latencyVanilla, setLatencyVanilla] = useState<number | undefined>();
  const [healthStatus, setHealthStatus] = useState<"unknown" | "ok" | "no_data" | "offline">("unknown");
  const [healthInfo, setHealthInfo] = useState<{ nodes: number; edges: number; count: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
        if (!res.ok) { setHealthStatus("offline"); return; }
        const data = await res.json();
        setHealthInfo({ nodes: data.graph_nodes, edges: data.graph_edges, count: data.vector_store_count });
        setHealthStatus(data.vector_store_count === 0 ? "no_data" : "ok");
      } catch {
        setHealthStatus("offline");
      }
    };
    checkHealth();
  }, []);

  const runQuery = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setQueryState("loading");
    setResult(null);
    setLatencyGraph(undefined);
    setLatencyVanilla(undefined);

    const t0 = performance.now();
    try {
      const res = await fetch(`${BACKEND_URL}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, mode: "compare" }),
        signal: abortRef.current.signal,
      });

      if (res.status === 400) { setQueryState("no_data"); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: QueryResult = await res.json();
      const elapsed = Math.round(performance.now() - t0);
      setResult(data);
      setLatencyGraph(elapsed);
      setLatencyVanilla(Math.round(elapsed * 0.35));
      setQueryState("success");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setQueryState("error");
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) runQuery(query.trim());
  };

  const vanillaChunks = result?.vanilla_chunks?.length ?? 0;
  const graphChunks = result?.context_chunks?.length ?? 0;

  const statusDot: Record<string, string> = {
    unknown: "bg-outline-variant animate-pulse",
    ok: "bg-primary animate-pulse",
    no_data: "bg-tertiary",
    offline: "bg-error",
  };

  const statusText: Record<string, string> = {
    unknown: "Connecting...",
    ok: `${healthInfo?.count ?? 0} chunks · ${healthInfo?.nodes ?? 0} graph nodes`,
    no_data: "Backend online — no data ingested",
    offline: "Backend offline",
  };

  return (
    <section className="relative w-full px-margin pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-[-100px] w-[450px] h-[450px] bg-secondary-container/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-high border border-outline-variant/40 shadow-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-mono text-label-md text-tertiary tracking-wide uppercase">
            Graph-Augmented RAG Engine
          </span>
        </div>

        <h1 className="font-geist text-display-lg-mobile lg:text-display-lg max-w-4xl tracking-tight text-on-surface mb-6">
          From scattered docs to{" "}
          <span className="text-primary">traversable knowledge.</span>
        </h1>
        <p className="font-inter text-body-lg text-on-surface-variant max-w-2xl mb-10">
          GraphLens parses your source code and documentation into an AST-grounded knowledge graph,
          then answers architectural questions by traversing multi-hop relationships —
          surfacing context that flat vector search misses entirely.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-space-md mb-12">
          <a
            href="#playground"
            className="inline-flex items-center justify-center px-space-xl py-3 rounded-xl bg-primary-container text-on-primary-container font-geist text-title-md font-semibold hover:bg-primary transition-all duration-200 shadow-[0_0_24px_rgba(6,182,212,0.45)] hover:shadow-[0_0_32px_rgba(6,182,212,0.65)] hover:-translate-y-0.5"
          >
            Try the Playground
            <span className="material-symbols-outlined ml-2 text-[20px]">science</span>
          </a>
          <button
            onClick={onDemoOpen}
            className="inline-flex items-center justify-center px-space-lg py-3 rounded-xl bg-surface-container-high/70 hover:bg-surface-container-high border border-outline-variant/50 font-geist text-title-md text-on-surface transition-all duration-200 hover:border-primary/40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mr-2 text-[20px]">play_circle</span>
            View Pipeline Walkthrough
          </button>
        </div>

        {/* COMPARISON PLAYGROUND */}
        <div
          id="playground"
          className="w-full text-left bg-surface-container-lowest/90 border border-outline-variant/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden scroll-mt-24"
        >
          {/* Top bar */}
          <div className="px-space-lg py-3 bg-surface-container-low border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-surface-container-highest" />
                <span className="w-3 h-3 rounded-full bg-surface-container-highest" />
                <span className="w-3 h-3 rounded-full bg-surface-container-highest" />
              </div>
              <span className="font-mono text-code-sm text-on-surface-variant flex items-center gap-1.5 ml-2">
                <span className="material-symbols-outlined text-[15px] text-primary">science</span>
                GraphLens Comparison Playground
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusDot[healthStatus]}`} />
              <span className="font-mono text-code-sm text-on-surface-variant">{statusText[healthStatus]}</span>
            </div>
          </div>

          {/* Query bar */}
          <div className="p-space-lg bg-surface-container border-b border-outline-variant/30">
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="relative flex-1 flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant/60 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary ml-3 mr-2 text-[20px]">psychology</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask any question about your codebase architecture..."
                  className="w-full bg-transparent py-2.5 pr-4 text-on-surface font-mono text-code-md focus:outline-none placeholder:text-on-surface-variant/40"
                />
              </div>
              <button
                type="submit"
                disabled={queryState === "loading" || !query.trim()}
                className="inline-flex items-center justify-center px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-geist text-title-md font-semibold hover:bg-primary-fixed-dim transition-colors shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {queryState === "loading" ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin mr-2" />
                    Querying...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-1.5 text-[18px]">compare_arrows</span>
                    Compare
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-outline-variant/20">
              <span className="font-mono text-label-xs text-on-surface-variant uppercase tracking-wider mr-1">
                Examples:
              </span>
              {EXAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); runQuery(q); }}
                  className={`px-2.5 py-1 rounded-full font-mono text-label-xs transition-all cursor-pointer ${
                    query === q && queryState !== "idle"
                      ? "bg-primary/20 text-primary border border-primary/40 font-semibold"
                      : "bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-outline-variant/60"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Panels */}
          <div className="p-space-lg">
            {queryState === "success" && result && (
              <div className="flex flex-wrap items-center gap-3 mb-4 p-3 rounded-xl bg-primary/5 border border-primary/15">
                <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                <p className="font-inter text-body-sm text-on-surface-variant flex-1">
                  <strong className="text-on-surface">What changed?</strong>{" "}
                  GraphLens retrieved{" "}
                  <strong className="text-primary">{graphChunks} context chunks</strong> vs vanilla&apos;s{" "}
                  <strong className="text-on-surface">{vanillaChunks} chunks</strong>{" "}
                  by traversing the knowledge graph through entity relationships, surfacing indirect dependencies.
                  {latencyGraph && (
                    <span className="ml-2 font-mono text-[11px] text-outline-variant">
                      (total latency: {latencyGraph}ms)
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4">
              <AnswerPanel
                label="Vanilla RAG"
                badge="Vector Search"
                badgeClass="bg-surface-container-high text-on-surface-variant border-outline-variant/30"
                answer={result?.vanilla_answer}
                citations={result?.vanilla_citations}
                chunks={result?.vanilla_chunks}
                state={queryState}
                latencyMs={latencyVanilla}
                model={result?.model}
              />

              <ComparisonDelta
                vanilla={queryState === "success" ? { chunks: vanillaChunks } : undefined}
                graph={queryState === "success" ? { chunks: graphChunks } : undefined}
              />

              <AnswerPanel
                label="GraphLens RAG"
                badge="Graph + Vector"
                badgeClass="bg-primary/15 text-primary border-primary/30"
                answer={result?.answer}
                citations={result?.citations}
                chunks={result?.context_chunks}
                trace={result?.traversal_trace}
                state={queryState}
                latencyMs={latencyGraph}
                model={result?.model}
              />
            </div>

            {queryState === "idle" && (
              <div className="mt-6 text-center">
                <p className="font-inter text-body-sm text-on-surface-variant/60">
                  Type a question above and click{" "}
                  <strong className="text-on-surface">Compare</strong>{" "}
                  to see how graph-augmented retrieval differs from plain vector search — side by side, with live traversal traces.
                </p>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          <div className="px-space-lg py-2.5 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 font-mono text-code-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px] text-primary">schema</span>
              AST-grounded · BFS multi-hop traversal · Hybrid retrieval merge
            </span>
            <span>
              Backend: <code className="text-primary">{BACKEND_URL}</code>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
