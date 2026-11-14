import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/content'
import { blurUp, ease, springCard, stagger, viewportOnce } from '../lib/motion'
import SectionHead from './SectionHead'
import Spotlight from './fx/Spotlight'

const host = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function ProjectCard({ p, onCardClick }) {
  const targetUrl = p.live || p.repo

  const openRepo = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(p.repo, '_blank', 'noreferrer')
  }

  return (
    <article className="pcard-wrap">
      <a
        href={targetUrl}
        target="_blank"
        rel="noreferrer"
        className="pcard"
        data-cursor="Buka"
        style={p.tint ? { '--tint': p.tint } : undefined}
        onClick={onCardClick}
        aria-label={`Buka website proyek ${p.title}`}
      >
        <Spotlight className="pcard__media">
          {p.image ? (
            <img src={p.image} alt="" loading="lazy" draggable="false" />
          ) : (
            <span className="pcard__placeholder">{host(targetUrl)}</span>
          )}
        </Spotlight>

        <div className="pcard__body">
          <p className="pcard__meta">
            {p.category} · {p.year}
          </p>
          <h3 className="pcard__title">
            {p.title}
            <svg className="pcard__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </h3>
          <p className="pcard__desc">{p.desc}</p>

          <div className="pcard__foot">
            <span className="pcard__stack">{p.stack.join(' · ')}</span>
            {p.repo && p.repo !== p.live && (
              <button type="button" className="pcard__repo" data-cursor="GitHub" onClick={openRepo} aria-label={`Repositori GitHub ${p.title}`}>
                GitHub
              </button>
            )}
          </div>
        </div>
      </a>
    </article>
  )
}

export default function Projects() {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasMovedRef = useRef(false)

  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const atEnd = scrollLeft >= scrollWidth - clientWidth - 8
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(!atEnd)

    const slide = el.querySelector('.projects-slide')
    if (slide) {
      const slideWidth = slide.offsetWidth + 20
      const idx = atEnd ? projects.length - 1 : Math.min(projects.length - 1, Math.max(0, Math.round(scrollLeft / slideWidth)))
      setActiveIndex(idx)
    }
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateScrollState()
    const handleResize = () => updateScrollState()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollByDirection = (dir) => {
    const el = trackRef.current
    if (!el) return
    const slide = el.querySelector('.projects-slide')
    const step = slide ? slide.offsetWidth + 20 : 440
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const scrollToIndex = (idx) => {
    const el = trackRef.current
    if (!el) return
    const slide = el.querySelector('.projects-slide')
    const step = slide ? slide.offsetWidth + 20 : 440
    el.scrollTo({ left: idx * step, behavior: 'smooth' })
  }

  const onMouseDown = (e) => {
    const el = trackRef.current
    if (!el) return
    isDraggingRef.current = true
    startXRef.current = e.pageX - el.offsetLeft
    scrollLeftRef.current = el.scrollLeft
    hasMovedRef.current = false
  }

  const onMouseMove = (e) => {
    if (!isDraggingRef.current) return
    const el = trackRef.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const distance = (x - startXRef.current) * 1.3
    if (Math.abs(distance) > 5) {
      hasMovedRef.current = true
    }
    el.scrollLeft = scrollLeftRef.current - distance
  }

  const onMouseUp = () => {
    isDraggingRef.current = false
  }

  const onCardClick = (e) => {
    if (hasMovedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const currentDisplay = String(activeIndex + 1).padStart(2, '0')
  const totalDisplay = String(projects.length).padStart(2, '0')

  return (
    <section id="work" className="section section--projects">
      <div className="container">
        <SectionHead id="work">
          <div className="projects-controls" aria-label="Navigasi slider proyek">
            <span className="projects-counter mono">
              <strong>{currentDisplay}</strong> / {totalDisplay}
            </span>
            <div className="projects-nav-btns">
              <button
                type="button"
                className="projects-nav-btn"
                onClick={() => scrollByDirection(-1)}
                disabled={!canScrollLeft}
                aria-label="Proyek sebelumnya"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="projects-nav-btn"
                onClick={() => scrollByDirection(1)}
                disabled={!canScrollRight}
                aria-label="Proyek berikutnya"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </SectionHead>
      </div>

      <div className="projects-slider-wrap">
        <motion.div
          className="projects-track"
          ref={trackRef}
          onScroll={updateScrollState}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              className={`projects-slide ${activeIndex === i ? 'is-active' : ''}`}
              variants={blurUp}
            >
              <ProjectCard p={p} onCardClick={onCardClick} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="container">
        <div className="projects-pagination" role="tablist" aria-label="Pilih proyek">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Lompat ke proyek ${p.title}`}
              className={`projects-dot ${activeIndex === i ? 'is-active' : ''}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
