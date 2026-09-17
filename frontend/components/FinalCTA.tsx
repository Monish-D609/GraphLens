"use client";
import { useState } from "react";

export default function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="w-full px-margin py-20 bg-surface-container-lowest" id="cta">
      <div className="max-w-5xl mx-auto rounded-2xl bg-surface-container border border-outline-variant/40 p-space-xl lg:p-16 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-6">
            <span className="material-symbols-outlined text-[28px]">account_tree</span>
          </div>

          <h2 className="font-geist text-headline-lg lg:text-display-lg text-on-surface font-bold tracking-tight mb-4">
            Stop guessing, start knowing.
          </h2>
          <p className="font-inter text-body-lg text-on-surface-variant mb-8">
            Join hundreds of engineering teams shipping updates without breaking dependencies.
          </p>

          {submitted ? (
            <div className="w-full max-w-md p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary font-mono text-code-md text-center">
              ✓ Trial invitation dispatched to {email}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col sm:flex-row gap-2 mb-6"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                id="cta-email"
                className="flex-1 px-4 py-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60 font-mono text-code-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-space-xl py-3 rounded-lg bg-primary-container text-on-primary-container font-geist text-title-md font-medium hover:bg-primary transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] whitespace-nowrap"
              >
                Get started now
              </button>
            </form>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-code-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">credit_card_off</span>
              No credit card required
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
              SOC2 certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
              14-day free trial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
