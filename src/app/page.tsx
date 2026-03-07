"use client";

import { useState, useCallback } from "react";
import { Preloader } from "@/components/Preloader";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { TechArsenal } from "@/components/TechArsenal";
import { Academics } from "@/components/Academics";
import { Contact } from "@/components/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      {!loading && (
        <>
          <Navbar />
          <main>
            <Hero />
            <Projects />
            <TechArsenal />
            <Academics />
            <Contact />
          </main>
        </>
      )}
    </>
  );
}
