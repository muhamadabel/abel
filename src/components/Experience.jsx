import { useState } from 'react'
import { motion } from 'framer-motion'
import { achievements, education, organizations } from '../data/content'
import { ease, rowReveal, stagger, viewportOnce } from '../lib/motion'
import SectionHead from './SectionHead'

const entries = [
  ...organizations.map((o) => ({
    key: o.org,
    title: o.role,
    sub: o.org,
    tag: o.tag,
    period: o.period,
    desc: o.desc,
  })),
  ...achievements.map((a) => ({
    key: a.event,
    title: a.title,
    sub: `${a.event}, ${a.organizer}`,
    tag: 'Pencapaian',
    period: a.year,
    desc: null,
  })),
  ...education.map((e) => ({
    key: e.school,
    title: e.school,
    sub: e.program,
    tag: e.degree || 'Pendidikan',
    period: e.period,
    desc: null,
  })),
]

export default function Experience() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="experience" className="section section--band">
      <div className="container">
        <SectionHead index={2} label="Pengalaman" title="Organisasi, pencapaian & pendidikan" />

        <motion.ul
          className="rows"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          onMouseLeave={() => setHovered(null)}
        >
          {entries.map((item, idx) => {
            const isDimmed = hovered !== null && hovered !== idx
            return (
              <motion.li key={item.key} variants={rowReveal}>
                <motion.div
                  className="row"
                  onMouseEnter={() => setHovered(idx)}
                  animate={{
                    opacity: isDimmed ? 0.3 : 1,
                    filter: isDimmed ? 'blur(1.5px)' : 'blur(0px)',
                  }}
                  transition={{ duration: 0.35, ease }}
                >
                  <span className="row__num mono">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="row__main">
                    <h3 className="row__title">{item.title}</h3>
                    <p className="row__sub">{item.sub}</p>
                    {item.desc && <p className="row__desc">{item.desc}</p>}
                  </div>
                  <span className="tag mono row__tag">{item.tag}</span>
                  <span className="row__period mono">{item.period}</span>
                </motion.div>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
