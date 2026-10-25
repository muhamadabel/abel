import { motion } from 'framer-motion'
import { skills } from '../data/content'
import { cardReveal, itemReveal, stagger, viewportOnce } from '../lib/motion'
import { useFocus } from '../hooks/useFocus'
import SectionHead from './SectionHead'

const total = skills.reduce((n, g) => n + g.items.length, 0)

export default function Skills() {
  const [focus, group] = useFocus()

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHead id="skills" meta={`${total} item dalam ${skills.length} kelompok`} />

        <motion.div className="skills" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} {...group}>
          {skills.map((g, gi) => (
            <motion.div key={g.group} className="sgroup" variants={cardReveal}>
              <motion.div className="sgroup__inner" {...focus(gi)}>
                <h3 className="sgroup__title">{g.group}</h3>
                <motion.ul className="sgroup__list" variants={stagger(0.05, 0.25)}>
                  {g.items.map((s) => (
                    <motion.li key={s} variants={itemReveal}>
                      {s}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
