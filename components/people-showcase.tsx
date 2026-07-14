'use client'

import { useEffect, useRef, type RefObject } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { TeamMember } from '@/lib/team-members/schema'
import NeonBackground from '@/components/neon-background'

export default function PeopleShowcase({ members }: { members: TeamMember[] }) {
  const containerRef = useRef(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const totalMembers = members.length
  const trailingViewports = 0.2
  const scrollViewports = totalMembers + trailingViewports
  const scrollStops = [
    ...Array.from({ length: totalMembers }, (_, i) => i / scrollViewports),
    1,
  ]
  const indexStops = [
    ...Array.from({ length: totalMembers }, (_, i) => i),
    totalMembers - 1,
  ]
  const imageIndexStops = [
    ...Array.from({ length: totalMembers }, (_, i) => i),
    totalMembers - 0.56,
  ]
  const exitStart = (scrollViewports - 1) / scrollViewports
  const exitEnd = 1
  const currentPersonIndex = useTransform(
    scrollYProgress,
    scrollStops,
    indexStops
  )
  const currentImageIndex = useTransform(
    scrollYProgress,
    scrollStops,
    imageIndexStops
  )
  const showcaseY = useTransform(
    scrollYProgress,
    [exitStart, exitEnd],
    ['0vh', '-100vh']
  )

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ position: 'relative', height: `${scrollViewports * 100}vh` }}
    >
      <NeonBackground />
      {/* Hold the last profile, then move it upward naturally before the footer enters. */}
      <motion.div
        className="fixed left-0 right-0 bottom-0 z-10 pointer-events-none"
        style={{ top: '120px', y: showcaseY }}
      >
        <ParticleShadow imageIndex={currentImageIndex} cardRef={cardRef} />
        <div className="relative z-10 h-[calc(100vh-120px)] flex items-center justify-center px-8 sm:px-12 md:px-20">
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
                  imageIndex={currentImageIndex}
                  cardRef={index === 0 ? cardRef : undefined}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

type ShadowParticle = {
  side: 0 | 1 | 2 | 3 | 4
  along: number
  offset: number
  u: number
  v: number
  radius: number
  alpha: number
  amplitude: number
  phaseX: number
  phaseY: number
  speedX: number
  speedY: number
  waveDelay: number
  rippleForce: number
  tangent: number
  scatterAngle: number
  scatterForce: number
  returnBias: number
  returnCurve: number
  color: string
}

function createParticleCloud(seed: number, count = 480): ShadowParticle[] {
  let state = Math.max(1, seed)
  const random = () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
  const colors = ['129, 140, 180', '139, 126, 164', '107, 126, 151']

  return Array.from({ length: count }, () => {
    // Left/right edges get more particles and a deeper frame: the card's
    // rotation foreshortens the vertical edges, so they need extra weight
    // to read as thick as top/bottom in the base position.
    let side: 0 | 1 | 2 | 3 | 4
    const roll = random()
    if (roll < 0.12) side = 4
    else if (roll < 0.28) side = 0
    else if (roll < 0.56) side = 1
    else if (roll < 0.72) side = 2
    else side = 3

    const isVerticalEdge = side === 1 || side === 3

    return {
      side,
      along: 0.02 + random() * 0.96,
      // Vertical edges span from under the card (negative offset) to outside,
      // so particles emerge when the rotation narrows the card.
      offset: isVerticalEdge ? random() * 26 - 10 : 0.5 + random() * 13.5,
      u: random(),
      v: random(),
      radius: 0.55 + random() * 0.8,
      alpha: 0.28 + random() * 0.32,
      amplitude: 0.8 + random() * 2.6,
      phaseX: random() * Math.PI * 2,
      phaseY: random() * Math.PI * 2,
      speedX: 0.35 + random() * 0.65,
      speedY: 0.35 + random() * 0.65,
      waveDelay: random() * 0.035,
      // Skewed distribution: most particles splash close to the card,
      // only a few fly far.
      rippleForce: 15 + Math.pow(random(), 5) * 100,
      tangent: (random() - 0.5) * 32,
      scatterAngle: random() * Math.PI * 2,
      scatterForce: 2 + Math.pow(random(), 2.2) * 88,
      returnBias: (random() - 0.5) * 0.08,
      returnCurve: (random() - 0.5) * 28,
      color: colors[Math.floor(random() * colors.length)],
    }
  })
}

function ParticleShadow({
  imageIndex,
  cardRef,
}: {
  imageIndex: MotionValue<number>
  cardRef: RefObject<HTMLDivElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const particles = createParticleCloud(7919)
    const forceMin = Math.min(...particles.map((p) => p.rippleForce))
    const forceMax = Math.max(...particles.map((p) => p.rippleForce))
    const forceRange = forceMax - forceMin || 1
    let width = 0
    let height = 0
    let latestProgress = imageIndex.get()
    let animationFrame: number | null = null
    let pageVisible = document.visibilityState === 'visible'
    let rippleStartedAt: number | null = null
    let rippleDirection = 1
    let smoothedVelocity = 0
    let lastProgressSample = imageIndex.get()
    let lastSampleTime: number | null = null

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (progress: number, time: number) => {
      context.clearRect(0, 0, width, height)

      const card = cardRef.current
      if (!card) return

      const canvasBounds = canvas.getBoundingClientRect()
      const cardBounds = card.getBoundingClientRect()
      const cardLeft = cardBounds.left - canvasBounds.left
      const cardTop = cardBounds.top - canvasBounds.top
      const cardRight = cardBounds.right - canvasBounds.left
      const cardBottom = cardBounds.bottom - canvasBounds.top
      const cardWidth = cardRight - cardLeft
      const cardHeight = cardBottom - cardTop
      const sectionProgress = progress - Math.floor(progress)
      const tilt = sectionProgress <= 0.47
        ? 0.5 + (sectionProgress / 0.47) * 0.5
        : sectionProgress >= 0.53
          ? ((sectionProgress - 0.53) / 0.47) * 0.5
          : 0.5
      const shadowX = -1 + tilt * 4
      const shadowY = 2
      const rippleDuration = 1500
      const rippleProgress = rippleStartedAt === null
        ? 1
        : Math.min(1, (time - rippleStartedAt) / rippleDuration)
      if (rippleProgress >= 1) rippleStartedAt = null
      const centerX = cardLeft + cardWidth / 2
      const centerY = cardTop + cardHeight / 2
      const seconds = time / 1000

      // Smoothed scroll velocity in progress units per second, so the cloud
      // leans very slightly with the card's slow movement between bursts.
      if (lastSampleTime !== null && time > lastSampleTime) {
        const dt = time - lastSampleTime
        const instantVelocity = ((progress - lastProgressSample) / dt) * 700
        smoothedVelocity += (instantVelocity - smoothedVelocity) * Math.min(1, dt / 180)
      }
      lastProgressSample = progress
      lastSampleTime = time
      const drift = prefersReducedMotion
        ? 0
        : Math.max(-1, Math.min(1, smoothedVelocity * 1.2))

      context.globalCompositeOperation = 'source-over'

      particles.forEach((particle) => {
        let baseX = cardLeft + particle.u * cardWidth
        let baseY = cardTop + particle.v * cardHeight

        if (particle.side === 0) {
          baseX = cardLeft + particle.along * cardWidth
          baseY = cardTop - particle.offset
        } else if (particle.side === 1) {
          baseX = cardRight + particle.offset
          baseY = cardTop + particle.along * cardHeight
        } else if (particle.side === 2) {
          baseX = cardLeft + particle.along * cardWidth
          baseY = cardBottom + particle.offset
        } else if (particle.side === 3) {
          baseX = cardLeft - particle.offset
          baseY = cardTop + particle.along * cardHeight
        }

        baseX += shadowX
        baseY += shadowY

        const directionX = baseX - centerX
        const directionY = baseY - centerY
        const directionLength = Math.hypot(directionX, directionY) || 1
        const particleRippleProgress = Math.max(
          0,
          Math.min(1, (rippleProgress - particle.waveDelay) / (1 - particle.waveDelay)),
        )
        const launchEnd = 0.12
        const distanceFactor = (particle.rippleForce - forceMin) / forceRange
        // returnEnd stays below 1 so every particle finishes its return
        // inside the ripple window instead of being cut off by it.
        const returnEnd = Math.min(
          0.99,
          Math.max(launchEnd + 0.1, 0.92 - distanceFactor * 0.25 + particle.returnBias),
        )
        const returnProgress = particleRippleProgress <= launchEnd
          ? 0
          : Math.min(1, (particleRippleProgress - launchEnd) / (returnEnd - launchEnd))
        // Cosine ease: zero velocity at landing, so particles settle back
        // naturally instead of snapping to their base position.
        const organicRipple = prefersReducedMotion || rippleProgress >= 1
          ? 0
          : particleRippleProgress < launchEnd
            ? 1 - Math.pow(1 - particleRippleProgress / launchEnd, 4)
            : Math.pow(
                0.5 + 0.5 * Math.cos(Math.PI * returnProgress),
                1 + distanceFactor * 0.8,
              )
        // The card swings left on scroll down and right on scroll up, so it
        // shoves the particles on that side hard while the opposite side
        // barely stirs. push is +1 on the shoved side, -1 opposite.
        const horizontal = directionX / directionLength
        const push = -horizontal * rippleDirection
        const pushScale = push > 0 ? 1 + push * 1.3 : 1 + push * 0.8
        const rippleDistance = organicRipple * particle.rippleForce * pushScale
        const scatterDistance = organicRipple * particle.scatterForce * pushScale
        const motionAmount = prefersReducedMotion ? 0 : particle.amplitude * (1 - organicRipple * 0.7)
        const jitterX =
          Math.sin(seconds * particle.speedX * 2.1 + particle.phaseX) * motionAmount +
          Math.sin(seconds * particle.speedY * 0.7 + particle.phaseY) * motionAmount * 0.35
        const jitterY =
          Math.sin(seconds * particle.speedY * 1.9 + particle.phaseY) * motionAmount +
          Math.cos(seconds * particle.speedX * 0.8 + particle.phaseX) * motionAmount * 0.35
        const tangentX = -directionY / directionLength
        const tangentY = directionX / directionLength
        const returnCurve =
          Math.sin(returnProgress * Math.PI) * particle.returnCurve * organicRipple
        const x =
          baseX +
          jitterX +
          (directionX / directionLength) * rippleDistance +
          tangentX * particle.tangent * organicRipple +
          tangentX * returnCurve +
          Math.cos(particle.scatterAngle) * scatterDistance
        const y =
          baseY +
          jitterY +
          (directionY / directionLength) * rippleDistance +
          tangentY * particle.tangent * organicRipple +
          tangentY * returnCurve +
          Math.sin(particle.scatterAngle) * scatterDistance
        const opacity = particle.alpha * (0.88 + organicRipple * 0.12)

        context.beginPath()
        context.arc(x, y, particle.radius * (1 + organicRipple * 0.2), 0, Math.PI * 2)
        context.fillStyle = `rgba(${particle.color}, ${opacity})`
        context.fill()
      })
    }

    const animate = (time: number) => {
      draw(latestProgress, time)
      animationFrame = requestAnimationFrame(animate)
    }

    const stopAnimation = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
        animationFrame = null
      }
    }

    const updateAnimation = () => {
      if (cardRef.current && pageVisible && !prefersReducedMotion) {
        if (animationFrame === null) {
          animationFrame = requestAnimationFrame(animate)
        }
      } else {
        stopAnimation()
        draw(latestProgress, performance.now())
      }
    }

    const redraw = () => {
      resize()
      draw(latestProgress, performance.now())
    }
    const handleProgress = (progress: number) => {
      if (Math.floor(latestProgress + 0.5) !== Math.floor(progress + 0.5)) {
        rippleStartedAt = performance.now()
        rippleDirection = progress >= latestProgress ? 1 : -1
      }
      latestProgress = progress
      updateAnimation()
    }
    const handleVisibility = () => {
      pageVisible = document.visibilityState === 'visible'
      updateAnimation()
    }
    const observer = new ResizeObserver(redraw)
    observer.observe(canvas)
    if (cardRef.current) observer.observe(cardRef.current)
    const unsubscribe = imageIndex.on('change', handleProgress)
    document.addEventListener('visibilitychange', handleVisibility)
    redraw()
    updateAnimation()

    return () => {
      stopAnimation()
      observer.disconnect()
      unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [cardRef, imageIndex, prefersReducedMotion])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

function PersonDisplay({
  member,
  index,
  currentIndex,
  imageIndex,
  cardRef,
}: {
  member: TeamMember
  index: number
  currentIndex: MotionValue<number>
  imageIndex: MotionValue<number>
  cardRef?: RefObject<HTMLDivElement | null>
}) {
  // Hold a subtle loaded tilt through most of the profile, then release into a fast turn.
  const rotateY = useTransform(
    imageIndex,
    [index - 0.53, index - 0.47, index + 0.47, index + 0.53],
    [-180, -15, 15, 180],
    { clamp: true }
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
        ref={cardRef}
        className="relative isolate aspect-[4/3] w-full max-w-[22rem] mx-auto md:justify-self-center"
        style={{ perspective: 800 }}
      >
        <motion.div
          className="relative z-20 w-full h-full rounded-xl overflow-hidden border-2 border-indigo-500/40 bg-gray-950"
          style={{
            rotateY,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
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
