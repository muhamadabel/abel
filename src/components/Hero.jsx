import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { achievements, contact, organizations, profile, projects, skills } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'
import { blurUp, springBar, springCard, springTilt, stagger, wordReveal } from '../lib/motion'
import Magnetic from './Magnetic'

const nameWords = profile.display.split(' ')
const taglineWords = profile.tagline.split(' ')
const totalSkills = skills.reduce((n, g) => n + g.items.length, 0)
const years = projects.map((p) => p.year)

// Isi tiap kartu murni turunan data
const cards = [
  {
    pos: 'tl',
    rotate: -3.5,
    from: { x: -90, y: -70 },
    delay: 0.3,
    label: 'Proyek',
    value: projects.length,
    note: `${Math.min(...years)} - ${Math.max(...years)}`,
    bars: projects.map((p) => ({ key: p.title, v: p.stack.length })),
    barsNote: 'stack per proyek',
  },
  {
    pos: 'tr',
    rotate: 3.5,
    from: { x: 90, y: -70 },
    delay: 0.4,
    label: 'Keahlian',
    value: totalSkills,
    note: `${skills.length} kelompok`,
    bars: skills.map((g) => ({ key: g.group, v: g.items.length })),
    barsNote: 'item per kelompok',
  },
  {
    pos: 'bl',
    rotate: 3,
    from: { x: -90, y: 70 },
    delay: 0.5,
    label: 'Organisasi',
    value: organizations.length,
    note: organizations[0].org,
    list: organizations.map((o) => o.role),
  },
  {
    pos: 'br',
    rotate: -3,
    from: { x: 90, y: 70 },
    delay: 0.6,
    label: 'Pencapaian',
    value: achievements[0].year,
    note: achievements[0].title,
    list: [achievements[0].event, achievements[0].organizer],
  },
]

function Bars({ bars, delay, note }) {
  const max = Math.max(...bars.map((b) => b.v))
  return (
    <div className="fcard__chart">
      <div className="fcard__bars">
        {bars.map((b, i) => (
          <span key={b.key} className="fcard__bar" title={`${b.key}: ${b.v}`}>
            <motion.span
              style={{ height: `${(b.v / max) * 100}%` }}
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { ...springBar, delay: delay + 0.35 + i * 0.07 } } }}
            />
          </span>
        ))}
      </div>
      <span className="fcard__note mono">{note}</span>
    </div>
  )
}

function FloatingCard({ card, rotateX, rotateY }) {
  return (
    <motion.div
      className={`fcard-wrap fcard-wrap--${card.pos}`}
      variants={{
        hidden: { opacity: 0, ...card.from, rotate: card.rotate * 3 },
        show: { opacity: 1, x: 0, y: 0, rotate: card.rotate, transition: { ...springCard, delay: card.delay } },
      }}
    >
      <motion.div
        className="fcard"
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.06 }}
        transition={springCard}
      >
        <div className="fcard__top">
          <span className="fcard__label mono">{card.label}</span>
          <span className="fcard__note-top">{card.note}</span>
        </div>
        <strong className="fcard__value">{card.value}</strong>
        {card.bars && <Bars bars={card.bars} delay={card.delay} note={card.barsNote} />}
        {card.list && (
          <ul className="fcard__list">
            {card.list.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, springTilt)
  const sy = useSpring(my, springTilt)
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12])

  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const state = ready ? 'show' : 'hidden'
  const titleDone = 0.15 + (nameWords.length + taglineWords.length) * 0.07

  return (
    <section id="top" className="hero" ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <motion.div className="hero__cards" initial="hidden" animate={state} aria-hidden="true">
        {cards.map((c) => (
          <FloatingCard key={c.pos} card={c} rotateX={rotateX} rotateY={rotateY} />
        ))}
      </motion.div>

      <div className="hero__center">
        <motion.p className="hero__status" variants={blurUp} initial="hidden" animate={state}>
          {profile.available && <span className="status-dot" />}
          {profile.availableText}
          <span className="hero__status-sep">/</span>
          {profile.location}
        </motion.p>

        <motion.h1 className="hero__title" initial="hidden" animate={state} variants={stagger(0.07, 0.15)}>
          <span className="hero__line">
            {nameWords.map((w) => (
              <span key={w} className="word-mask">
                <motion.span className="word" variants={wordReveal}>
                  {w}
                </motion.span>
              </span>
            ))}
          </span>
          <span className="hero__line hero__line--muted">
            {taglineWords.map((w, i) => (
              <span key={`${w}-${i}`} className="word-mask">
                <motion.span className="word" variants={wordReveal}>
                  {w}
                </motion.span>
              </span>
            ))}
          </span>
        </motion.h1>

        <motion.div initial="hidden" animate={state} variants={stagger(0.12, titleDone)}>
          <motion.p className="hero__sub" variants={blurUp}>
            {profile.role}. {profile.major} {profile.institution}, angkatan {profile.cohort}.
          </motion.p>

          <motion.div className="hero__cta" variants={blurUp}>
            <Magnetic
              href="#work"
              className="btn btn--primary"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#work')
              }}
            >
              Lihat karya
            </Magnetic>
            <Magnetic
              href="#cv"
              className="btn btn--ghost"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#cv')
              }}
            >
              Buka CV
            </Magnetic>
            <Magnetic href={`mailto:${contact.email}`} className="btn btn--text">
              {contact.email}
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
