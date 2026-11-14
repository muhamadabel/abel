import { useRef } from 'react'
import { motion, useInView, useScroll, useSpring } from 'framer-motion'
import { achievements, education, organizations } from '../data/content'
import { ease, rowReveal, stagger, viewportOnce } from '../lib/motion'
import { useFocus } from '../hooks/useFocus'
import SectionHead from './SectionHead'

const groups = [
  {
    label: 'Organisasi',
    items: organizations.map((o) => ({ key: o.org, title: o.role, sub: o.org, period: o.period, desc: o.desc })),
  },
  {
    label: 'Pencapaian',
    items: achievements.map((a) => ({ key: a.event, title: a.title, sub: `${a.event}, ${a.organizer}`, period: a.year })),
  },
  {
    label: 'Pendidikan',
    items: education.map((e) => ({
      key: e.school,
      title: e.school,
      sub: [e.program, e.degree].filter(Boolean).join(', '),
      period: e.period,
    })),
  },
]

// Nomor urut global supaya fokus-hover berlaku lintas kelompok
let n = 0
groups.forEach((g) => g.items.forEach((item) => (item.idx = n++)))

const rule = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease } } }

// Garis vertikal yang terisi mengikuti scroll, titik menyala saat barisnya lewat tengah layar.
function XpRow({ item, focus }) {
  const ref = useRef(null)
  const lit = useInView(ref, { margin: '0px 0px -45% 0px' })

  return (
    <motion.li ref={ref} className={`xp__row${lit ? ' is-lit' : ''}`} variants={rowReveal}>
      <span className="xp__dot" aria-hidden="true" />
      <motion.span className="xp__rule" aria-hidden="true" variants={rule} />
      <motion.div className="xp__inner" {...focus(item.idx)}>
        <span className="xp__period">{item.period}</span>
        <div className="xp__main">
          <p className="xp__title">{item.title}</p>
          <p className="xp__sub">{item.sub}</p>
          {item.desc && <p className="xp__desc">{item.desc}</p>}
        </div>
      </motion.div>
    </motion.li>
  )
}

function XpList({ items, focus }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  return (
    <motion.ol ref={ref} className="xp__list" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={viewportOnce}>
      <span className="xp__track" aria-hidden="true">
        <motion.span className="xp__fill" style={{ scaleY: fill }} />
      </span>
      {items.map((item) => (
        <XpRow key={item.key} item={item} focus={focus} />
      ))}
    </motion.ol>
  )
}

export default function Experience() {
  const [focus, group] = useFocus()

  return (
    <section id="experience" className="section section--band section--experience">
      <div className="container">
        <SectionHead id="experience" />

        <div {...group}>
          {groups.map((g) => (
            <div key={g.label} className="xp">
              <motion.h3 className="xp__label" initial="hidden" whileInView="show" viewport={viewportOnce} variants={rowReveal}>
                {g.label}
              </motion.h3>
              <XpList items={g.items} focus={focus} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
