import Link from "next/link";

const footerLinks = [
  { label: "GitHub", href: "https://github.com/Monish-D609/GraphLens", target: "_blank" },
  { label: "Interactive Console", href: "#demo-console" },
  { label: "Architecture", href: "#problem" },
  { label: "Pipeline", href: "#how-it-works" },
  { label: "Capabilities", href: "#features" },
  { label: "Technical FAQ", href: "#faq" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-space-xl mt-space-xl">
      <div className="w-full px-margin">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg pb-space-lg border-b border-outline-variant/20">
          {/* Brand & Project Info */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[14px]">hub</span>
              </div>
              <span className="font-geist text-headline-sm text-on-surface tracking-tight font-semibold">GraphLens</span>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container-high text-tertiary border border-outline-variant/30">
                Open Source
              </span>
            </div>
            <p className="font-inter text-body-sm text-on-surface-variant max-w-md">
              Graph-Augmented Retrieval (Graph RAG) over Technical Documentation.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-space-md">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.target}
                rel={link.target ? "noopener noreferrer" : undefined}
                className="font-inter text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-code-sm text-on-surface-variant">
            GraphLens — Built for Engineering Evaluation &amp; Demonstration
          </p>
          <div className="flex items-center gap-space-xs font-mono text-code-sm text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>FastAPI &amp; NetworkX Engine Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
