import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { achievements, contact, education, organizations, profile, projects, skills } from '../data/content'
import SectionHead from './SectionHead'
import Magnetic from './Magnetic'
import Toast, { copyText, useToast } from './Toast'

const githubUrl = contact.github.url.replace(/^https?:\/\//, '')
const linkedinUrl = contact.linkedin.url.replace(/^https?:\/\/(www\.)?/, '')

export default function CVPreview() {
  const [toast, showToast] = useToast()
  const paperRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: paperRef, offset: ['start end', 'start 45%'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])

  const share = async () => {
    const url = `${location.origin}${location.pathname}#cv`
    showToast((await copyText(url)) ? 'Tautan CV disalin' : 'Gagal menyalin tautan')
  }

  return (
    <section id="cv" className="section section--band cv-section">
      <div className="container">
        <SectionHead id="cv">
          <div className="cv-actions no-print">
            <Magnetic
              as="a"
              href="/cv-muhammad-abel-abhinaya.pdf"
              download="CV - Muhammad Abel Abhinaya.pdf"
              className="btn btn--primary"
              target="_blank"
              rel="noreferrer"
            >
              Unduh PDF
            </Magnetic>
            <Magnetic as="button" type="button" className="btn btn--ghost" onClick={() => window.print()}>
              Cetak Halaman
            </Magnetic>
            <Magnetic as="button" type="button" className="btn btn--ghost" onClick={share}>
              Bagikan
            </Magnetic>
          </div>
        </SectionHead>

        <div className="cv-stage">
          <motion.article ref={paperRef} className="cv-paper cv-paper--ats" style={{ rotateX, scale, y }}>
            {/* Header ATS Style Septyan */}
            <header className="ats-header">
              <h3 className="ats-name">{profile.name}</h3>
              <p className="ats-contact">
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                <span className="ats-sep">|</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <span className="ats-sep">|</span>
                <a href={contact.linkedin.url} target="_blank" rel="noreferrer">
                  {linkedinUrl}
                </a>
                <span className="ats-sep">|</span>
                <a href={contact.github.url} target="_blank" rel="noreferrer">
                  {githubUrl}
                </a>
                <br />
                <span>{profile.address}</span>
              </p>
            </header>

            {/* Summary */}
            <p className="ats-summary">
              Software Engineering Technology undergraduate at Universitas Gadjah Mada with practical experience in
              frontend engineering, modern web applications, and mobile systems development. Proficient in architecting
              responsive, accessible, and type-safe applications using React, Next.js, React Native, and TypeScript.
              Experienced in translating complex functional requirements into production-ready platforms, managing state
              with Zustand, and collaborating across agile teams to deliver reliable digital solutions.
            </p>

            {/* Work Experiences & Featured Projects */}
            <section className="ats-section">
              <h4 className="ats-title">Work Experiences & Featured Projects</h4>

              {projects.slice(0, 5).map((p) => {
                const targetUrl = p.live || p.repo
                const hostName = targetUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
                return (
                  <div key={p.id} className="ats-entry">
                    <div className="ats-entry__head">
                      <strong className="ats-entry__title">{p.title} - Yogyakarta, Indonesia</strong>
                      <span className="ats-entry__date">{p.year}</span>
                    </div>
                    <div className="ats-entry__sub">
                      <em>{p.role}</em>
                      <span className="ats-sep">|</span>
                      <a href={targetUrl} target="_blank" rel="noreferrer" className="ats-entry__link">
                        {hostName}
                      </a>
                    </div>
                    <p className="ats-entry__desc">{p.desc}</p>
                    <ul className="ats-bullets">
                      <li>Stack utama: {p.stack.join(' · ')}</li>
                    </ul>
                  </div>
                )
              })}
            </section>

            {/* Education Level */}
            <section className="ats-section">
              <h4 className="ats-title">Education Level</h4>
              {education.map((e) => (
                <div key={e.school} className="ats-entry">
                  <div className="ats-entry__head">
                    <strong className="ats-entry__title">{e.school}</strong>
                    <span className="ats-entry__date">{e.period}</span>
                  </div>
                  <div className="ats-entry__desc">
                    {[e.degree, e.faculty, e.program].filter(Boolean).join(' · ')}
                  </div>
                </div>
              ))}
            </section>

            {/* Organisational Experience */}
            <section className="ats-section">
              <h4 className="ats-title">Organisational Experience</h4>
              {organizations.map((o) => (
                <div key={o.org} className="ats-entry">
                  <div className="ats-entry__head">
                    <strong className="ats-entry__title">{o.org}</strong>
                    <span className="ats-entry__date">{o.period}</span>
                  </div>
                  <div className="ats-entry__sub">
                    <em>{o.role}</em>
                  </div>
                  {o.desc && (
                    <ul className="ats-bullets">
                      <li>{o.desc}</li>
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Skills, Achievements & Other Experience */}
            <section className="ats-section">
              <h4 className="ats-title">Skills, Achievements & Other Experience</h4>
              <ul className="ats-bullets">
                {achievements.map((a) => (
                  <li key={a.title}>
                    <strong>Achievements ({a.year}):</strong> {a.title} di {a.event} ({a.organizer}).
                  </li>
                ))}
                <li>
                  <strong>Technical Skills:</strong> {skills.map((g) => g.items.join(', ')).join(', ')}.
                </li>
                <li>
                  <strong>Specializations:</strong> Frontend Architecture, Component-Driven UI, Responsive Design, Offline-First Architecture, Automated QA.
                </li>
              </ul>
            </section>
          </motion.article>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
