"use client";
import { useState } from "react";

export default function Hero({ onDemoOpen }: { onDemoOpen: () => void }) {
  return (
    <section className="relative w-full px-margin pt-12 pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
      {/* Ambient glow backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-[-100px] w-[450px] h-[450px] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-high border border-outline-variant/40 shadow-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="font-mono text-label-md text-tertiary tracking-wide uppercase">
            Architecture Intelligence for Engineering Teams
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-geist text-display-lg-mobile lg:text-display-lg max-w-4xl tracking-tight text-on-surface mb-6">
          Understand your system dependencies instantly.
        </h1>
        <p className="font-inter text-body-lg text-on-surface-variant max-w-2xl mb-10">
          GraphLens connects your documentation into a live knowledge graph so your team can query
          architectural relationships in plain English.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-space-md mb-16">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-space-xl py-3 rounded-xl bg-primary-container text-on-primary-container font-geist text-title-md font-medium hover:bg-primary transition-all duration-200 shadow-[0_0_24px_rgba(6,182,212,0.45)] hover:shadow-[0_0_32px_rgba(6,182,212,0.65)] hover:-translate-y-0.5"
          >
            Start your free trial
            <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
          </a>
          <button
            onClick={onDemoOpen}
            className="inline-flex items-center justify-center px-space-lg py-3 rounded-xl bg-surface-container-high/70 hover:bg-surface-container-high border border-outline-variant/50 font-geist text-title-md text-on-surface transition-all duration-200 hover:border-primary/40"
          >
            <span className="material-symbols-outlined text-primary mr-2 text-[20px]">play_circle</span>
            Watch a 2-minute demo
          </button>
        </div>

        {/* Hero console mockup */}
        <div className="w-full text-left bg-surface-container-lowest/90 border border-outline-variant/40 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top bar */}
          <div className="px-space-lg py-3 bg-surface-container-low border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-surface-container-highest" />
                <span className="w-3 h-3 rounded-full bg-surface-container-highest" />
                <span className="w-3 h-3 rounded-full bg-surface-container-highest" />
              </div>
              <span className="font-mono text-code-sm text-on-surface-variant flex items-center gap-1 ml-2">
                <span className="material-symbols-outlined text-[15px] text-primary">terminal</span>
                graphlens-core // topological-mesh-v2
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-mono text-code-sm text-on-surface-variant">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Graph synced 2m ago</span>
                <span className="text-outline-variant">•</span>
                <span className="text-tertiary-fixed-dim">142 services indexed</span>
              </div>
              <span className="font-mono text-label-xs bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant border border-outline-variant/30">
                L4 INGESTION
              </span>
            </div>
          </div>

          {/* Query bar */}
          <div className="p-space-lg bg-surface-container border-b border-outline-variant/30">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="relative flex-1 flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant/60 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary ml-3 mr-2 text-[20px]">psychology</span>
                <input
                  readOnly
                  className="w-full bg-transparent py-2.5 pr-4 text-on-surface font-mono text-code-md focus:outline-none cursor-default select-none"
                  defaultValue="What services break if we deprecate auth-v1 tokens in Q3?"
                />
                <span className="font-mono text-label-xs text-on-surface-variant/70 mr-3 px-1.5 py-0.5 rounded bg-surface-container-high">
                  PROMPT
                </span>
              </div>
              <button className="inline-flex items-center justify-center px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-geist text-title-md font-medium hover:bg-primary-fixed-dim transition-colors shadow-sm whitespace-nowrap">
                <span className="material-symbols-outlined mr-1.5 text-[18px]">bolt</span>
                Execute Query
              </button>
            </div>
          </div>

          {/* Canvas + inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Graph canvas */}
            <div className="lg:col-span-8 p-space-lg relative flex flex-col justify-between bg-surface-container-lowest/60">
              {/* Grid bg */}
              <div className="absolute inset-0 bg-[radial-gradient(#3d494c_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

              {/* Status bar */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-label-md text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">device_hub</span>
                    ACTIVE SUBGRAPH
                  </span>
                  <span className="font-mono text-code-sm bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                    auth-v1-blast-radius
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-4 font-mono text-code-sm text-on-surface-variant">
                  <span>Latency: <strong className="text-on-surface">14ms</strong></span>
                  <span>Protocol: <strong className="text-on-surface">gRPC / REST</strong></span>
                  <span>Traffic: <strong className="text-tertiary-fixed-dim">42k req/s</strong></span>
                </div>
              </div>

              {/* Node graph */}
              <div className="relative z-10 my-8 w-full min-h-[320px] flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="edge-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="edge-warn" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <path className="animate-dash" d="M 460 160 C 350 160, 240 100, 180 80" fill="none" stroke="url(#edge-cyan)" strokeDasharray="4,4" strokeWidth="2" />
                  <path d="M 460 180 C 350 180, 240 240, 180 260" fill="none" stroke="url(#edge-cyan)" strokeWidth="1.5" />
                  <path d="M 540 160 C 620 160, 700 90, 760 75" fill="none" stroke="url(#edge-cyan)" strokeWidth="1.5" />
                  <path d="M 540 175 C 640 175, 700 175, 760 175" fill="none" stroke="url(#edge-warn)" strokeWidth="2.5" />
                  <path d="M 540 190 C 640 210, 700 260, 760 270" fill="none" stroke="url(#edge-cyan)" strokeWidth="1.5" />
                </svg>

                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                  {/* Left nodes */}
                  <div className="flex flex-col gap-8 z-20">
                    <div className="group p-3 rounded-lg bg-surface-container border border-outline-variant/50 hover:border-primary/50 transition-all duration-200 shadow-md w-52 cursor-pointer">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-medium">Billing Gateway</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Go</span>
                      </div>
                      <div className="font-mono text-code-sm text-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">sync_alt</span>
                        HTTP POST /verify
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/40 hover:border-primary/40 transition-all duration-200 shadow-md w-52 cursor-pointer">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-medium">User Profile Svc</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Node</span>
                      </div>
                      <div className="font-mono text-code-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">arrow_right_alt</span>
                        gRPC session.v2
                      </div>
                    </div>
                  </div>

                  {/* Central node */}
                  <div className="z-20 p-5 rounded-xl bg-surface-container-high border-2 border-primary node-glow text-center w-64 transform scale-105">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-label-xs uppercase mb-2">
                      <span className="material-symbols-outlined text-[12px]">security</span>
                      Target Entity
                    </div>
                    <h3 className="font-geist text-headline-md text-on-surface font-semibold tracking-tight">Auth API</h3>
                    <p className="font-mono text-code-sm text-on-surface-variant mt-0.5">service: auth-core:v1.14</p>
                    <div className="mt-3 pt-3 border-t border-outline-variant/40 flex items-center justify-around font-mono text-label-xs text-tertiary">
                      <span>5 INGRESS</span>
                      <span>•</span>
                      <span>12 EGRESS</span>
                    </div>
                  </div>

                  {/* Right nodes */}
                  <div className="flex flex-col gap-5 z-20">
                    <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/40 hover:border-primary/40 transition-all duration-200 shadow-md w-56 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-medium">Notification Engine</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Rust</span>
                      </div>
                      <span className="font-mono text-code-sm text-on-surface-variant">PubSub consumer</span>
                    </div>
                    <div className="p-3 rounded-lg bg-error-container/20 border border-error/50 shadow-[0_0_15px_rgba(255,180,171,0.2)] w-56 cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-error text-on-error font-mono text-label-xs px-1.5 py-0.5 uppercase tracking-wider font-bold">
                        Deprecation Risk
                      </div>
                      <div className="flex items-center gap-1.5 mb-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                        <span className="font-geist text-title-md text-on-surface font-semibold">Legacy Mobile GW</span>
                      </div>
                      <p className="font-inter text-body-sm text-error font-medium">Direct Token Deprecation Risk</p>
                      <span className="font-mono text-code-sm text-on-surface-variant block mt-1">Bearer hardcoded / v1</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/40 hover:border-primary/40 transition-all duration-200 shadow-md w-56 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-medium">Orders DB Proxy</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Go</span>
                      </div>
                      <span className="font-mono text-code-sm text-on-surface-variant">Read replica shard #3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas bottom bar */}
              <div className="relative z-10 pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-code-sm text-on-surface-variant">
                <span>Selected node: <span className="text-primary">Auth API</span> (0.012s traversal time)</span>
                <span className="hidden sm:inline-block">Click nodes for AST citation analysis</span>
              </div>
            </div>

            {/* Inspector panel */}
            <div className="lg:col-span-4 bg-surface-container-low border-t lg:border-t-0 lg:border-l border-outline-variant/30 p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
                  <h4 className="font-geist text-title-md text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
                    Verified Documentation Citations
                  </h4>
                  <span className="font-mono text-label-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    2 SOURCES
                  </span>
                </div>

                {/* Citation 1 */}
                <div className="mb-4 bg-surface-container rounded-lg p-3 border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-code-sm text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">article</span>
                      docs/auth/jwt-migration.md:42
                    </span>
                    <span className="font-mono text-label-xs text-on-surface-variant">Confluence sync</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-lowest font-mono text-code-sm text-on-surface-variant leading-relaxed overflow-x-auto border border-outline-variant/20">
                    <code>
                      <span className="text-tertiary"># Auth Deprecation Roadmap</span><br />
                      - Phase 2: Deprecate <span className="text-error">auth-v1 legacy tokens</span> by End-of-Q3.<br />
                      - <span className="text-primary">Legacy Mobile Gateway</span> still invokes `/token/v1/introspect`.
                    </code>
                  </div>
                </div>

                {/* Citation 2 */}
                <div className="mb-4 bg-surface-container rounded-lg p-3 border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-code-sm text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">code</span>
                      services/billing/client.go:88
                    </span>
                    <span className="font-mono text-label-xs text-on-surface-variant">GitHub PR #1480</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-lowest font-mono text-code-sm text-on-surface-variant leading-relaxed overflow-x-auto border border-outline-variant/20">
                    <code>
                      <span className="text-outline">87</span> func (c *BillingClient) VerifyToken(ctx) {"{"}<br />
                      <span className="text-outline">88</span>   req := c.authClient.NewRequest(<span className="text-tertiary">"POST"</span>, <span className="text-primary-fixed">"/verify"</span>)<br />
                      <span className="text-outline">89</span>   <span className="text-outline-variant">// uses fallback v1 handler</span><br />
                      <span className="text-outline">90</span> {"}"}
                    </code>
                  </div>
                </div>

                {/* Synthesis */}
                <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/30">
                  <div className="flex items-center gap-1.5 text-tertiary font-geist text-body-sm font-semibold mb-1">
                    <span className="material-symbols-outlined text-[16px]">summarize</span>
                    Synthesis Summary
                  </div>
                  <p className="font-inter text-body-sm text-on-surface-variant leading-normal">
                    Deprecating <strong className="text-on-surface font-medium">auth-v1</strong> directly disrupts{" "}
                    <strong className="text-error font-medium">Legacy Mobile Gateway</strong> which relies on introspect
                    endpoint (no v2 token exchange implemented). Billing Gateway has a fallback but requires header update.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center justify-between font-mono text-label-xs text-on-surface-variant">
                <span>Grounding certainty: 99.8%</span>
                <a href="#features" className="text-primary hover:underline flex items-center gap-1">
                  Inspect graph lineage <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
