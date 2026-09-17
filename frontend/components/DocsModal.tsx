"use client";
import { useState } from "react";

interface DocsModalProps {
  onClose: () => void;
}

export default function DocsModal({ onClose }: DocsModalProps) {
  const [activeTab, setActiveTab] = useState<"api" | "architecture" | "graph">("api");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-md px-margin animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-space-lg max-w-4xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </div>
            <div>
              <h3 className="font-geist text-headline-sm text-on-surface font-semibold">
                GraphLens Documentation &amp; Reference
              </h3>
              <p className="font-mono text-code-sm text-on-surface-variant">v1.0.0 — OpenAPI 3.1 Specification</p>
            </div>
          </div>
          <button
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-outline-variant/20 pt-3 pb-2">
          {[
            { id: "api", label: "FastAPI Endpoints", icon: "api" },
            { id: "architecture", label: "Graph-Augmented RAG", icon: "account_tree" },
            { id: "graph", label: "AST Extractor Spec", icon: "data_object" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-code-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary border border-primary/30 font-medium"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {activeTab === "api" && (
            <div className="space-y-4">
              {/* Endpoint 1 */}
              <div className="rounded-xl bg-surface-container p-4 border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-2 font-mono text-code-sm">
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">POST</span>
                  <span className="text-on-surface font-semibold">/api/query</span>
                  <span className="text-on-surface-variant text-label-xs ml-auto">Graph-Augmented Query</span>
                </div>
                <p className="font-inter text-body-sm text-on-surface-variant mb-3">
                  Query architectural knowledge graph with hybrid vector similarity + multi-hop graph traversal.
                </p>
                <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-code-sm text-on-surface-variant border border-outline-variant/20">
                  <span className="text-outline-variant">// Request Payload</span>
                  <pre className="text-primary-fixed mt-1">
{`{
  "question": "What services break if auth-v1 is deprecated?",
  "mode": "graph",          // "vanilla" | "graph" | "compare"
  "top_k": 5,
  "traversal_depth": 2
}`}
                  </pre>
                </div>
              </div>

              {/* Endpoint 2 */}
              <div className="rounded-xl bg-surface-container p-4 border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-2 font-mono text-code-sm">
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">POST</span>
                  <span className="text-on-surface font-semibold">/api/ingest</span>
                  <span className="text-on-surface-variant text-label-xs ml-auto">Background Ingestion</span>
                </div>
                <p className="font-inter text-body-sm text-on-surface-variant mb-3">
                  Parses Markdown, OpenAPI, and Protobuf files to reconstruct directed call graphs.
                </p>
                <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-code-sm text-on-surface-variant border border-outline-variant/20">
                  <span className="text-outline-variant">// Ingestion Trigger</span>
                  <pre className="text-tertiary mt-1">
{`{
  "corpus_path": "corpus/docs",
  "rebuild_vector_index": true
}`}
                  </pre>
                </div>
              </div>

              {/* Endpoint 3 */}
              <div className="rounded-xl bg-surface-container p-4 border border-outline-variant/30">
                <div className="flex items-center gap-2 mb-2 font-mono text-code-sm">
                  <span className="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary font-bold">GET</span>
                  <span className="text-on-surface font-semibold">/api/graph</span>
                  <span className="text-on-surface-variant text-label-xs ml-auto">Topological Graph Export</span>
                </div>
                <p className="font-inter text-body-sm text-on-surface-variant">
                  Returns nodes, directed edges, service protocols, and blast-radius clusters for interactive visualization.
                </p>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-surface-container p-4 border border-outline-variant/30">
                <h4 className="font-geist text-title-md text-primary font-semibold mb-2">Dual-Stream Synthesis</h4>
                <p className="font-inter text-body-sm text-on-surface-variant leading-relaxed">
                  Unlike traditional RAG that suffers from chunk-level fragmentation, GraphLens maintains an in-memory
                  NetworkX directed multigraph alongside dense vector embeddings (bge-small-en-v1.5 / Cloudflare BAAI).
                  Entities extracted from code repositories are enriched with verified Markdown documentation links.
                </p>
              </div>
              <div className="rounded-xl bg-surface-container p-4 border border-outline-variant/30">
                <h4 className="font-geist text-title-md text-tertiary font-semibold mb-2">Deterministic Grounding</h4>
                <p className="font-inter text-body-sm text-on-surface-variant leading-relaxed">
                  Every edge in the response path references both AST proof (e.g. Go gRPC client invocation) and
                  Confluence/Notion documentation line citations to eliminate LLM hallucinations.
                </p>
              </div>
            </div>
          )}

          {activeTab === "graph" && (
            <div className="space-y-4">
              <div className="rounded-xl bg-surface-container p-4 border border-outline-variant/30">
                <h4 className="font-geist text-title-md text-secondary font-semibold mb-2">Supported Language AST Parsers</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {[
                    { lang: "Go", parser: "tree-sitter-go", type: "gRPC & HTTP" },
                    { lang: "TypeScript", parser: "babel/parser", type: "Fetch & Express" },
                    { lang: "Python", parser: "ast / Jedi", type: "FastAPI / Requests" },
                    { lang: "Rust", parser: "syn / ra_ap", type: "Tonic & Actix" },
                  ].map((p) => (
                    <div key={p.lang} className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-center">
                      <div className="font-geist text-title-md text-on-surface font-medium">{p.lang}</div>
                      <div className="font-mono text-label-xs text-primary mt-1">{p.parser}</div>
                      <div className="font-inter text-body-sm text-on-surface-variant text-[11px]">{p.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-mono text-label-xs text-on-surface-variant">
            Backend API: <span className="text-primary">http://localhost:8000</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-geist text-title-md"
          >
            Close Reference
          </button>
        </div>
      </div>
    </div>
  );
}
