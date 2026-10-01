import Reveal from './Reveal'
import { repos, contact } from '../data/content'

// Warna dot bahasa ala GitHub
const LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  PHP: '#4f5d95',
  Kotlin: '#a97bff',
  Java: '#b07219',
  HTML: '#e34c26',
  Blade: '#f7523f',
  PLpgSQL: '#336791',
}

export default function Archive() {
  return (
    <section id="archive" className="section section--line">
      <div className="container">
        <div className="section-head">
          <span className="section-index">04 / Arsip</span>
          <h2 className="section-title">Arsip GitHub</h2>
        </div>

        <div className="archive__grid">
          {repos.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.04}>
              <a
                className="repo-card"
                href={r.url}
                target="_blank"
                rel="noreferrer"
                data-hover
              >
                <div className="repo-card__top">
                  <span className="repo-card__icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.249.249 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25Z" />
                    </svg>
                  </span>
                  <span className="repo-card__arrow" aria-hidden="true">↗</span>
                </div>
                <h3 className="repo-card__name">{r.name}</h3>
                <p className="repo-card__desc">{r.desc}</p>
                <span className="repo-card__lang">
                  <span
                    className="repo-card__dot"
                    style={{ background: LANG_COLORS[r.lang] || 'var(--muted)' }}
                  />
                  {r.lang}
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="archive__more">
          <a
            className="btn btn--ghost"
            href={contact.github.url + '?tab=repositories'}
            target="_blank"
            rel="noreferrer"
            data-hover
          >
            Lihat semua di GitHub <span className="arrow">↗</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
