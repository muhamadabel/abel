import Reveal from './Reveal'
import { repos, contact } from '../data/content'

export default function Archive() {
  return (
    <section id="archive" className="section section--line">
      <div className="container">
        <div className="section-head">
          <span className="section-index">[06 / ARSIP REPO]</span>
          <h2 className="section-title">Repositori Kode Terbuka</h2>
          <p className="section-desc">
            Pilihan kode sumber dan repositori publik di GitHub untuk eksplorasi modul antarmuka, pengujian sistem, dan rekayasa backend.
          </p>
        </div>

        <div className="archive__grid">
          {repos.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.05}>
              <a
                className="repo-card"
                href={r.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="repo-card__top">
                  <span className="repo-card__name">{r.name}</span>
                  <span className="repo-card__lang-tag">{r.lang}</span>
                </div>
                <p className="repo-card__desc">{r.desc}</p>
                <div className="repo-card__bottom">
                  <span className="repo-card__cta">Buka Repositori ↗</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="archive__more" delay={0.15}>
          <a
            className="btn btn--ghost"
            href={contact.github.url + '?tab=repositories'}
            target="_blank"
            rel="noreferrer"
          >
            Lihat Semua Repositori di GitHub
          </a>
        </Reveal>
      </div>
    </section>
  )
}
