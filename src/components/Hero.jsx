import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { profile, projects } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'
import { blurUp, ease, springTilt, stagger } from '../lib/motion'
import Magnetic from './Magnetic'
import ParticleText from './fx/ParticleText'
import CurvedProjectLens from './fx/CurvedProjectLens'

export default function Hero({ reveal, ready }) {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, springTilt)
  const sy = useSpring(my, springTilt)
  const floorShiftX = useTransform(sx, [-0.5, 0.5], [16, -16])
  const tagLeftX = useTransform(sx, [-0.5, 0.5], [-10, 10])
  const tagLeftY = useTransform(sy, [-0.5, 0.5], [-8, 8])
  const tagRightX = useTransform(sx, [-0.5, 0.5], [12, -12])
  const tagRightY = useTransform(sy, [-0.5, 0.5], [8, -8])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const topY = useTransform(scrollYProgress, [0, 1], [0, -44])
  const topOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -24])

  const onMouseMove = (e) => {
    if (reduceMotion || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const state = reveal ? 'show' : 'hidden'

  return (
    <section
      id="top"
      className="hero hero--spatial"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Lantai grid 3D perspektif mengedepan bergaya ruang VisionOS */}
      <div className="hero__floor" aria-hidden="true">
        <div className="hero__floor-horizon" />
        <motion.div
          className="hero__floor-shift"
          style={reduceMotion ? undefined : { x: floorShiftX }}
        >
          <div className="hero__floor-grid" />
        </motion.div>
      </div>

      {/* Blok atas bersih: nama partikel interaktif + 1 baris identitas + 2 aksi utama */}
      <motion.div
        className="hero__top"
        style={reduceMotion ? undefined : { y: topY, opacity: topOpacity }}
        initial="hidden"
        animate={state}
        variants={stagger(0.1, 0.08)}
      >
        <ParticleText text={profile.display} ready={ready} settledIntro />

        <motion.p className="hero__sub" variants={blurUp}>
          {profile.role} · {profile.institution}
        </motion.p>

        <motion.div className="hero__cta" variants={blurUp}>
          <Magnetic
            href="#cv"
            className="btn btn--primary"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#cv')
            }}
          >
            Buka CV
          </Magnetic>
          <Magnetic
            href="#contact"
            className="btn btn--glass"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('#contact')
            }}
          >
            Hubungi
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Galeri 3D WebGL Lengkung: posisi tetap (y=0) agar globe preloader mendarat tepat subpiksel */}
      <motion.div
        className="hero__stage"
        style={reduceMotion ? undefined : { y: stageY }}
      >
        <motion.span
          className="hero__chip hero__chip--blue"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.45, ease }}
          style={reduceMotion ? undefined : { x: tagLeftX, y: tagLeftY }}
          aria-hidden="true"
        >
          @frontend
        </motion.span>
        <motion.span
          className="hero__chip hero__chip--dark"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.45, ease, delay: 0.06 }}
          style={reduceMotion ? undefined : { x: tagRightX, y: tagRightY }}
          aria-hidden="true"
        >
          @fullstack
        </motion.span>

        <CurvedProjectLens items={projects} ready={ready} settledIntro />
      </motion.div>
    </section>
  )
}
