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
  // Calculate opacity: show when it's current index, hide otherwise
  const opacity = useTransform(
    currentIndex,
    [index - 0.5, index, index + 0.5],
    [0, 1, 0]
  )

  // Calculate rotation for flip effect during scroll - reduced from 180 to 45 degrees
  const rotateY = useTransform(
    currentIndex,
    [index - 1, index - 0.5, index, index + 0.5, index + 1],
    [45, 45, 0, 45, 45]
  )

  // Calculate text opacity for fade in/out
  const textOpacity = useTransform(
    currentIndex,
    [index - 0.5, index, index + 0.5],
    [0, 1, 0]
  )

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-8 sm:px-16 md:px-24"
    >
      {/* Image Section - Circle Icon */}
      <motion.div
        className="relative h-52 w-52 mx-auto md:mx-0 md:justify-self-center"
        style={{ perspective: 800 }}
      >
        <motion.div
          className="relative w-full h-full rounded-full overflow-hidden border-2 border-indigo-500/40"
          style={{ rotateY }}
        >
          {/* Front side - Image (plain) */}
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

      {/* Text Section */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="space-y-4"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-nacelle bg-gradient-to-r from-gray-100 to-indigo-200 bg-clip-text text-transparent mb-1">
            {member.name}
          </h2>
          <p className="text-lg text-indigo-400 font-medium">{member.role}</p>
        </div>

        <p className="text-base text-indigo-200/75 leading-relaxed">
          {member.bio}
        </p>
      </motion.div>
    </motion.div>
  )
}
