"use client";

import { useEffect, useRef, useState } from "react";
import HexAnimation from "./hex-animation";

export default function HeroHome() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionsRef.current) return;

      const container = sectionsRef.current;
      const totalScrollHeight = container.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      // Adjust section distribution - make last section transition happen later
      // First 3 sections take up 85% of the scroll (0.283 each)
      // Last section takes up 15% of the scroll
      const sectionHeight = totalScrollHeight * 0.283; // for first 3 sections
      const lastSectionStart = totalScrollHeight * 0.85; // start of last section
      const transitionRange = sectionHeight * 0.6;

      let progress;
      if (currentScroll < lastSectionStart) {
        // Handle first 3 sections
        const currentSection = Math.floor(currentScroll / sectionHeight);
        const sectionStart = currentSection * sectionHeight;
        const localProgress = currentScroll - sectionStart;

        if (localProgress < sectionHeight - transitionRange) {
          // Stable at beginning of section
          progress = currentSection * 0.25;
        } else {
          // Transition to next section
          const transitionProgress = (localProgress - (sectionHeight - transitionRange)) / transitionRange;
          progress = (currentSection * 0.25) + (transitionProgress * 0.25);
        }
      } else {
        // Handle last section
        const lastSectionProgress = (currentScroll - lastSectionStart) / (totalScrollHeight - lastSectionStart);
        progress = 0.75 + (lastSectionProgress * 0.25);
      }

      // Ensure progress stays between 0 and 1
      progress = Math.min(1, Math.max(0, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen">
      {/* Left scrollable content */}
      <div className="w-1/2 pl-36 pr-8">
        <div ref={sectionsRef} className="space-y-[40vh] pt-[25vh] pb-[50vh]">
          {/* Search Section */}
          <div className="min-h-[40vh] flex items-center">
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
          <div className="min-h-[50vh] flex items-center">
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
          <div className="min-h-[50vh] flex items-center">
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
          <div className="min-h-[50vh] flex items-center">
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

      {/* Right hex animation container */}
      <div className="absolute top-0 right-0 w-1/2 h-[calc(100%-23vh)]">
        <div className="sticky top-0 h-screen flex items-center justify-center pr-0 pt-32">
          <div className="w-[600px] h-[600px]">
            <HexAnimation progress={scrollProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
