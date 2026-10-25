import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { achievements, contact, education, organizations, profile, projects, skills } from '../data/content'
import SectionHead from './SectionHead'
import Magnetic from './Magnetic'
import Toast, { copyText, useToast } from './Toast'

const githubUrl = contact.github.url.replace(/^https?:\/\//, '')
const linkedinUrl = contact.linkedin.url.replace(/^https?:\/\/(www\.)?/, '')

function Item({ title, right, sub, tags, children }) {
  return (
    <div className="cv-item">
      <div className="cv-item__head">
        <strong>{title}</strong>
        {right && <span className="cv-item__year">{right}</span>}
      </div>
      {sub && <p className="cv-item__sub">{sub}</p>}
      {children}
      {tags && tags.length > 0 && (
        <ul className="cv-tags">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Block({ title, children }) {
  return (
    <section className="cv-block">
      <h4 className="cv-block__title">{title}</h4>
      {children}
    </section>
  )
}

export default function CVPreview() {
  const [toast, showToast] = useToast()
  const paperRef = useRef(null)

  // Lembar CV sedikit rebah lalu tegak saat discroll masuk
  const { scrollYProgress } = useScroll({ target: paperRef, offset: ['start end', 'start 45%'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])
  const filter = useTransform(scrollYProgress, [0, 0.8], ['blur(6px)', 'blur(0px)'])

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
          <motion.article ref={paperRef} className="cv-paper" style={{ rotateX, scale, y, filter }}>
            <header className="cv-header">
              <div>
                <h3 className="cv-name">{profile.name}</h3>
                <p className="cv-role">{profile.role}</p>
                <p className="cv-program">
                  {education[0].program}, {education[0].school}
                </p>
              </div>
              <ul className="cv-contact">
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
                <li>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </li>
                <li>
                  <a href={contact.github.url} target="_blank" rel="noreferrer">
                    {githubUrl}
                  </a>
                </li>
                <li>
                  <a href={contact.linkedin.url} target="_blank" rel="noreferrer">
                    {linkedinUrl}
                  </a>
                </li>
                <li>{profile.address}</li>
              </ul>
            </header>

            <div className="cv-body">
              <div className="cv-col">
                <Block title="Pendidikan">
                  {education.map((e) => (
                    <Item
                      key={e.school}
                      title={e.school}
                      right={e.period}
                      sub={[e.faculty, e.program].filter(Boolean).join(', ')}
                      tags={e.degree ? [e.degree] : null}
                    />
                  ))}
                </Block>

                <Block title="Pengalaman">
                  {organizations.map((o) => (
                    <Item key={o.org} title={o.role} right={o.period} sub={o.org} tags={[o.tag]}>
                      {o.desc && <p className="cv-item__desc">{o.desc}</p>}
                    </Item>
                  ))}
                </Block>

                <Block title="Pencapaian">
                  {achievements.map((a) => (
                    <Item key={a.event} title={a.title} right={a.year} sub={`${a.event}, ${a.organizer}`} />
                  ))}
                </Block>
              </div>

              <div className="cv-col">
                <Block title="Proyek">
                  {projects.map((p) => (
                    <Item key={p.id} title={p.title} right={p.year} sub={`${p.category}, ${p.role}`} tags={p.stack}>
                      <p className="cv-item__desc">{p.desc}</p>
                    </Item>
                  ))}
                </Block>

                <Block title="Keahlian">
                  {skills.map((g) => (
                    <div key={g.group} className="cv-skill">
                      <strong>{g.group}</strong>
                      <span>{g.items.join(', ')}</span>
                    </div>
                  ))}
                </Block>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
      <Toast message={toast} />
    </section>
  )
}
