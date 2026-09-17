"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How does Graph-Augmented RAG differ from standard vector RAG?",
    a: "Standard vector RAG calculates cosine similarity over isolated text chunks, ignoring cross-file call chains. GraphLens first identifies seed entities via vector search, then executes an N-hop graph traversal across directed edges to assemble full architectural dependency paths before LLM synthesis.",
  },
  {
    q: "How are code entities and service relationships extracted?",
    a: "The ingestion pipeline parses source files using AST analyzers (Tree-sitter, regex grammar extractors, protobuf compilers). It detects exported RPC definitions, HTTP route handlers, and client invocation calls, linking them to corresponding documentation sections.",
  },
  {
    q: "What embedding models and LLM providers are supported?",
    a: "The project uses Cloudflare Workers AI as the primary provider (running bge-small-en-v1.5 and LLaMA models), with OpenRouter as an automatic fallback provider. It also supports local sentence-transformers (all-MiniLM-L6-v2) for offline development.",
  },
  {
    q: "How is the knowledge graph stored and traversed?",
    a: "The graph is modeled as an in-memory NetworkX directed multigraph serialized via GraphML and JSON. Graph queries perform breadth-first search (BFS) up to a configurable traversal depth (default k=2) to identify upstream callers and downstream dependencies.",
  },
  {
    q: "Does GraphLens support side-by-side RAG evaluation?",
    a: "Yes. The backend /api/query endpoint supports mode='compare', which generates two parallel responses: one using vanilla top-k vector chunks, and one augmented with multi-hop graph nodes, allowing direct assessment of hallucination reduction.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full px-margin py-24 bg-surface border-t border-outline-variant/20" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-label-xs uppercase tracking-widest text-primary font-semibold">
            Technical Architecture
          </span>
          <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mt-2">
            Frequently Asked Questions &amp; System Design
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-surface-container-low border border-outline-variant/30 overflow-hidden"
            >
              <button
                className="w-full px-space-lg py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer hover:bg-surface-container/50 transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="font-geist text-title-md text-on-surface font-medium">
                  {faq.q}
                </span>
                <span
                  className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-200 ${
                    openIdx === i ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              {openIdx === i && (
                <div className="px-space-lg pb-5 pt-1 text-on-surface-variant font-inter text-body-md border-t border-outline-variant/10 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
