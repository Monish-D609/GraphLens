"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How is this different from basic search?",
    a: "Traditional search finds keywords, but GraphLens understands relationships, like which service calls another.",
  },
  {
    q: "Does this require us to rewrite our docs?",
    a: "No, it works with your existing documentation and code comments as they are today.",
  },
  {
    q: "Where is our data stored?",
    a: "We offer flexible deployment options, including private cloud, to ensure your proprietary architecture remains secure.",
  },
  {
    q: "How long does indexing take?",
    a: "Most teams have a functional knowledge graph within an hour of connecting their primary documentation sources.",
  },
  {
    q: "Can it handle microservices?",
    a: "Yes, it is specifically designed to bridge the gaps between fragmented service documentation in microservice environments.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="w-full px-margin py-24 bg-surface border-t border-outline-variant/20" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-mono text-label-xs uppercase tracking-widest text-primary font-semibold">
            FAQ
          </span>
          <h2 className="font-geist text-headline-lg text-on-surface tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden"
            >
              <button
                className="w-full px-space-lg py-4 flex items-center justify-between text-left focus:outline-none"
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
                <div className="px-space-lg pb-4 pt-1 text-on-surface-variant font-inter text-body-md border-t border-outline-variant/10">
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
