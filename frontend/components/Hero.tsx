"use client";
import { useState, useTransition } from "react";

interface NodeDetail {
  id: string;
  name: string;
  lang: string;
  protocol: string;
  endpoint: string;
  risk: "critical" | "warning" | "stable";
  riskLabel: string;
  service: string;
  ingress: number;
  egress: number;
  citationFile: string;
  citationSource: string;
  citationLine: number;
  citationCode: { lineNum: number; code: string; highlight?: boolean }[];
  synthesis: string;
}

const NODES_DATA: Record<string, NodeDetail> = {
  auth: {
    id: "auth",
    name: "Auth API",
    lang: "Go",
    protocol: "gRPC / REST",
    endpoint: "auth-core:v1.14",
    risk: "warning",
    riskLabel: "Central Entity",
    service: "service: auth-core:v1.14",
    ingress: 5,
    egress: 12,
    citationFile: "docs/auth/jwt-migration.md:42",
    citationSource: "Confluence sync",
    citationLine: 42,
    citationCode: [
      { lineNum: 40, code: "# Auth Deprecation Roadmap" },
      { lineNum: 41, code: "- Phase 2: Deprecate auth-v1 legacy tokens by End-of-Q3." },
      { lineNum: 42, code: "- Legacy Mobile Gateway still invokes /token/v1/introspect.", highlight: true },
      { lineNum: 43, code: "- All other clients migrated to JWT RS256 token exchange." },
    ],
    synthesis:
      "Deprecating auth-v1 directly disrupts Legacy Mobile Gateway which relies on introspect endpoint (no v2 token exchange implemented). Billing Gateway has a fallback but requires header update.",
  },
  billing: {
    id: "billing",
    name: "Billing Gateway",
    lang: "Go",
    protocol: "HTTP POST",
    endpoint: "/verify",
    risk: "warning",
    riskLabel: "Fallback Required",
    service: "service: billing-gw:v2.4",
    ingress: 3,
    egress: 4,
    citationFile: "services/billing/client.go:88",
    citationSource: "GitHub PR #1480",
    citationLine: 88,
    citationCode: [
      { lineNum: 86, code: "func (c *BillingClient) VerifyToken(ctx context.Context) error {" },
      { lineNum: 87, code: "  // Fallback to v1 verification handler if JWT missing" },
      { lineNum: 88, code: "  req := c.authClient.NewRequest(\"POST\", \"/verify\")", highlight: true },
      { lineNum: 89, code: "  return c.doRequest(ctx, req)" },
      { lineNum: 90, code: "}" },
    ],
    synthesis:
      "Billing Gateway handles card payment authorizations. It currently issues HTTP POST requests to /verify on Auth API using a legacy fallback header when auth-v2 tokens are malformed.",
  },
  user: {
    id: "user",
    name: "User Profile Svc",
    lang: "Node",
    protocol: "gRPC",
    endpoint: "session.v2",
    risk: "stable",
    riskLabel: "Fully Migrated",
    service: "service: profile-svc:v3.1",
    ingress: 8,
    egress: 2,
    citationFile: "services/profile/session.ts:114",
    citationSource: "GitLab repo",
    citationLine: 114,
    citationCode: [
      { lineNum: 112, code: "export async function validateSession(token: string) {" },
      { lineNum: 113, code: "  const grpcClient = getAuthV2Client();" },
      { lineNum: 114, code: "  return await grpcClient.verifyTokenV2({ token });", highlight: true },
      { lineNum: 115, code: "}" },
    ],
    synthesis:
      "User Profile Service has been completely transitioned to auth-v2 gRPC session tokens. No disruption expected from legacy token deprecation.",
  },
  legacy: {
    id: "legacy",
    name: "Legacy Mobile GW",
    lang: "Node",
    protocol: "Bearer v1",
    endpoint: "Direct Token",
    risk: "critical",
    riskLabel: "Deprecation Risk",
    service: "service: mobile-gw:v1.2",
    ingress: 1,
    egress: 6,
    citationFile: "gateway/mobile/auth_interceptor.js:52",
    citationSource: "Notion Architecture Wiki",
    citationLine: 52,
    citationCode: [
      { lineNum: 50, code: "// HARDCODED: Legacy mobile iOS v3.4 builds bypass v2 SSO" },
      { lineNum: 51, code: "const legacyUrl = 'https://auth.internal/v1/tokens/introspect';" },
      { lineNum: 52, code: "const res = await fetch(legacyUrl, { headers: { 'X-Auth-V1': rawToken } });", highlight: true },
      { lineNum: 53, code: "if (!res.ok) throw new AuthExpiredError();" },
    ],
    synthesis:
      "HIGH RISK: Direct token deprecation will instantly fail 18% of mobile clients still running iOS v3.4 without forced client-side app store update.",
  },
  notification: {
    id: "notification",
    name: "Notification Engine",
    lang: "Rust",
    protocol: "PubSub",
    endpoint: "events.auth.stream",
    risk: "stable",
    riskLabel: "Zero Impact",
    service: "service: notifier:v4.0",
    ingress: 0,
    egress: 8,
    citationFile: "services/notifier/src/consumer.rs:34",
    citationSource: "GitHub repo",
    citationLine: 34,
    citationCode: [
      { lineNum: 32, code: "pub async fn consume_auth_events(stream: &mut EventStream) {" },
      { lineNum: 33, code: "    while let Some(event) = stream.next().await {" },
      { lineNum: 34, code: "        match event.kind { AuthEvent::Revocation => handle_revocation() }", highlight: true },
      { lineNum: 35, code: "    }" },
      { lineNum: 36, code: "}" },
    ],
    synthesis:
      "Notification Engine operates asynchronously via Kafka/PubSub topic consumption. It does not perform synchronous auth token verification and will remain unaffected.",
  },
  orders: {
    id: "orders",
    name: "Orders DB Proxy",
    lang: "Go",
    protocol: "SQL / gRPC",
    endpoint: "Read replica #3",
    risk: "stable",
    riskLabel: "Isolated Shard",
    service: "service: db-proxy:v2.0",
    ingress: 4,
    egress: 1,
    citationFile: "pkg/db/pool.go:94",
    citationSource: "Confluence DB Guide",
    citationLine: 94,
    citationCode: [
      { lineNum: 92, code: "func (p *ConnectionPool) GetAuthReadOnlyConnection() (*sql.DB, error) {" },
      { lineNum: 93, code: "  // Uses service account mTLS, independent of user tokens" },
      { lineNum: 94, code: "  return p.shards.SelectPrimaryAuthReplica()", highlight: true },
      { lineNum: 95, code: "}" },
    ],
    synthesis:
      "Orders DB Proxy communicates via internal mTLS service certificates. User token deprecation has zero impact on internal shard health.",
  },
};

const PRESET_QUERIES = [
  {
    q: "What services break if we deprecate auth-v1 tokens in Q3?",
    subgraph: "auth-v1-blast-radius",
    targetNode: "auth",
  },
  {
    q: "Trace blast radius for Orders DB failover and shard replication",
    subgraph: "orders-shard-failover",
    targetNode: "orders",
  },
  {
    q: "Which downstream services call Billing Gateway directly?",
    subgraph: "billing-ingress-mesh",
    targetNode: "billing",
  },
];

export default function Hero({ onDemoOpen }: { onDemoOpen: () => void }) {
  const [query, setQuery] = useState(PRESET_QUERIES[0].q);
  const [activeSubgraph, setActiveSubgraph] = useState(PRESET_QUERIES[0].subgraph);
  const [selectedNodeId, setSelectedNodeId] = useState("auth");
  const [isSearching, setIsSearching] = useState(false);
  const [traversalTime, setTraversalTime] = useState("0.012s");

  const currentNode = NODES_DATA[selectedNodeId] || NODES_DATA.auth;

  const handleRunQuery = (customQuery?: string) => {
    const q = customQuery || query;
    setIsSearching(true);
    setTimeout(() => {
      // Pick matching preset or default
      const matched = PRESET_QUERIES.find((item) =>
        q.toLowerCase().includes(item.targetNode)
      ) || PRESET_QUERIES[0];

      setActiveSubgraph(matched.subgraph);
      setSelectedNodeId(matched.targetNode);
      setTraversalTime((0.008 + Math.random() * 0.009).toFixed(3) + "s");
      setIsSearching(false);
    }, 450);
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setTraversalTime((0.008 + Math.random() * 0.007).toFixed(3) + "s");
  };

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
            Graph-Augmented RAG Engine
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-geist text-display-lg-mobile lg:text-display-lg max-w-4xl tracking-tight text-on-surface mb-6">
          Understand your system dependencies instantly.
        </h1>
        <p className="font-inter text-body-lg text-on-surface-variant max-w-2xl mb-10">
          GraphLens transforms scattered technical documentation and source code into an executable knowledge graph
          for deterministic, multi-hop architectural queries with AST groundings.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-space-md mb-16">
          <a
            href="#demo-console"
            className="inline-flex items-center justify-center px-space-xl py-3 rounded-xl bg-primary-container text-on-primary-container font-geist text-title-md font-semibold hover:bg-primary transition-all duration-200 shadow-[0_0_24px_rgba(6,182,212,0.45)] hover:shadow-[0_0_32px_rgba(6,182,212,0.65)] hover:-translate-y-0.5"
          >
            Launch Interactive Console
            <span className="material-symbols-outlined ml-2 text-[20px]">terminal</span>
          </a>
          <button
            onClick={onDemoOpen}
            className="inline-flex items-center justify-center px-space-lg py-3 rounded-xl bg-surface-container-high/70 hover:bg-surface-container-high border border-outline-variant/50 font-geist text-title-md text-on-surface transition-all duration-200 hover:border-primary/40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mr-2 text-[20px]">play_circle</span>
            View Pipeline Walkthrough
          </button>
        </div>

        {/* Hero console mockup */}
        <div
          id="demo-console"
          className="w-full text-left bg-surface-container-lowest/90 border border-outline-variant/40 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden scroll-mt-24"
        >
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunQuery();
              }}
              className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3"
            >
              <div className="relative flex-1 flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant/60 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary ml-3 mr-2 text-[20px]">psychology</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask any architectural question in plain English..."
                  className="w-full bg-transparent py-2.5 pr-4 text-on-surface font-mono text-code-md focus:outline-none"
                />
                <span className="font-mono text-label-xs text-on-surface-variant/70 mr-3 px-1.5 py-0.5 rounded bg-surface-container-high hidden sm:inline-block">
                  PROMPT
                </span>
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="inline-flex items-center justify-center px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-geist text-title-md font-semibold hover:bg-primary-fixed-dim transition-colors shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-70"
              >
                {isSearching ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing ASTs...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-1.5 text-[18px]">bolt</span>
                    Execute Query
                  </>
                )}
              </button>
            </form>

            {/* Preset Query Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-outline-variant/20">
              <span className="font-mono text-label-xs text-on-surface-variant uppercase tracking-wider mr-1">
                Try queries:
              </span>
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset.q}
                  onClick={() => {
                    setQuery(preset.q);
                    handleRunQuery(preset.q);
                  }}
                  className={`px-2.5 py-1 rounded-full font-mono text-label-xs transition-all cursor-pointer ${
                    query === preset.q
                      ? "bg-primary/20 text-primary border border-primary/40 font-semibold"
                      : "bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-outline-variant/60"
                  }`}
                >
                  {preset.q}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas + inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Graph canvas */}
            <div className="lg:col-span-8 p-space-lg relative flex flex-col justify-between bg-surface-container-lowest/60">
              {/* Grid bg */}
              <div className="absolute inset-0 bg-[radial-gradient(#3d494c_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

              {/* Status bar */}
              <div className="relative z-10 flex flex-wrap items-center justify-between pb-3 border-b border-outline-variant/20 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-label-md text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[16px]">device_hub</span>
                    ACTIVE SUBGRAPH
                  </span>
                  <span className="font-mono text-code-sm bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                    {activeSubgraph}
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono text-code-sm text-on-surface-variant">
                  <span>Latency: <strong className="text-on-surface">14ms</strong></span>
                  <span>Protocol: <strong className="text-on-surface">{currentNode.protocol}</strong></span>
                  <span className="hidden sm:inline-block">Traffic: <strong className="text-tertiary-fixed-dim">42k req/s</strong></span>
                </div>
              </div>

              {/* Node graph canvas */}
              <div className="relative z-10 my-6 w-full min-h-[340px] flex items-center justify-center">
                {/* SVG connection lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 800 340"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                  <path className="animate-dash" d="M 400 170 C 300 170, 240 80, 160 80" fill="none" stroke="url(#edge-cyan)" strokeDasharray="4,4" strokeWidth="2" />
                  <path d="M 400 170 C 300 170, 240 260, 160 260" fill="none" stroke="url(#edge-cyan)" strokeWidth="1.5" />
                  <path d="M 400 170 C 500 170, 560 80, 640 80" fill="none" stroke="url(#edge-cyan)" strokeWidth="1.5" />
                  <path d="M 400 170 C 500 170, 560 170, 640 170" fill="none" stroke="url(#edge-warn)" strokeWidth="2.5" />
                  <path d="M 400 170 C 500 170, 560 260, 640 260" fill="none" stroke="url(#edge-cyan)" strokeWidth="1.5" />
                </svg>

                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                  {/* Left nodes */}
                  <div className="flex flex-col gap-6 z-20">
                    {/* Billing Gateway */}
                    <div
                      onClick={() => handleSelectNode("billing")}
                      className={`group p-3 rounded-xl border transition-all duration-200 shadow-md w-52 cursor-pointer ${
                        selectedNodeId === "billing"
                          ? "bg-surface-container-high border-primary ring-1 ring-primary/40 scale-105"
                          : "bg-surface-container border-outline-variant/50 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-semibold">Billing Gateway</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Go</span>
                      </div>
                      <div className="font-mono text-code-sm text-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">sync_alt</span>
                        HTTP POST /verify
                      </div>
                    </div>

                    {/* User Profile Svc */}
                    <div
                      onClick={() => handleSelectNode("user")}
                      className={`p-3 rounded-xl border transition-all duration-200 shadow-md w-52 cursor-pointer ${
                        selectedNodeId === "user"
                          ? "bg-surface-container-high border-primary ring-1 ring-primary/40 scale-105"
                          : "bg-surface-container border-outline-variant/40 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-semibold">User Profile Svc</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Node</span>
                      </div>
                      <div className="font-mono text-code-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">arrow_right_alt</span>
                        gRPC session.v2
                      </div>
                    </div>
                  </div>

                  {/* Central Target Entity */}
                  <div
                    onClick={() => handleSelectNode("auth")}
                    className={`z-20 p-5 rounded-2xl bg-surface-container-high border-2 text-center w-64 transform transition-all duration-200 cursor-pointer ${
                      selectedNodeId === "auth"
                        ? "border-primary node-glow scale-105"
                        : "border-primary/50 hover:border-primary"
                    }`}
                  >
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-label-xs uppercase mb-2">
                      <span className="material-symbols-outlined text-[13px]">security</span>
                      Target Entity
                    </div>
                    <h3 className="font-geist text-headline-md text-on-surface font-bold tracking-tight">
                      {selectedNodeId === "auth" ? "Auth API" : currentNode.name}
                    </h3>
                    <p className="font-mono text-code-sm text-on-surface-variant mt-0.5">{currentNode.service}</p>
                    <div className="mt-3 pt-3 border-t border-outline-variant/40 flex items-center justify-around font-mono text-label-xs text-tertiary">
                      <span>{currentNode.ingress} INGRESS</span>
                      <span>•</span>
                      <span>{currentNode.egress} EGRESS</span>
                    </div>
                  </div>

                  {/* Right nodes */}
                  <div className="flex flex-col gap-4 z-20">
                    {/* Notification Engine */}
                    <div
                      onClick={() => handleSelectNode("notification")}
                      className={`p-3 rounded-xl border transition-all duration-200 shadow-md w-56 cursor-pointer ${
                        selectedNodeId === "notification"
                          ? "bg-surface-container-high border-primary ring-1 ring-primary/40 scale-105"
                          : "bg-surface-container border-outline-variant/40 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-semibold">Notification Engine</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Rust</span>
                      </div>
                      <span className="font-mono text-code-sm text-on-surface-variant">PubSub consumer</span>
                    </div>

                    {/* Legacy Mobile GW */}
                    <div
                      onClick={() => handleSelectNode("legacy")}
                      className={`p-3 rounded-xl border shadow-md w-56 cursor-pointer relative overflow-hidden transition-all duration-200 ${
                        selectedNodeId === "legacy"
                          ? "bg-error-container/30 border-error ring-1 ring-error scale-105 shadow-[0_0_20px_rgba(255,180,171,0.4)]"
                          : "bg-error-container/20 border-error/50 shadow-[0_0_15px_rgba(255,180,171,0.2)]"
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-error text-on-error font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold">
                        Deprecation Risk
                      </div>
                      <div className="flex items-center gap-1.5 mb-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                        <span className="font-geist text-title-md text-on-surface font-semibold">Legacy Mobile GW</span>
                      </div>
                      <p className="font-inter text-body-sm text-error font-medium">Direct Token Deprecation Risk</p>
                      <span className="font-mono text-code-sm text-on-surface-variant block mt-1">Bearer hardcoded / v1</span>
                    </div>

                    {/* Orders DB Proxy */}
                    <div
                      onClick={() => handleSelectNode("orders")}
                      className={`p-3 rounded-xl border transition-all duration-200 shadow-md w-56 cursor-pointer ${
                        selectedNodeId === "orders"
                          ? "bg-surface-container-high border-primary ring-1 ring-primary/40 scale-105"
                          : "bg-surface-container border-outline-variant/40 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-tertiary" />
                          <span className="font-geist text-title-md text-on-surface font-semibold">Orders DB Proxy</span>
                        </div>
                        <span className="font-mono text-label-xs text-on-surface-variant bg-surface-container-high px-1 rounded">Go</span>
                      </div>
                      <span className="font-mono text-code-sm text-on-surface-variant">Read replica shard #3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas bottom bar */}
              <div className="relative z-10 pt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between font-mono text-code-sm text-on-surface-variant gap-2">
                <span>
                  Selected node: <strong className="text-primary font-semibold">{currentNode.name}</strong> ({traversalTime} traversal)
                </span>
                <span className="text-tertiary-fixed-dim">
                  Click any node to inspect live AST citation &amp; blast radius
                </span>
              </div>
            </div>

            {/* Inspector panel */}
            <div className="lg:col-span-4 bg-surface-container-low border-t lg:border-t-0 lg:border-l border-outline-variant/30 p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
                  <h4 className="font-geist text-title-md text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
                    Verified Citations: {currentNode.name}
                  </h4>
                  <span className="font-mono text-label-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    2 SOURCES
                  </span>
                </div>

                {/* Citation file card */}
                <div className="mb-4 bg-surface-container rounded-xl p-3 border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-code-sm text-primary flex items-center gap-1 truncate max-w-[200px]">
                      <span className="material-symbols-outlined text-[14px]">article</span>
                      {currentNode.citationFile}
                    </span>
                    <span className="font-mono text-label-xs text-on-surface-variant">
                      {currentNode.citationSource}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-surface-container-lowest font-mono text-code-sm text-on-surface-variant leading-relaxed overflow-x-auto border border-outline-variant/20">
                    {currentNode.citationCode.map((c) => (
                      <div
                        key={c.lineNum}
                        className={`flex gap-2 ${c.highlight ? "text-primary font-semibold bg-primary/10 -mx-2 px-2 rounded" : ""}`}
                      >
                        <span className="text-outline w-6 text-right select-none">{c.lineNum}</span>
                        <span className="whitespace-pre truncate">{c.code}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Synthesis Summary */}
                <div className="p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 mb-4">
                  <div className="flex items-center gap-1.5 text-tertiary font-geist text-body-sm font-semibold mb-1">
                    <span className="material-symbols-outlined text-[16px]">summarize</span>
                    Synthesis Summary
                  </div>
                  <p className="font-inter text-body-sm text-on-surface-variant leading-normal">
                    {currentNode.synthesis}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-outline-variant/20 flex items-center justify-between font-mono text-label-xs text-on-surface-variant">
                <span>Grounding certainty: <strong className="text-on-surface">99.8%</strong></span>
                <a
                  href="#features"
                  className="text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  Explore topology <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
