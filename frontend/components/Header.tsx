"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { label: "Product", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Architecture", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="h-16 w-full px-margin flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-space-xl">
          <Link href="#" className="flex items-center gap-space-sm group">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
            <span className="font-geist text-headline-sm font-semibold tracking-tight text-on-surface flex items-center gap-1.5">
              GraphLens
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-space-lg">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-inter text-body-md transition-colors ${
                  i === 0
                    ? "text-primary font-medium"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-space-md">
          <Link
            href="#"
            className="hidden sm:block font-inter text-body-md text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center px-space-md py-1.5 rounded-lg bg-primary-container text-on-primary-container font-geist text-title-md font-medium hover:bg-primary transition-all shadow-[0_0_16px_rgba(6,182,212,0.35)]"
          >
            Start Free Trial
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-2 text-on-surface-variant hover:text-on-surface"
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
        <nav className="lg:hidden bg-surface-container-low border-t border-outline-variant/30 px-margin py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-inter text-body-lg text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
