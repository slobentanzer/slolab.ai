"use client";

import { useEffect, useRef, useState } from "react";
import HexAnimation from "./hex-animation";
import NeonBackground from "./neon-background";

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 350; // Adjust this value to control how far above the element to stop
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      const startPosition = window.scrollY;
      const distance = elementPosition - startPosition;
      const duration = 500;
      let start: number;

      function animation(currentTime: number) {
        if (!start) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function for smoother animation
        const ease = (t: number) => t < 0.5
          ? 4 * t * t * t
          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        window.scrollTo(0, startPosition + (distance * ease(progress)));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  };

  return (
    <section className="relative min-h-screen scroll-smooth">
      {/* Centered introduction text */}
      <div className="absolute top-0 left-0 right-0 text-center px-4 pt-16">
        <p className="text-xl text-indigo-200/65 max-w-3xl mx-auto">
          Welcome to the lab website of Sebastian Lobentanzer's group at Helmholtz Munich. We develop open-source software solutions for biomedical research. Discover our focus areas by scrolling down. 👇
        </p>
      </div>

      <NeonBackground />
      {/* Left scrollable content */}
      <div className="w-1/2 pl-36 pr-8">
        <div ref={sectionsRef} className="space-y-[40vh] pt-[25vh] pb-[50vh]">
          {/* Search Section */}
          <div className="min-h-[40vh] flex items-center">
            <div className="max-w-xl">
              <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-4 font-nacelle text-4xl font-semibold text-transparent">
                Knowledge Extraction
              </h2>
              <p className="text-xl text-indigo-200/65 mb-6">
                We aim at improving the cycle of scientific knowledge management, starting from the extraction of information from text and images. We'll add this to our existing solutions for{' '}
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
        </div>
      </div>

      {/* Right hex animation container */}
      <div className="absolute top-0 right-0 w-1/2 h-[calc(100%-23vh)]">
        <div className="sticky top-0 h-screen flex items-center justify-center pr-0 pt-16">
          <div className="w-[600px] h-[600px]">
            <HexAnimation progress={scrollProgress} />
          </div>
        </div>
      </div>
    </section >
  );
}
