import { motion } from 'framer-motion'
import { skills } from '../data/content'
import { cardReveal, chipReveal, springCard, stagger, viewportOnce } from '../lib/motion'
import SectionHead from './SectionHead'

const total = skills.reduce((n, g) => n + g.items.length, 0)

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead index={3} label="Keahlian" title="Keahlian" meta={`${total} item dalam ${skills.length} kelompok`} />

        <motion.div
          className="skills"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {skills.map((g, gi) => (
            <motion.article key={g.group} className="scard" variants={cardReveal} whileHover={{ y: -6 }} transition={springCard}>
              <header className="scard__head">
                <h3 className="scard__title">{g.group}</h3>
                <span className="mono scard__count">{String(g.items.length).padStart(2, '0')}</span>
              </header>
              <motion.ul className="chips" variants={stagger(0.04, 0.15 + gi * 0.08)}>
                {g.items.map((s) => (
                  <motion.li key={s} className="chip" variants={chipReveal}>
                    {s}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
