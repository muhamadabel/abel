import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
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

function ProjectCard({ p, i, focus }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [-22, 22])
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 24 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 24 })
  const tilt = (e) => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    rotateX.set(((e.clientY - rect.top) / rect.height - 0.5) * -3)
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 3)
  }
  const resetTilt = () => { rotateX.set(0); rotateY.set(0) }
  const targetUrl = p.live || p.repo
  return <motion.li ref={ref} variants={cardReveal} className={i === 0 ? 'project--feature' : undefined}>
    <motion.div {...focus(i)}>
      <motion.a href={targetUrl} target="_blank" rel="noreferrer" className="pcard" onMouseMove={tilt} onMouseLeave={resetTilt} whileHover={{ y: -6 }} transition={springCard}>
        <div className="pcard__media"><motion.div className="pcard__media-inner" variants={{ hidden: { scale: 1.08 }, show: { scale: 1, transition: { duration: 1.4, ease } } }} style={{ rotateX, rotateY, transformPerspective: 1000 }}>
          {p.image ? <motion.img src={p.image} alt={`Tampilan ${p.title}`} style={{ y: imageY, scale: 1.08 }} loading="lazy" draggable="false" /> : <span className="pcard__placeholder">{host(targetUrl)}</span>}
        </motion.div></div>
        <div className="pcard__head"><h3 className="pcard__title">{p.title}<span className="pcard__ext" aria-hidden="true">↗</span></h3><span className="pcard__year">{p.year}</span></div>
        <p className="pcard__meta">{p.category} · {p.role}</p><p className="pcard__desc">{p.desc}</p><p className="pcard__stack">{p.stack.join(' · ')}</p>
        {p.repo && p.repo !== p.live && <span role="button" tabIndex={0} className="pcard__repo" onClick={(e) => openRepo(e, p.repo)} onKeyDown={(e) => e.key === 'Enter' && openRepo(e, p.repo)}>Repositori ↗</span>}
      </motion.a>
    </motion.div>
  </motion.li>
}

export default function Projects() {
  const [focus, group] = useFocus()

  return (
    <section id="work" className="section">
      <div className="container">
        <SectionHead id="work" meta={`${projects.length} proyek, ${Math.min(...years)} - ${Math.max(...years)}`} />

        <motion.ul className="projects" variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={viewportOnce} {...group}>
          {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} focus={focus} />)}
        </motion.ul>
      </div>
    </section>
  )
}
