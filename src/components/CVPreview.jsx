import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { education, organizations, profile, projects } from '../data/content'
import SectionHead from './SectionHead'
import Magnetic from './Magnetic'
import Toast, { copyText, useToast } from './Toast'
import { blurUp, springTilt, viewportOnce } from '../lib/motion'

const featuredProjects = projects.slice(0, 3)
const primaryEdu = education[0]
const featuredOrgs = organizations.slice(0, 2)

export default function CVPreview() {
  const [toast, showToast] = useToast()
  const stageRef = useRef(null)
  const reduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, springTilt)
  const sy = useSpring(my, springTilt)
  const sheetRx = useTransform(sy, [-0.5, 0.5], [8, -6])
  const sheetRy = useTransform(sx, [-0.5, 0.5], [-11, 5])
  const backX = useTransform(sx, [-0.5, 0.5], [10, 22])
  const backY = useTransform(sy, [-0.5, 0.5], [4, 14])

  const onMove = (e) => {
    if (reduceMotion || !stageRef.current) return
    const r = stageRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    stageRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    stageRef.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const share = async () => {
    const url = `${location.origin}${location.pathname}#cv`
    showToast((await copyText(url)) ? 'Tautan CV disalin' : 'Gagal menyalin tautan')
  }

  return (
    <section id="cv" className="section section--band cv-section">
      <div className="container">
        <SectionHead id="cv" />

        <motion.div
          ref={stageRef}
          className="cv-stage"
          variants={blurUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div className="cv-stage__grid">
            {/* Kiri: tipografi editorial serasi & aksi taktil Liquid Glass */}
            <div className="cv-stage__copy">
              <h3 className="cv-stage__title">
                Ringkasan lengkap <span>dalam satu halaman.</span>
              </h3>
              <p className="cv-stage__desc">
                Memuat keahlian teknis, proyek pilihan, riwayat pendidikan, dan pengalaman organisasi.
              </p>

              <div className="cv-stage__actions no-print">
                <Magnetic
                  as="a"
                  href="/cv-muhammad-abel-abhinaya.pdf"
                  download="CV - Muhammad Abel Abhinaya.pdf"
                  className="cv-btn cv-btn--primary"
                >
                  <span>Unduh PDF</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                    <path d="M12 4v12m0 0-4.5-4.5M12 16l4.5-4.5M5 20h14" />
                  </svg>
                </Magnetic>

                <Magnetic
                  as="a"
                  href="/cv-muhammad-abel-abhinaya.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="cv-btn cv-btn--glass"
                >
                  <span>Lihat PDF</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
                    <path d="M7 17 17 7M7 7h10v10" />
                  </svg>
                </Magnetic>

                <Magnetic
                  as="button"
                  type="button"
                  className="cv-btn-icon"
                  onClick={share}
                  aria-label="Salin tautan CV"
                  title="Salin tautan CV"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11 4.93" />
                    <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 19.07" />
                  </svg>
                </Magnetic>
              </div>
            </div>

            {/* Kanan: panggung lembar A4 melayang 3D interaktif (tanpa data privat) */}
            <div className="cv-stage__visual">
              <div className="cv-stage__mesh" aria-hidden="true" />

              <motion.div
                className="cv-sheet-back"
                aria-hidden="true"
                style={reduceMotion ? undefined : { x: backX, y: backY, rotate: 5 }}
              />

              <motion.a
                href="/cv-muhammad-abel-abhinaya.pdf"
                target="_blank"
                rel="noreferrer"
                className="cv-sheet"
                data-cursor="Buka"
                aria-label="Buka dokumen CV dalam tab baru"
                style={
                  reduceMotion
                    ? undefined
                    : {
                        transformPerspective: 1100,
                        rotateX: sheetRx,
                        rotateY: sheetRy,
                        rotateZ: -1.2,
                      }
                }
              >
                <span className="cv-sheet__sheen" aria-hidden="true" />

                <div className="cv-sheet__head">
                  <p className="cv-sheet__name">{profile.display}</p>
                  <p className="cv-sheet__role">
                    {profile.role} · {profile.institution}
                  </p>
                  <span className="cv-sheet__accent" aria-hidden="true" />
                </div>

                <div className="cv-sheet__sec">
                  <span className="cv-sheet__kicker">Proyek</span>
                  {featuredProjects.map((p) => (
                    <div key={p.id} className="cv-sheet__row">
                      <div className="cv-sheet__row-top">
                        <strong>{p.title}</strong>
                        <span>{p.category}</span>
                      </div>
                      <span className="cv-sheet__bar" aria-hidden="true" />
                    </div>
                  ))}
                </div>

                <div className="cv-sheet__sec">
                  <span className="cv-sheet__kicker">Pendidikan</span>
                  {primaryEdu && (
                    <div className="cv-sheet__row">
                      <div className="cv-sheet__row-top">
                        <strong>{primaryEdu.school}</strong>
                      </div>
                      <p className="cv-sheet__sub">{primaryEdu.program}</p>
                    </div>
                  )}
                </div>

                <div className="cv-sheet__sec">
                  <span className="cv-sheet__kicker">Organisasi</span>
                  <p className="cv-sheet__sub">
                    {featuredOrgs.map((o) => o.org).join(' · ')}
                  </p>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
