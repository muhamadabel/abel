import { useRef } from 'react'
import { useAnimationFrame, useReducedMotion } from 'framer-motion'
import { affiliations } from '../data/content'

export default function TechMarquee() {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const xRef = useRef(0)
  const reduceMotion = useReducedMotion()

  useAnimationFrame((_, delta) => {
    if (reduceMotion || pausedRef.current || !trackRef.current) return
    const groupW = trackRef.current.firstElementChild?.offsetWidth || 0
    if (!groupW) return
    xRef.current -= Math.min(delta, 40) * 0.038
    if (xRef.current <= -groupW) xRef.current += groupW
    trackRef.current.style.transform = `translate3d(${xRef.current.toFixed(2)}px,0,0)`
  })

  return (
    <section
      className="lmarq no-print"
      aria-label="Institusi, organisasi, dan mitra kolaborasi"
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
    >
      <div className="lmarq__track" ref={trackRef}>
        {[0, 1].map((dup) => (
          <div className="lmarq__group" key={dup} aria-hidden={dup === 1}>
            {affiliations.map((item) => (
              <div className="lmarq__item" key={`${dup}-${item.id}`} title={item.name}>
                {item.kind === 'lockup' ? (
                  <div className="lmarq__lockup">
                    <img
                      src={item.logo}
                      alt={dup === 0 ? item.name : ''}
                      className="lmarq__img lmarq__img--emblem"
                      loading="eager"
                      draggable="false"
                    />
                    <span className="lmarq__text">
                      <strong>{item.label}</strong>
                      <span>{item.sub}</span>
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.logo}
                    alt={dup === 0 ? item.name : ''}
                    className="lmarq__img lmarq__img--wordmark"
                    style={item.scale ? { '--logo-scale': item.scale } : undefined}
                    loading="eager"
                    draggable="false"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
