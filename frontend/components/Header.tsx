"use client";
import { useState } from "react";
import Link from "next/link";
import DocsModal from "./DocsModal";

const navLinks = [
  { label: "Interactive Console", href: "#demo-console" },
  { label: "Problem", href: "#problem" },
  { label: "Pipeline", href: "#how-it-works" },
  { label: "Capabilities", href: "#features" },
  { label: "Technical FAQ", href: "#faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 transition-all">
        <div className="h-16 w-full px-margin flex items-center justify-between">
          {/* Logo & Project Tag */}
          <div className="flex items-center gap-space-lg">
            <Link href="/" className="flex items-center gap-space-sm group">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </div>
              <span className="font-geist text-headline-sm font-semibold tracking-tight text-on-surface flex items-center gap-1.5">
                GraphLens
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/40 text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              Architecture Intelligence
            </span>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-space-md ml-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-inter text-body-md text-on-surface-variant hover:text-on-surface transition-colors px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setDocsModalOpen(true)}
                className="font-inter text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-1 px-2 py-1"
              >
                <span>Docs</span>
                <span className="font-mono text-label-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                  OpenAPI
                </span>
              </button>
            </nav>
          </div>

          {/* Actions: GitHub & Console Jump */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDocsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 font-mono text-code-sm text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:border-outline-variant/70 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">menu_book</span>
              API Spec
            </button>

            <a
              href="https://github.com/Monish-D609/GraphLens"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/50 font-inter text-body-sm text-on-surface font-medium transition-all shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="#demo-console"
              className="inline-flex items-center justify-center px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary-container font-geist text-title-md font-semibold hover:bg-primary transition-all shadow-[0_0_16px_rgba(6,182,212,0.35)]"
            >
              Run Query
            </a>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden ml-1 text-on-surface-variant hover:text-on-surface p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden bg-surface-container-low border-t border-outline-variant/30 px-margin py-4 flex flex-col gap-3 animate-slide-up">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-inter text-body-lg text-on-surface-variant hover:text-on-surface transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setDocsModalOpen(true);
                setMobileOpen(false);
              }}
              className="text-left font-inter text-body-lg text-primary hover:text-primary-fixed transition-colors py-1 flex items-center justify-between"
            >
              <span>OpenAPI &amp; Architecture Docs</span>
              <span className="font-mono text-label-xs bg-primary/20 px-2 py-0.5 rounded">v1.0</span>
            </button>
            <a
              href="https://github.com/Monish-D609/GraphLens"
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-body-lg text-on-surface hover:text-primary transition-colors py-1 flex items-center gap-2"
            >
              <span>GitHub Repository</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </nav>
        )}
      </header>

      {docsModalOpen && (
        <DocsModal onClose={() => setDocsModalOpen(false)} />
      )}
    </>
  );
}
