"use client";

import { useEffect, useRef, useState } from "react";
import HexAnimation from "./hex-animation";
import NeonBackground from "./neon-background";
import AccessibilityDisplay from "./accessibility-display";

export default function HeroHome() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [introHeight, setIntroHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionsRef.current) return;

      const container = sectionsRef.current;
      const totalScrollHeight = container.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      // Define where each logo should be fully visible (in scroll percentage)
      const logoRegions = [
        { start: 0, end: 15 },    // Extraction logo
        { start: 25, end: 30 },   // Representation logo
        { start: 48, end: 55 },   // Chat logo
        { start: 69, end: 75 },   // AI logo
        { start: 90, end: 100 }   // People logo
      ];

      // Convert current scroll to 0-100 scale
      const scrollPercentage = (currentScroll / totalScrollHeight) * 100;

      // Find which region or transition we're in
      let progress = 0;
      for (let i = 0; i < logoRegions.length; i++) {
        const currentRegion = logoRegions[i];
        const nextRegion = logoRegions[i + 1];

        if (scrollPercentage <= currentRegion.end) {
          // In this region - show this logo
          progress = i * 0.2;
          break;
        } else if (!nextRegion || scrollPercentage < nextRegion.start) {
          // In transition to next region
          const transitionLength = (nextRegion ? nextRegion.start : 100) - currentRegion.end;
          const transitionProgress = (scrollPercentage - currentRegion.end) / transitionLength;
          progress = (i + transitionProgress) * 0.2;
          break;
        }
      }

      // Ensure progress stays between 0 and 1
      progress = Math.min(1, Math.max(0, progress));
      setScrollProgress(progress);
    };

    const updateIntroHeight = () => {
      if (introRef.current) {
        setIntroHeight(introRef.current.offsetHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateIntroHeight);

    // Initial calculation
    updateIntroHeight();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateIntroHeight);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 250; // Adjust this value to control how far above the element to stop
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      const startPosition = window.scrollY;
      const distance = elementPosition - startPosition;
      const duration = 1200;
      let start: number;

      const animation = (currentTime: number) => {
        if (!start) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Simple sine-based easing function - slower in middle, no oscillation
        const ease = (t: number) => {
          return 0.5 - Math.cos(Math.PI * t) / 2;
        };

        window.scrollTo(0, startPosition + (distance * ease(progress)));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <section className="relative min-h-screen scroll-smooth">
      {/* Centered introduction text */}
      <div ref={introRef} className="absolute top-0 left-0 right-0 text-center px-4 pt-16 xs:pt-8 min-h-[40vh] flex flex-col justify-start">
        <p className="text-xl xs:text-base text-indigo-200/65 max-w-3xl mx-auto mb-0 xs:mb-8">
          Welcome to the lab website of Sebastian Lobentanzer's group at Helmholtz Munich. We develop open-source software solutions for Accessible Biomedical AI Research, aiming to increase accessibility of:
        </p>
        <div className="mt-2 mb-4">
          <AccessibilityDisplay
            pairs={[
              { modality: "Scientific Data", audience: "Researchers." },
              { modality: "Scientific Data", audience: "Clinicians." },
              { modality: "Scientific Data", audience: "Students." },
              { modality: "Medical Knowledge", audience: "Clinicians." },
              { modality: "Medical Knowledge", audience: "Researchers." },
              { modality: "Medical Knowledge", audience: "Biologists." },
              { modality: "Medical Knowledge", audience: "Computer Scientists." },
              { modality: "Medical Knowledge", audience: "Drug Developers." },
              { modality: "Medical Knowledge", audience: "Students." },
              { modality: "Medical Knowledge", audience: "Caregivers." },
              { modality: "Biology", audience: "Computer Scientists." },
              { modality: "Biology", audience: "Drug Developers." },
              { modality: "Biology", audience: "Students." },
              { modality: "Complexity", audience: "Reseachers." },
              { modality: "Complexity", audience: "Biologists." },
              { modality: "Complexity", audience: "Students." },
              { modality: "Toxicology", audience: "Drug Developers." },
              { modality: "Toxicology", audience: "Students." },
              { modality: "Toxicology", audience: "Clinicians." },
              { modality: "Best Practice", audience: "Students." },
              { modality: "Best Practice", audience: "Clinicians." },
              { modality: "Best Practice", audience: "Developers." },
              { modality: "Best Practice", audience: "Researchers." },
              { modality: "AI Systems Architecture", audience: "Researchers." },
              { modality: "AI Systems Architecture", audience: "Biologists." },
              { modality: "AI Systems Architecture", audience: "Students." },
              { modality: "Manuscripts", audience: "Students." },
              { modality: "Manuscripts", audience: "Researchers." },
              { modality: "Manuscripts", audience: "Editors." },
              { modality: "Research Insights", audience: "Lay People." },
              { modality: "Research Insights", audience: "Developers." },
              { modality: "Research Insights", audience: "Clinicians." },
              { modality: "Research Insights", audience: "Students." },
              { modality: "Research Insights", audience: "Caregivers." },
              { modality: "Therapeutic Insights", audience: "Lay People." },
              { modality: "Therapeutic Insights", audience: "Clinicians." },
              { modality: "Therapeutic Insights", audience: "Students." },
              { modality: "Therapeutic Insights", audience: "Researchers." },
              { modality: "Therapeutic Insights", audience: "Caregivers." }
            ]}
          />
        </div>
        <p className="text-xl xs:text-base text-indigo-200/65 max-w-3xl mx-auto mb-0 xs:mb-16">Discover our focus areas by scrolling down. 👇</p>
      </div>

      <NeonBackground />
      {/* Right hex animation container - now positioned behind text on mobile */}
      <div
        className="absolute left-3/4 -translate-x-1/2 lg:translate-x-0 lg:right-0 lg:left-auto w-[600px] lg:w-1/2 h-[calc(100%-42vh)] -z-10 lg:z-0 min-h-[50vh]"
        style={{ top: `calc(${introHeight}px - 23vh)` }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="w-[600px] h-[600px]">
            <HexAnimation progress={scrollProgress} />
          </div>
        </div>
      </div>

      {/* Left scrollable content */}
      <div className="w-full lg:w-1/2 pl-4 sm:pl-8 lg:pl-36 pr-4 sm:pr-8">
        <div
          ref={sectionsRef}
          className="space-y-[40vh] pb-[55vh]"
          style={{ paddingTop: `${introHeight + 40}px` }}
        >
          {/* Search Section */}
          <div className="min-h-[40vh] flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Knowledge Extraction
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                We aim at improving the cycle of scientific knowledge management, starting from the extraction of information from text and images. This new framework will join our existing solutions for{' '}
                <a
                  href="#knowledge-representation"
                  onClick={(e) => handleClick(e, 'knowledge-representation')}
                  className="text-indigo-500 hover:text-indigo-400"
                >
                  knowledge representation
                </a>{' '}
                and{' '}
                <a
                  href="#conversational-ai"
                  onClick={(e) => handleClick(e, 'conversational-ai')}
                  className="text-indigo-500 hover:text-indigo-400"
                >
                  conversational AI
                </a>.
              </p>
              <a href="/search" className="text-indigo-500 hover:text-indigo-400">
                Python framework coming soon →
              </a>
            </div>
          </div>

          {/* Graph Section */}
          <div id="knowledge-representation" className="min-h-[50vh] flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Knowledge Representation
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                We have created a knowledge graph framework that allows flexible customisation and rapid prototyping via an open-source Python package, BioCypher. Interacts natively with our conversational AI solution,{' '}
                <a
                  href="#conversational-ai"
                  onClick={(e) => handleClick(e, 'conversational-ai')}
                  className="text-indigo-500 hover:text-indigo-400"
                >
                  BioChatter
                </a>.
              </p>
              <a href="https://www.nature.com/articles/s41587-023-01848-y" className="text-indigo-500 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                Read the paper →
              </a>
              <br />
              <a href="https://biocypher.org" className="text-indigo-500 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                Read the docs →
              </a>
              <br />
              <a href="https://biocypher.github.io/biocypher-paper/" className="text-indigo-500 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                Self-archived version of the paper →
              </a>
            </div>
          </div>

          {/* Chat Section */}
          <div id="conversational-ai" className="min-h-[50vh] flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Conversational AI
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                We modernise the way scientists interact with data and knowledge using the recent progress in generative AI in an open-source framework, BioChatter. Built to work seamlessly with our{' '}
                <a
                  href="#knowledge-representation"
                  onClick={(e) => handleClick(e, 'knowledge-representation')}
                  className="text-indigo-500 hover:text-indigo-400"
                >
                  knowledge representation
                </a>{' '}
                framework.
              </p>
              <a href="https://www.nature.com/articles/s41587-024-02534-3" className="text-indigo-500 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                Read the paper →
              </a>
              <br />
              <a href="https://biochatter.org" className="text-indigo-500 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                Read the docs →
              </a>
            </div>
          </div>

          {/* Deep Learning Section */}
          <div className="min-h-[50vh] flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Understanding Artificial Intelligence
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                We are examining current AI models and their biases with a focus on the life sciences and causality.
              </p>
              <a href="https://www.embopress.org/doi/full/10.1038/s44320-024-00041-w" className="text-indigo-500 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                Read more about our work →
              </a>
            </div>
          </div>

          {/* People Section */}
          <div id="people" className="min-h-[50vh] flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Join Us
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                We are always looking for talented and motivated individuals to join our team.
              </p>
              <a href="/people" className="text-indigo-500 hover:text-indigo-400">
                Join us →
              </a>
              <br />
              <a href="https://github.com/slolab" className="text-indigo-500 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                Read more about our work →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
