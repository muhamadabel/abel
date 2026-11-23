import { motion } from 'framer-motion'
import { achievements, education, organizations } from '../data/content'
import { blurUp, stagger, viewportOnce } from '../lib/motion'
import SectionHead from './SectionHead'
import LiquidAccordion from './fx/LiquidAccordion'

const orgItems = organizations.map((o) => ({
  key: o.org,
  title: o.role,
  sub: o.org,
  tag: o.tag,
  desc: o.desc,
}))

export default function Experience() {
  return (
    <section id="experience" className="section section--band section--experience">
      <div className="container">
        <SectionHead id="experience" />

        <motion.div
          className="xp-grid"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {/* Organisasi dalam Liquid Glass Water-Drop Accordion (WebGL shader) */}
          <motion.div className="xp-col xp-col--main" variants={blurUp}>
            <h3 className="xp__label">Organisasi</h3>
            <LiquidAccordion items={orgItems} defaultOpen={0} />
          </motion.div>

          {/* Pendidikan & Pencapaian dalam panel kaca bersih tanpa tanggal ramai */}
          <motion.div className="xp-col xp-col--side" variants={blurUp}>
            <div className="xp-card">
              <h3 className="xp__label">Pendidikan</h3>
              <ul className="xp-card__list">
                {education.map((e) => (
                  <li key={e.school} className="xp-card__item">
                    <p className="xp-card__title">{e.school}</p>
                    <p className="xp-card__sub">
                      {[e.program, e.degree].filter(Boolean).join(' · ')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="xp-card">
              <h3 className="xp__label">Pencapaian</h3>
              <ul className="xp-card__list">
                {achievements.map((a) => (
                  <li key={a.event} className="xp-card__item">
                    <p className="xp-card__title">{a.title}</p>
                    <p className="xp-card__sub">
                      {a.event} · {a.organizer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
