'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { teamMembers } from '@/data/team-members'
import NeonBackground from '@/components/neon-background'

export default function PeopleShowcase() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // 'end start': progress hits 1.0 when the section bottom reaches the viewport top.
    // With a 500vh spacer, at progress 0.8 (last person) the footer aligns exactly with the viewport bottom.
    offset: ['start start', 'end start']
  })

  const totalMembers = teamMembers.length
  const scrollStops = Array.from({ length: totalMembers + 1 }, (_, i) => i / totalMembers)
  const indexStops = Array.from({ length: totalMembers + 1 }, (_, i) => Math.min(i, totalMembers - 1))

  const currentPersonIndex = useTransform(
    scrollYProgress,
    scrollStops,
    indexStops
  )

  return (
    <section ref={containerRef} className="relative">
      <NeonBackground />
      {/* Scroll spacer to enable scroll tracking */}
      <div className="h-[500vh]" />

      {/* Fixed showcase container */}
      <motion.div
        className="fixed left-0 right-0 bottom-0 z-10 pointer-events-none"
        style={{
          top: '120px',
          opacity: useTransform(scrollYProgress, [0.85, 1], [1, 0])
        }}
      >
        <div className="h-[calc(100vh-120px)] flex items-center justify-center px-8 sm:px-12 md:px-20">
          <motion.div className="max-w-4xl w-full pointer-events-auto">
            <motion.div
              key="showcase"
              className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
            >
              {/* Dynamic content based on scroll */}
              {teamMembers.map((member, index) => (
                <PersonDisplay
                  key={member.id}
                  member={member}
                  index={index}
                  currentIndex={currentPersonIndex}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

function PersonDisplay({
  member,
  index,
  currentIndex,
}: {
  member: typeof teamMembers[0]
  index: number
  currentIndex: any
}) {
  // Image flips in from edge-on (90°) to flat (0°) and out to edge-on (-90°) — always opaque
  const rotateY = useTransform(
    currentIndex,
    [index - 1, index - 0.5, index, index + 0.5, index + 1],
    [90, 90, 0, -90, -90]
  )

  const textY = useTransform(
    currentIndex,
    [index - 1, index, index + 1],
    [800, 0, -800]
  )

  return (
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-8 sm:px-16 md:px-24">
      {/* Image — stays in place, flips in/out via rotateY */}
      <motion.div
        className="relative h-64 w-64 mx-auto md:mx-0 md:justify-self-center"
        style={{ perspective: 800 }}
      >
        <motion.div
          className="relative w-full h-full rounded-xl overflow-hidden border-2 border-indigo-500/40"
          style={{ rotateY }}
        >
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src={member.image}
              alt={member.name}
              width={312}
              height={312}
              quality={100}
              unoptimized={true}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Text — self-stretch fills the full grid-row height so overflow-hidden clips at the
           viewport edge rather than at the tight text-content box */}
      <div className="overflow-hidden self-stretch flex items-center">
        <motion.div
          style={{ y: textY }}
          className="space-y-4"
        >
          <div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-2 font-nacelle text-4xl font-semibold text-transparent">
              {member.name}
            </h2>
            <p className="text-xl text-indigo-400 font-medium">{member.role}</p>
          </div>

          <p className="text-xl text-indigo-200/65 leading-relaxed">
            {member.bio}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
