"use client";

import { useState } from "react";
import { BrandStatement } from "./brand-statement";
import { Cta } from "./cta";
import { Dashboard } from "./dashboard";
import { DemoDialog } from "./demo-dialog";
import { Emotional } from "./emotional";
import { Features } from "./features";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";
import { Journey } from "./journey";
import { Nav } from "./nav";
import { Trust } from "./trust";

export function Landing() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-ivory">
      <Nav onDemo={() => setDemoOpen(true)} />
      <Hero onDemo={() => setDemoOpen(true)} />
      <BrandStatement />
      <Journey />
      <Features />
      <Trust />
      <HowItWorks />
      <Dashboard />
      <Emotional />
      <Cta onDemo={() => setDemoOpen(true)} />
      <Footer />
      <DemoDialog open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
