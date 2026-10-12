import Reveal from './Reveal'
import { profile, education, contact } from '../data/content'

const specs = [
  { label: 'Institusi', value: education.school },
  { label: 'Program Studi', value: education.program },
  { label: 'Jenjang & Fakultas', value: `${education.degree} · ${education.faculty}` },
  { label: 'Kohort', value: `Angkatan ${profile.cohort}` },
  { label: 'Domisili', value: contact.location },
  { label: 'Spesialisasi', value: 'Front End Architecture, Web Apps, Mobile Systems' },
]

export default function About() {
  return (
    <section id="about" className="section section--line">
      <div className="container">
        <div className="section-head">
          <span className="section-index">[05 / PROFIL]</span>
          <h2 className="section-title">Profil & Pendekatan Rekayasa</h2>
          <p className="section-desc">
            Prinsip perancangan perangkat lunak yang berakar pada kejelasan fungsi, pemisahan tanggung jawab kode yang tegas, dan pengalaman pengguna yang efisien.
          </p>
        </div>

        <div className="about__grid">
          <div className="about__bio">
            {profile.bio.map((para, i) => (
              <Reveal as="p" key={i} delay={i * 0.08} className="about__para">
                {para}
              </Reveal>
            ))}
          </div>

          <Reveal className="about__facts" delay={0.12}>
            <div className="specs-card">
              <span className="specs-card__title">DATA KUALIFIKASI AKADEMIK</span>
              <dl className="specs-list">
                {specs.map((item) => (
                  <div key={item.label} className="spec-row">
                    <dt className="spec-label">{item.label}</dt>
                    <dd className="spec-value">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
