import { motion } from 'framer-motion'
import { projects } from '../data/content'
import { cardReveal, springCard, stagger, viewportOnce } from '../lib/motion'
import SectionHead from './SectionHead'

const years = projects.map((p) => p.year)

const Arrow = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
    <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Projects() {
  return (
    <section id="work" className="section">
      <div className="container">
        <SectionHead
          index={1}
          label="Karya"
          title="Proyek"
          meta={`${projects.length} proyek, ${Math.min(...years)} - ${Math.max(...years)}`}
        />

        <motion.ul
          className="projects"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {projects.map((p) => {
            const targetUrl = p.live || p.repo
            return (
              <motion.li key={p.id} variants={cardReveal}>
                <motion.a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pcard"
                  whileHover={{ y: -6 }}
                  transition={springCard}
                >
                  <div className="pcard__top mono">
                    <span>{p.num}</span>
                    <span>{p.category}</span>
                    <span>{p.year}</span>
                    <span className="pcard__external-icon" aria-hidden="true">
                      <Arrow />
                    </span>
                  </div>

                  <h3 className="pcard__title">{p.title}</h3>
                  <p className="pcard__role">{p.role}</p>
                  <p className="pcard__desc">{p.desc}</p>

                  <ul className="tags">
                    {p.stack.map((s) => (
                      <li key={s} className="tag mono">
                        {s}
                      </li>
                    ))}
                  </ul>

                  <div className="pcard__links">
                    <span className="link-arrow">
                      Kunjungi web <Arrow />
                    </span>
                    {p.repo && p.repo !== p.live && (
                      <span
                        role="button"
                        tabIndex={0}
                        className="link-arrow"
                        style={{ color: 'var(--text-body-color)' }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.open(p.repo, '_blank', 'noreferrer')
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            e.stopPropagation()
                            window.open(p.repo, '_blank', 'noreferrer')
                          }
                        }}
                      >
                        Repo <Arrow />
                      </span>
                    )}
                  </div>
                </motion.a>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
