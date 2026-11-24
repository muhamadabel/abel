import { useRef } from 'react'
import { motion } from 'framer-motion'
import { skills } from '../data/content'
import { cardReveal, itemReveal, stagger, viewportOnce } from '../lib/motion'
import SplitText from './SplitText'
import useProximity from './fx/useProximity'

// Urutan asimetris diagonal (Sapphire + Glass / Glass + Obsidian) tanpa garis pemisah.
const bentoSpec = [
  { idx: 0, tone: 'sapphire', span: 'wide' },
  { idx: 1, tone: 'glass', span: 'narrow' },
  { idx: 3, tone: 'glass', span: 'narrow' },
  { idx: 2, tone: 'obsidian', span: 'wide' },
]

export default function Skills() {
  const ref = useRef(null)
  useProximity(ref, 165, '.sbento__key')

  const onCardMove = (e) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section id="skills" className="section section--skills">
      <div className="container">
        <header className="skills-head">
          <SplitText as="h2" text="Keahlian" className="section-title" gap={0.05} letters />
        </header>

        <motion.div
          ref={ref}
          className="sbento"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {bentoSpec.map(({ idx, tone, span }) => {
            const g = skills[idx]
            if (!g) return null
            return (
              <motion.article
                key={g.group}
                className={`sbento__card sbento__card--${tone} sbento__card--${span}`}
                variants={cardReveal}
                onMouseMove={onCardMove}
              >
                <h3 className="sbento__title">{g.group}</h3>

                <motion.ul className="sbento__keys" variants={stagger(0.035, 0.04)}>
                  {g.items.map((item) => (
                    <motion.li key={item} className="sbento__key" variants={itemReveal}>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
