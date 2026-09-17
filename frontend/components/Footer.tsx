import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Security", href: "#" },
  { label: "Status", href: "#" },
  { label: "GitHub", href: "https://github.com/Monish-D609/GraphLens" },
  { label: "Documentation", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-space-xl mt-space-xl">
      <div className="w-full px-margin">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg pb-space-lg border-b border-outline-variant/20">
          {/* Brand */}
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm">
              <div className="w-6 h-6 rounded bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[14px]">hub</span>
              </div>
              <span className="font-geist text-headline-sm text-on-surface tracking-tight">GraphLens</span>
            </div>
            <p className="font-inter text-body-sm text-on-surface-variant">
              Connected knowledge graph for engineering teams.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-space-lg">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-inter text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-space-md flex items-center justify-between">
          <p className="font-mono text-code-sm text-on-surface-variant">
            © 2025 GraphLens, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="font-mono text-code-sm text-on-surface-variant">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
