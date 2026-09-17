"use client";
import { useState } from "react";

export default function DemoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-dim/80 backdrop-blur-md px-margin">
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-space-lg max-w-3xl w-full shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
            <h3 className="font-geist text-headline-sm text-on-surface font-medium">
              GraphLens Architecture Walkthrough (2:04)
            </h3>
          </div>
          <button
            className="text-on-surface-variant hover:text-on-surface"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Video placeholder */}
        <div className="w-full aspect-video bg-surface-container-lowest rounded-lg border border-outline-variant/30 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mb-4 animate-pulse">
            <span className="material-symbols-outlined text-[32px]">play_arrow</span>
          </div>
          <p className="font-geist text-title-md text-on-surface font-semibold mb-1">
            Interactive Architecture Demo
          </p>
          <p className="font-inter text-body-sm text-on-surface-variant max-w-md">
            Demonstrating natural language dependency analysis on a 350-microservice topology in under 2 minutes.
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="px-space-md py-1.5 rounded-lg bg-surface-container-high text-on-surface font-geist text-title-md"
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
