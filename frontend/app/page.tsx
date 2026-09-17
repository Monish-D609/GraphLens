"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <Header />
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full text-on-surface overflow-x-hidden">
          <Hero onDemoOpen={() => setDemoOpen(true)} />
          <Problem />
          <HowItWorks />
          <Features />
          <SocialProof />
          <Pricing />
          <FAQ />
          <FinalCTA />
        </div>
      </main>
      <Footer />
      {demoOpen && <DemoModal onClose={() => setDemoOpen(false)} />}
    </>
  );
}
