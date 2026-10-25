import { motion } from 'framer-motion'
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

export default function Experience() {
  const [focus, group] = useFocus()

  return (
    <section id="experience" className="section section--band">
      <div className="container">
        <SectionHead id="experience" />

        <div {...group}>
          {groups.map((g) => (
            <div key={g.label} className="xp">
              <motion.h3 className="xp__label" initial="hidden" whileInView="show" viewport={viewportOnce} variants={rowReveal}>
                {g.label}
              </motion.h3>
              <motion.ol className="xp__list" variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={viewportOnce}>
                {g.items.map((item) => (
                  <motion.li key={item.key} className="xp__row" variants={rowReveal}>
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
                ))}
              </motion.ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
