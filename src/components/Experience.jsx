import { useRef, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { achievements, education, organizations, profile } from '../data/content'
import { cardReveal, ease, springTilt, stagger, viewportOnce } from '../lib/motion'
import SectionHead from './SectionHead'

const ORG_META = {
  'KMTEDI SV UGM': { short: 'KMTEDI', logo: '/logos/kmtedi.png' },
  'ASSETS TRPL SV UGM': { short: 'ASSETS', logo: '/logos/assets.png' },
  'Jamaah Vokasi Al-Alim SV UGM': { short: 'Al-Alim', logo: '/logos/alalim.png' },
  'Hackathon Crew': { short: 'Hackathon', logo: '/logos/refactory.png' },
}

const dockSpring = { type: 'spring', stiffness: 420, damping: 34 }

function PortraitCard({ reduceMotion }) {
  const cardRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, springTilt)
  const sy = useSpring(my, springTilt)
  const rx = useTransform(sy, [-0.5, 0.5], [5, -5])
  const ry = useTransform(sx, [-0.5, 0.5], [-6, 6])

  const onMove = (e) => {
    if (reduceMotion || e.pointerType !== 'mouse' || !cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    cardRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    cardRef.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.article
      ref={cardRef}
      className="xpb__card xpb__card--portrait"
      variants={cardReveal}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={
        reduceMotion
          ? undefined
          : {
              transformPerspective: 1000,
              rotateX: rx,
              rotateY: ry,
            }
      }
    >
      <div className="xpb__portrait-aura" aria-hidden="true" />
      <div className="xpb__portrait-media">
        <img src={profile.photo} alt={profile.name} loading="lazy" draggable="false" />
      </div>
      <div className="xpb__portrait-plate">
        <strong>{profile.display}</strong>
        <span>{profile.role}</span>
      </div>
    </motion.article>
  )
}

export default function Experience() {
  const [activeOrg, setActiveOrg] = useState(0)
  const reduceMotion = useReducedMotion()

  const org = organizations[activeOrg] || organizations[0]
  const orgVisual = ORG_META[org.org] || { short: org.org, logo: '' }
  const primaryAchievement = achievements[0]

  const onSpotlightMove = (e) => {
    if (reduceMotion || e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const onDockKey = (e, idx) => {
    const n = organizations.length
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % n
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + n) % n
    if (next < 0) return
    e.preventDefault()
    setActiveOrg(next)
  }

  return (
    <section id="experience" className="section section--band section--experience">
      <div className="container">
        <SectionHead id="experience" />

        <motion.div
          className="xpb"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {/* Baris 1 Kiri (7 col): Panggung Organisasi Interaktif Obsidian */}
          <motion.article
            className="xpb__card xpb__card--org"
            variants={cardReveal}
            onPointerMove={onSpotlightMove}
          >
            <div className="xpb__head">
              <span className="xpb__kicker xpb__kicker--light">Organisasi</span>
            </div>

            <div className="xpb__org-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={org.org}
                  className="xpb__org-body"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.34, ease }}
                >
                  {orgVisual.logo && (
                    <img
                      src={orgVisual.logo}
                      alt=""
                      aria-hidden="true"
                      className="xpb__org-watermark"
                      draggable="false"
                    />
                  )}

                  <div className="xpb__org-meta">
                    {orgVisual.logo && (
                      <span className="xpb__org-emblem" aria-hidden="true">
                        <img src={orgVisual.logo} alt="" draggable="false" />
                      </span>
                    )}
                    <span className="xpb__org-name">{org.org}</span>
                    <span className="xpb__org-sep" aria-hidden="true">
                      ·
                    </span>
                    <span className="xpb__org-period">{org.period}</span>
                  </div>

                  <h3 className="xpb__org-role">{org.role}</h3>
                  <p className="xpb__org-desc">{org.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <LayoutGroup id="xp-org-dock">
              <div className="xpb__dock" role="tablist" aria-label="Pilih pengalaman organisasi">
                {organizations.map((item, i) => {
                  const meta = ORG_META[item.org] || { short: item.org, logo: '' }
                  const isActive = i === activeOrg
                  return (
                    <button
                      key={item.org}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`xpb__tab${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveOrg(i)}
                      onKeyDown={(e) => onDockKey(e, i)}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="xp-org-pill"
                          className="xpb__tab-bg"
                          transition={reduceMotion ? { duration: 0 } : dockSpring}
                          aria-hidden="true"
                        />
                      )}
                      <span className="xpb__tab-inner">
                        <strong className="xpb__tab-name">{meta.short}</strong>
                      </span>
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>
          </motion.article>

          {/* Baris 1 Kanan (5 col): Potret Studio 3D Tilt */}
          <PortraitCard reduceMotion={reduceMotion} />

          {/* Baris 2 Kiri (6 col): Plakat Pencapaian Midnight Sapphire + Foto Sertifikat Resmi */}
          {primaryAchievement && (
            <motion.article
              className="xpb__card xpb__card--award"
              variants={cardReveal}
              onPointerMove={onSpotlightMove}
            >
              <div className="xpb__award-grid">
                <div className="xpb__award-copy">
                  <div className="xpb__head">
                    <span className="xpb__kicker xpb__kicker--light">Pencapaian</span>
                    <span className="xpb__year">{primaryAchievement.year}</span>
                  </div>
                  <div className="xpb__award-body">
                    <h3 className="xpb__award-title">{primaryAchievement.title}</h3>
                    <p className="xpb__award-sub">
                      {primaryAchievement.event} · {primaryAchievement.organizer}
                    </p>
                  </div>
                </div>

                <a
                  href="/certificates/olivia-2026.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="xpb__cert"
                  data-cursor="Buka"
                  aria-label="Lihat sertifikat resmi Juara Harapan 2 OLIVIA XI 2026"
                >
                  <img
                    src="/certificates/olivia-2026.jpg"
                    alt="Sertifikat Juara Harapan 2 OLIVIA XI 2026 - Web Technology Competition"
                    loading="lazy"
                    draggable="false"
                  />
                </a>
              </div>
            </motion.article>
          )}

          {/* Baris 2 Kanan (7 col): Kartu Pendidikan Kaca Prismatik (Tanpa Garis Pemisah) */}
          <motion.article
            className="xpb__card xpb__card--edu"
            variants={cardReveal}
            onPointerMove={onSpotlightMove}
          >
            <div className="xpb__head">
              <span className="xpb__kicker">Pendidikan</span>
            </div>

            <div className="xpb__edu-grid">
              {education.map((e, idx) => (
                <div
                  key={e.school}
                  className={`xpb__edu-tile${idx === 0 ? ' xpb__edu-tile--primary' : ''}`}
                >
                  <div className="xpb__edu-top">
                    {idx === 0 && (
                      <img
                        src="/logos/ugm.png"
                        alt=""
                        aria-hidden="true"
                        className="xpb__edu-logo"
                        draggable="false"
                      />
                    )}
                    <span className="xpb__edu-period">{e.period}</span>
                  </div>
                  <h3 className="xpb__edu-school">{e.school}</h3>
                  <p className="xpb__edu-prog">
                    {[e.program, e.degree].filter(Boolean).join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  )
}
