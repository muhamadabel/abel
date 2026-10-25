import { motion } from 'framer-motion'
import { projects } from '../data/content'
import { cardReveal, ease, springCard, stagger, viewportOnce } from '../lib/motion'
import { useFocus } from '../hooks/useFocus'
import SectionHead from './SectionHead'

const years = projects.map((p) => p.year)
const host = (url) => new URL(url).hostname.replace(/^www\./, '')

const openRepo = (e, url) => {
  e.preventDefault()
  e.stopPropagation()
  window.open(url, '_blank', 'noreferrer')
}

export default function Projects() {
  const [focus, group] = useFocus()

  return (
    <section id="work" className="section">
      <div className="container">
        <SectionHead id="work" meta={`${projects.length} proyek, ${Math.min(...years)} - ${Math.max(...years)}`} />

        <motion.ul className="projects" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} {...group}>
          {projects.map((p, i) => {
            const targetUrl = p.live || p.repo
            return (
              <motion.li key={p.id} variants={cardReveal}>
                <motion.div {...focus(i)}>
                  <motion.a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pcard"
                    whileHover={{ y: -6 }}
                    transition={springCard}
                  >
                    <div className="pcard__media">
                      <motion.div
                        className="pcard__media-inner"
                        variants={{ hidden: { scale: 1.08 }, show: { scale: 1, transition: { duration: 1.4, ease } } }}
                      >
                        {p.image ? (
                          <img src={p.image} alt={`Tampilan ${p.title}`} loading="lazy" draggable="false" />
                        ) : (
                          <span className="pcard__placeholder">{host(targetUrl)}</span>
                        )}
                      </motion.div>
                    </div>

                    <div className="pcard__head">
                      <h3 className="pcard__title">
                        {p.title}
                        <span className="pcard__ext" aria-hidden="true">
                          ↗
                        </span>
                      </h3>
                      <span className="pcard__year">{p.year}</span>
                    </div>
                    <p className="pcard__meta">
                      {p.category} · {p.role}
                    </p>
                    <p className="pcard__desc">{p.desc}</p>
                    <p className="pcard__stack">{p.stack.join(' · ')}</p>

                    {p.repo && p.repo !== p.live && (
                      <span
                        role="button"
                        tabIndex={0}
                        className="pcard__repo"
                        onClick={(e) => openRepo(e, p.repo)}
                        onKeyDown={(e) => e.key === 'Enter' && openRepo(e, p.repo)}
                      >
                        Repositori ↗
                      </span>
                    )}
                  </motion.a>
                </motion.div>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
