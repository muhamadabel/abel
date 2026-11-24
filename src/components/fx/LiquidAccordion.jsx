import { useId, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'

const smoothEase = [0.22, 1, 0.36, 1]
const hoverSpring = { type: 'spring', stiffness: 420, damping: 36 }
const dropletSpring = { type: 'spring', stiffness: 360, damping: 22 }

/**
 * Apple iOS 26 Liquid Glass Accordion (120fps GPU smooth).
 * Mempertahankan estetika Liquid Glass prismatik (tepi pelangi optik, kilau kubah kaca basah,
 * riak air saat diklik, dan ikon tetesan kaca 3D) dengan animasi Framer Motion super halus.
 */
export default function LiquidAccordion({ items = [], defaultOpen = 0, className = '' }) {
  const [current, setCurrent] = useState(defaultOpen)
  const [hovered, setHovered] = useState(null)
  const [ripple, setRipple] = useState(null)
  const uid = useId().replace(/:/g, '')
  const rootRef = useRef(null)
  const itemRefs = useRef([])
  const btnRefs = useRef([])
  const reduceMotion = useReducedMotion()

  const toggle = (i, e) => {
    const next = current === i ? null : i
    if (next !== null && !reduceMotion && e?.clientX) {
      const el = itemRefs.current[i]
      if (el) {
        const r = el.getBoundingClientRect()
        setRipple({
          idx: i,
          id: Date.now(),
          x: e.clientX - r.left,
          y: e.clientY - r.top,
        })
      }
    }
    setCurrent(next)
  }

  const onPointerMove = (e) => {
    if (reduceMotion || e.pointerType !== 'mouse' || !rootRef.current) return
    const r = rootRef.current.getBoundingClientRect()
    rootRef.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    rootRef.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const onKeyDown = (e, i) => {
    const n = items.length
    let j = -1
    if (e.key === 'ArrowDown') j = (i + 1) % n
    else if (e.key === 'ArrowUp') j = (i - 1 + n) % n
    else if (e.key === 'Home') j = 0
    else if (e.key === 'End') j = n - 1
    if (j < 0) return
    e.preventDefault()
    btnRefs.current[j]?.focus()
  }

  return (
    <LayoutGroup id={uid}>
      <div
        ref={rootRef}
        className={`lacc ${className}`.trim()}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHovered(null)}
      >
        {items.map((it, i) => {
          const isOpen = current === i
          const isHover = hovered === i && !isOpen
          const base = `${uid}-${it.key ?? i}`

          return (
            <div
              key={it.key ?? i}
              ref={(el) => (itemRefs.current[i] = el)}
              className="lacc__item"
              data-open={isOpen}
              onPointerEnter={() => setHovered(i)}
            >
              {isHover && (
                <motion.span
                  className="lacc__hover"
                  layoutId={`lacc-hover-${uid}`}
                  transition={reduceMotion ? { duration: 0 } : hoverSpring}
                  aria-hidden="true"
                />
              )}

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span
                    className="lacc__active"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.34, ease: smoothEase }}
                    aria-hidden="true"
                  >
                    {ripple && ripple.idx === i && (
                      <motion.span
                        key={ripple.id}
                        className="lacc__ripple"
                        style={{ left: ripple.x, top: ripple.y }}
                        initial={{ scale: 0, opacity: 0.55 }}
                        animate={{ scale: 3.6, opacity: 0 }}
                        transition={{ duration: 0.72, ease: smoothEase }}
                      />
                    )}
                  </motion.span>
                )}
              </AnimatePresence>

              <h4 className="lacc__h">
                <button
                  ref={(el) => (btnRefs.current[i] = el)}
                  type="button"
                  id={`${base}-q`}
                  className="lacc__q"
                  aria-expanded={isOpen}
                  aria-controls={`${base}-a`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => toggle(i, e)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className="lacc__qt">
                    <span className="lacc__title">{it.title}</span>
                    <span className="lacc__sub">{it.sub}</span>
                  </span>
                  {it.tag && <span className="lacc__tag">{it.tag}</span>}
                  <motion.span
                    className="lacc__ico"
                    aria-hidden="true"
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            rotate: isOpen ? 180 : 0,
                            scale: isOpen ? [1, 1.14, 1] : 1,
                          }
                    }
                    transition={reduceMotion ? { duration: 0 } : dropletSpring}
                  />
                </button>
              </h4>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`${base}-a`}
                    role="region"
                    aria-labelledby={`${base}-q`}
                    className="lacc__panel"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            height: { duration: 0.38, ease: smoothEase },
                            opacity: { duration: 0.26, ease: smoothEase },
                          }
                    }
                  >
                    <motion.div
                      className="lacc__a"
                      initial={reduceMotion ? false : { y: -5 }}
                      animate={{ y: 0 }}
                      exit={reduceMotion ? undefined : { y: -3 }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: smoothEase }}
                    >
                      {it.desc}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
