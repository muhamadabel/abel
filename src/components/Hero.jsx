import { useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { achievements, contact, organizations, profile, projects, skills } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'
import { blurUp, springBar, springCard, springTilt, stagger, wordReveal } from '../lib/motion'
import Magnetic from './Magnetic'

const nameWords = profile.display.split(' ')
const taglineWords = profile.tagline.split(' ')
const totalSkills = skills.reduce((n, g) => n + g.items.length, 0)
const years = projects.map((p) => p.year)

// Drag hanya di perangkat dengan pointer presisi, supaya scroll di layar sentuh tidak terganggu.
const canDrag = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
// Kartu melayang bebas hanya di desktop; di mobile kartu tersusun di grid bawah teks.
const floating = typeof window !== 'undefined' && window.matchMedia('(min-width: 992px)').matches

// Isi tiap kartu murni turunan data. depth = seberapa jauh kartu ikut bergeser (parallax),
// spread = arah kartu menyebar saat hero discroll.
const cards = [
  {
    pos: 'tl',
    rotate: -3.5,
    from: { x: -90, y: -70 },
    delay: 0.3,
    depth: 1,
    spread: { x: -120, y: -40 },
    target: '#work',
    label: 'Proyek',
    value: projects.length,
    note: `${Math.min(...years)} - ${Math.max(...years)}`,
    bars: projects.map((p) => ({ key: p.title, v: p.stack.length, unit: 'stack' })),
    barsNote: 'stack per proyek',
  },
  {
    pos: 'tr',
    rotate: 3.5,
    from: { x: 90, y: -70 },
    delay: 0.4,
    depth: 0.6,
    spread: { x: 120, y: -40 },
    target: '#skills',
    label: 'Keahlian',
    value: totalSkills,
    note: `${skills.length} kelompok`,
    bars: skills.map((g) => ({ key: g.group, v: g.items.length, unit: 'item' })),
    barsNote: 'item per kelompok',
  },
  {
    pos: 'bl',
    rotate: 3,
    from: { x: -90, y: 70 },
    delay: 0.5,
    depth: 0.8,
    spread: { x: -140, y: 60 },
    target: '#experience',
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
    depth: 1.2,
    spread: { x: 140, y: 60 },
    target: '#experience',
    label: 'Pencapaian',
    value: achievements[0].year,
    note: achievements[0].title,
    list: [achievements[0].event, achievements[0].organizer],
  },
]

function Bars({ bars, delay, note }) {
  const [active, setActive] = useState(null)
  const max = Math.max(...bars.map((b) => b.v))
  const current = active !== null ? bars[active] : null

  return (
    <div className="fcard__chart" onMouseLeave={() => setActive(null)}>
      <div className="fcard__bars">
        {bars.map((b, i) => (
          <span
            key={b.key}
            className={`fcard__bar${active !== null && active !== i ? ' is-dim' : ''}`}
            onMouseEnter={() => setActive(i)}
          >
            <motion.span
              style={{ height: `${(b.v / max) * 100}%` }}
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { ...springBar, delay: delay + 0.35 + i * 0.07 } } }}
            />
          </span>
        ))}
      </div>
      <span className="fcard__note mono">{current ? `${current.key} · ${current.v} ${current.unit}` : note}</span>
    </div>
  )
}

function FloatingCard({ card, mx, my, rotateX, rotateY, progress }) {
  // Parallax: kartu bergeser berlawanan arah kursor, makin dalam makin jauh,
  // lalu menyebar keluar saat hero ditinggalkan.
  const k = floating ? 1 : 0
  const px = useTransform([mx, progress], ([x, p]) => k * (x * -36 * card.depth + p * card.spread.x))
  const py = useTransform([my, progress], ([y, p]) => k * (y * -36 * card.depth + p * card.spread.y))
  const fade = useTransform(progress, [0, 0.6], [1, floating ? 0 : 1])

  return (
    <motion.div
      className={`fcard-wrap fcard-wrap--${card.pos}`}
      variants={{
        hidden: { opacity: 0, ...card.from, rotate: card.rotate * 3 },
        show: { opacity: 1, x: 0, y: 0, rotate: card.rotate, transition: { ...springCard, delay: card.delay } },
      }}
    >
      <motion.div className="fcard-parallax" style={{ x: px, y: py, opacity: fade }}>
        <div className="fcard-float" style={{ animationDelay: `${card.delay * -4}s` }}>
          <motion.div
            className="fcard"
            style={{ rotateX, rotateY }}
            whileHover={{ scale: 1.06 }}
            drag={canDrag}
            dragSnapToOrigin
            dragElastic={0.35}
            dragTransition={{ bounceStiffness: 260, bounceDamping: 18 }}
            whileDrag={{ scale: 1.1, rotate: 0, cursor: 'grabbing', zIndex: 5 }}
            onTap={() => scrollTo(card.target)}
            transition={springCard}
            title={`${card.label}: geser atau klik`}
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
        </div>
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

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const centerY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const centerOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

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
      <motion.div className="hero__cards" initial="hidden" animate={state}>
        {cards.map((c) => (
          <FloatingCard key={c.pos} card={c} mx={sx} my={sy} rotateX={rotateX} rotateY={rotateY} progress={scrollYProgress} />
        ))}
      </motion.div>

      <motion.div className="hero__center" style={{ y: centerY, opacity: centerOpacity }}>
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
      </motion.div>

    </section>
  )
}
