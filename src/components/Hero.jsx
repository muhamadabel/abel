import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { profile, projects } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'
import { blurUp, ease, springTilt, stagger } from '../lib/motion'
import Magnetic from './Magnetic'
import ParticleText from './fx/ParticleText'
import CurvedProjectLens from './fx/CurvedProjectLens'

export default function Hero({ ready }) {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const sx = useSpring(mx, springTilt)
  const floorShiftX = useTransform(sx, [-0.5, 0.5], [14, -14])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const topY = useTransform(scrollYProgress, [0, 1], [0, -44])
  const topOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -24])

  const onMouseMove = (e) => {
    if (reduceMotion || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
  }

  const onMouseLeave = () => {
    mx.set(0)
  }

  const state = ready ? 'show' : 'hidden'

  return (
    <section
      id="top"
      className="hero hero--spatial"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Lantai grid perspektif halus bergaya ruang VisionOS */}
      <div className="hero__floor" aria-hidden="true">
        <motion.div className="hero__floor-grid" style={reduceMotion ? undefined : { x: floorShiftX }} />
      </div>

      {/* Blok atas bersih: nama partikel interaktif + 1 baris identitas + 2 aksi utama */}
      <motion.div
        className="hero__top"
        style={reduceMotion ? undefined : { y: topY, opacity: topOpacity }}
        initial="hidden"
        animate={state}
        variants={stagger(0.1, 0.08)}
      >
        <ParticleText text={profile.display} ready={ready} />

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

      {/* Galeri 3D WebGL Lengkung: geser/flick langsung tanpa tombol panah, tanpa tanggal */}
      <motion.div
        className="hero__stage"
        initial={{ opacity: 0, y: 30 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.72, ease, delay: 0.16 }}
        style={reduceMotion ? undefined : { y: stageY }}
      >
        <CurvedProjectLens items={projects} ready={ready} />
      </motion.div>
    </section>
  )
}
