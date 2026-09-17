"use client";
import { useState, useEffect } from "react";

export default function DemoModal({ onClose }: { onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(33);

  // Auto-advance through demo steps
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev >= 3 ? 1 : prev + 1;
        setProgress(next * 33.33);
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-md px-margin animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-space-lg max-w-4xl w-full shadow-2xl relative flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
            </div>
            <div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold">
                GraphLens Interactive Architecture Walkthrough
              </h3>
              <p className="font-mono text-label-xs text-on-surface-variant">Live AST &amp; Dependency Traversal Simulation</p>
            </div>
          </div>
          <button
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Step Tabs & Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, title: "01. AST Ingestion", sub: "Scan repos & protobufs" },
              { num: 2, title: "02. Graph Assembly", sub: "142 nodes, 318 edges" },
              { num: 3, title: "03. Live Traversal", sub: "Plain-English querying" },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => {
                  setActiveStep(s.num);
                  setProgress(s.num * 33.33);
                  setIsPlaying(false);
                }}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  activeStep === s.num
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : "bg-surface-container border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60"
                }`}
              >
                <div className="font-mono text-label-xs uppercase font-semibold">{s.title}</div>
                <div className="font-inter text-body-sm text-[11px] truncate opacity-80">{s.sub}</div>
              </button>
            ))}
          </div>

          <div className="w-full bg-surface-container-highest rounded-full h-1 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Interactive Stage */}
        <div className="aspect-[16/9] w-full bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-6 flex flex-col justify-between overflow-hidden relative font-mono text-code-sm">
          {activeStep === 1 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-on-surface-variant border-b border-outline-variant/20 pb-2">
                <span className="flex items-center gap-2 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  STAGE 1: Scanning Source Repositories &amp; OpenAPI Contracts
                </span>
                <span className="text-label-xs bg-surface-container-high px-2 py-0.5 rounded">Tree-Sitter v0.22</span>
              </div>
              <div className="space-y-1.5 text-on-surface-variant text-[13px] pt-2">
                <p className="text-tertiary">➜ Cloned repo: github.com/enterprise/auth-core (branch: main)</p>
                <p className="text-on-surface">➜ Parsing AST: <span className="text-primary">services/auth/token_verifier.go</span> [Found 14 gRPC exported handlers]</p>
                <p className="text-on-surface">➜ Parsing AST: <span className="text-primary">services/billing/client.go</span> [Detected direct HTTP POST to /verify]</p>
                <p className="text-on-surface">➜ Parsing Protobuf: <span className="text-secondary">proto/session/v2/session.proto</span> [Extracted 4 RPC definitions]</p>
                <p className="text-tertiary-fixed-dim">✔ Ingested 42 documentation markdown pages from Confluence</p>
              </div>
              <div className="mt-4 p-3 rounded bg-surface-container border border-outline-variant/30 flex items-center justify-between">
                <span className="text-on-surface font-inter text-body-sm">Parsing completeness</span>
                <span className="text-primary font-bold">100% — Zero Manual Annotation Required</span>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-on-surface-variant border-b border-outline-variant/20 pb-2">
                <span className="flex items-center gap-2 text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">account_tree</span>
                  STAGE 2: Generating NetworkX Multigraph &amp; Dense Vector Links
                </span>
                <span className="text-label-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">Topology Engine</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 space-y-1.5">
                  <div className="text-label-xs text-on-surface-variant uppercase">Graph Topology</div>
                  <div className="text-headline-md font-geist text-on-surface font-bold">142 Services</div>
                  <div className="text-[12px] text-tertiary">318 verified directed edges</div>
                  <div className="text-[12px] text-outline">Mean node degree: 4.48</div>
                </div>
                <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 space-y-1.5">
                  <div className="text-label-xs text-on-surface-variant uppercase">Vector Embedding Space</div>
                  <div className="text-headline-md font-geist text-on-surface font-bold">4,812 Chunks</div>
                  <div className="text-[12px] text-secondary">Cloudflare BAAI / bge-small-en</div>
                  <div className="text-[12px] text-outline">Latency: 8.2ms retrieval</div>
                </div>
              </div>
              <div className="p-2.5 rounded bg-surface-container-high text-[12px] text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Verified consistency: Ingress/Egress match across all OpenAPI and gRPC endpoints.
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-on-surface-variant border-b border-outline-variant/20 pb-2">
                <span className="flex items-center gap-2 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  STAGE 3: Real-Time Blast Radius &amp; Citation Grounding
                </span>
                <span className="text-label-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Query Resolved (12ms)</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container border border-primary/30">
                <div className="text-[12px] text-on-surface-variant mb-1">PROMPT:</div>
                <div className="text-on-surface font-semibold text-[14px]">
                  "What services break if we deprecate auth-v1 tokens in Q3?"
                </div>
              </div>
              <div className="p-3 rounded-lg bg-error-container/20 border border-error/40 text-on-surface text-[12px] space-y-1">
                <div className="flex items-center gap-1.5 text-error font-bold">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  CRITICAL IMPACT DETECTED (1 Direct Risk / 3 Transitive)
                </div>
                <p className="text-on-surface-variant">
                  <strong className="text-on-surface">Legacy Mobile Gateway</strong> has no v2 refresh fallback.
                  Direct invocation of <code className="text-primary-fixed">/token/v1/introspect</code> line 88 will throw HTTP 401.
                </p>
              </div>
            </div>
          )}

          {/* Player controls */}
          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-on-surface-variant">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
                <span className="text-label-xs uppercase">{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <span className="text-label-xs text-on-surface-variant/70">
                Step {activeStep} of 3
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById("demo-console");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1 text-primary hover:underline text-label-xs font-semibold"
            >
              Try in Live Console <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
