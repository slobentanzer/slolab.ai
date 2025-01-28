"use client";

import { useEffect, useRef, useState } from "react";
import HexAnimation from "./hex-animation";

export default function HeroHome() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionsRef.current) return;

      const sections = sectionsRef.current.children;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen">
      {/* Left scrollable content */}
      <div className="w-1/2 pl-16 pr-8">
        <div ref={sectionsRef} className="space-y-screen pb-screen">
          {/* Search Section */}
          <div className="min-h-screen flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Search & Discovery
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                Intelligent document search and analysis powered by advanced AI algorithms.
              </p>
              <a href="/search" className="text-indigo-500 hover:text-indigo-400">
                Learn more about our search capabilities →
              </a>
            </div>
          </div>

          {/* Graph Section */}
          <div className="min-h-screen flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Knowledge Graph
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                Connected information network that reveals hidden relationships and insights.
              </p>
              <a href="/graph" className="text-indigo-500 hover:text-indigo-400">
                Explore our knowledge graph →
              </a>
            </div>
          </div>

          {/* Chat Section */}
          <div className="min-h-screen flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Conversational AI
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                Natural language understanding and generation for human-like interactions.
              </p>
              <a href="/chat" className="text-indigo-500 hover:text-indigo-400">
                Start a conversation →
              </a>
            </div>
          </div>

          {/* Deep Learning Section */}
          <div className="min-h-screen flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Deep Learning
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                Advanced neural network architectures pushing the boundaries of AI.
              </p>
              <a href="/deep-learning" className="text-indigo-500 hover:text-indigo-400">
                Discover our deep learning models →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right fixed hex animation */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 w-1/2 h-screen flex items-center justify-center mt-32">
        <div className="w-[600px] h-[600px]">
          <HexAnimation currentShape={activeSection} />
        </div>
      </div>
    </section>
  );
}
