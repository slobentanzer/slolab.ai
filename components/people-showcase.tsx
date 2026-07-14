'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { TeamMember } from '@/lib/team-members/schema'
import NeonBackground from '@/components/neon-background'

export default function PeopleShowcase({ members }: { members: TeamMember[] }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const totalMembers = members.length
  const trailingViewports = 1
  const scrollViewports = totalMembers + trailingViewports
  const scrollStops = [
    ...Array.from({ length: totalMembers }, (_, i) => i / scrollViewports),
    1,
  ]
  const indexStops = [
    ...Array.from({ length: totalMembers }, (_, i) => i),
    totalMembers - 1,
  ]
  const currentPersonIndex = useTransform(
    scrollYProgress,
    scrollStops,
    indexStops
  )

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ position: 'relative', height: `${scrollViewports * 100}vh` }}
    >
      <NeonBackground />
      {/* Sticky positioning lets the final profile scroll away naturally instead of fading. */}
      <div className="sticky top-[120px] z-10 pointer-events-none">
        <div className="h-[calc(100vh-120px)] flex items-center justify-center px-8 sm:px-12 md:px-20">
          <motion.div className="max-w-5xl w-full">
            <motion.div
              key="showcase"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* Dynamic content based on scroll */}
              {members.map((member, index) => (
                <PersonDisplay
                  key={member.index}
                  member={member}
                  index={index}
                  currentIndex={currentPersonIndex}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function PersonDisplay({
  member,
  index,
  currentIndex,
}: {
  member: TeamMember
  index: number
  currentIndex: MotionValue<number>
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
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-4 sm:px-8 md:px-12">
      {/* Image — stays in place, flips in/out via rotateY */}
      <motion.div
        className="relative aspect-[4/3] w-full max-w-[22rem] mx-auto md:justify-self-center"
        style={{ perspective: 800 }}
      >
        <motion.div
          className="relative w-full h-full rounded-xl overflow-hidden border-2 border-indigo-500/40"
          style={{ rotateY }}
        >
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src={member.image}
              alt=""
              fill
              sizes="(min-width: 768px) 35vw, 90vw"
              unoptimized
              aria-hidden="true"
              className="object-cover scale-110 blur-2xl opacity-60"
            />
            <div className="absolute inset-0 z-[1] bg-gradient-to-br from-gray-950/10 via-indigo-950/20 to-gray-950/70" />
            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(min-width: 768px) 35vw, 90vw"
              unoptimized
              className="z-[2] object-contain"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Text — self-stretch fills the full grid-row height so overflow-hidden clips at the
           viewport edge rather than at the tight text-content box */}
      <div className="overflow-hidden self-stretch flex items-center lg:pr-24">
        <motion.div
          style={{ y: textY }}
          className="space-y-3"
        >
          <div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200))] bg-clip-text pb-2 font-nacelle text-3xl font-semibold text-transparent">
              {member.name}
            </h2>
            <p className="text-lg text-indigo-400 font-medium">{member.role}</p>
          </div>

          <p className="text-base text-indigo-100/80 leading-relaxed">
            {member.focus}
          </p>

          {member.expertise && member.expertise.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/70">
                Expertise
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="Areas of expertise">
                {member.expertise.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {member.currentWork && member.currentWork.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300/70">
                Current work
              </p>
              <ul className="space-y-1.5 text-sm leading-relaxed text-indigo-200/70">
                {member.currentWork.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-indigo-400" aria-hidden="true">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {member.links && member.links.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
              {member.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
