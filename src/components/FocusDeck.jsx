import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { projects } from '../data/content'

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// Matematika 3D Tilt-Stacking adaptasi 21st.dev id:44650 (kedhareswer/tilt-stack-scroll)
function pose(p, i, reduced) {
  const enter = i === 0 ? 1 : clamp(p - (i - 1), 0, 1)
  const depth = clamp(p - i, 0, 2.5)
  if (reduced) {
    return { y: 0, scale: 1, rx: 0, rz: 0, shade: Math.min(depth, 1) * 0.35, opacity: enter >= 1 ? 1 : enter }
  }
  const e = easeOut(enter)
  return {
    y: (1 - e) * 116 - depth * 3.2,
    scale: (1 - depth * 0.055) * (0.92 + 0.08 * e),
    rx: (1 - e) * 16 - depth * 7,
    rz: (1 - e) * (i % 2 ? 3 : -3),
    shade: Math.min(depth, 2) * 0.22,
    opacity: depth > 2.2 ? clamp((2.6 - depth) / 0.4, 0, 1) : 1,
  }
}

const toTransform = (q) =>
  `translate3d(0,${q.y.toFixed(3)}%,0) perspective(1400px) rotateX(${q.rx.toFixed(3)}deg) rotateZ(${q.rz.toFixed(3)}deg) scale(${q.scale.toFixed(4)})`

const cards = [
  {
    id: 'frontend',
    tone: 'blue',
    title: 'Web & Front End',
    desc: 'Antarmuka web yang cepat, presisi, dan responsif dari sistem desain hingga kode produksi.',
    previews: [projects[0], projects[1]].filter(Boolean),
  },
  {
    id: 'fullstack',
    tone: 'dark',
    title: 'Full-Stack & Data',
    desc: 'Arsitektur aplikasi end-to-end dengan autentikasi aman, integrasi API, dan basis data terstruktur.',
    previews: [projects[2], projects[3]].filter(Boolean),
  },
  {
    id: 'mobile-qa',
    tone: 'light',
    title: 'Mobile & Quality',
    desc: 'Pengembangan aplikasi mobile lintas platform yang ringan dengan alur pengujian terotomasi.',
    previews: [projects[4], projects[6]].filter(Boolean),
  },
]

export default function FocusDeck() {
  const trackRef = useRef(null)
  const cardEls = useRef([])
  const shadeEls = useRef([])
  const stepEls = useRef([])
  const reduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 900px)').matches : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const n = cards.length

  const paint = (progress) => {
    if (!isDesktop) return
    const p = clamp(progress, 0, 1) * (n - 1)
    for (let i = 0; i < n; i++) {
      const el = cardEls.current[i]
      if (!el) continue
      const q = pose(p, i, reduceMotion)
      el.style.transform = toTransform(q)
      el.style.opacity = String(q.opacity)
      const sh = shadeEls.current[i]
      if (sh) sh.style.opacity = String(q.shade)
    }
    const active = Math.round(p)
    stepEls.current.forEach((dot, idx) => {
      if (!dot) return
      dot.dataset.active = idx === active ? 'true' : 'false'
    })
  }

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    paint(v)
  })

  useEffect(() => {
    if (!isDesktop) {
      cardEls.current.forEach((el) => {
        if (!el) return
        el.style.transform = ''
        el.style.opacity = ''
      })
      shadeEls.current.forEach((sh) => {
        if (sh) sh.style.opacity = '0'
      })
      return
    }
    paint(scrollYProgress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, reduceMotion])

  return (
    <section
      id="focus"
      ref={trackRef}
      className={`fdeck-track${isDesktop ? ' is-sticky' : ''}`}
      style={isDesktop ? { height: `calc(100svh * ${n - 0.35})` } : undefined}
      aria-label="Fokus keahlian"
    >
      <div className="fdeck-stage">
        <div className="container fdeck-shell">
          <header className="fdeck-head">
            <h2 className="section-title">Fokus</h2>

            {isDesktop && (
              <div className="fdeck-steps" aria-hidden="true">
                {cards.map((c, idx) => (
                  <span
                    key={c.id}
                    ref={(el) => (stepEls.current[idx] = el)}
                    className="fdeck-step"
                    data-active={idx === 0 ? 'true' : 'false'}
                  />
                ))}
              </div>
            )}
          </header>

          <div className="fdeck-cards">
            {cards.map((card, i) => (
              <article
                key={card.id}
                ref={(el) => (cardEls.current[i] = el)}
                className={`fcard fcard--${card.tone}`}
                style={isDesktop ? { zIndex: i + 1 } : undefined}
              >
                <div className="fcard__shade" ref={(el) => (shadeEls.current[i] = el)} aria-hidden="true" />

                <div className="fcard__grid">
                  {/* Kiri: tipografi judul dan deskripsi bersih tanpa daftar ekstra */}
                  <div className="fcard__left">
                    <div className="fcard__copy">
                      <h3 className="fcard__title">{card.title}</h3>
                      <p className="fcard__desc">{card.desc}</p>
                    </div>
                  </div>

                  {/* Kanan: panggung visual dua screenshot bersih berlapis 3D tanpa badge penutup */}
                  <div className="fcard__visual">
                    {card.previews[1] && (
                      <a
                        href={card.previews[1].live || card.previews[1].repo}
                        target="_blank"
                        rel="noreferrer"
                        className="fcard__frame fcard__frame--back"
                        data-cursor="Buka"
                        aria-label={`Buka proyek ${card.previews[1].title}`}
                      >
                        <img src={card.previews[1].image} alt={card.previews[1].title} loading="lazy" draggable="false" />
                      </a>
                    )}
                    {card.previews[0] && (
                      <a
                        href={card.previews[0].live || card.previews[0].repo}
                        target="_blank"
                        rel="noreferrer"
                        className="fcard__frame fcard__frame--main"
                        data-cursor="Buka"
                        aria-label={`Buka proyek ${card.previews[0].title}`}
                      >
                        <img src={card.previews[0].image} alt={card.previews[0].title} loading="lazy" draggable="false" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
