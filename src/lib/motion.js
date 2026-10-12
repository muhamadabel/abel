// =============================================================
//  MOTION PRESETS - Framer Motion
//  Smooth natural spring physics matching hallojanu.xyz standards.
// =============================================================

export const ease = [0.25, 0.46, 0.45, 0.94]

export const springCard = { type: 'spring', stiffness: 120, damping: 18 }
export const springTilt = { stiffness: 200, damping: 20 }
export const springMagnet = { stiffness: 300, damping: 20 }
export const springMagnetic = { stiffness: 300, damping: 20 }
export const springSnappy = { type: 'spring', stiffness: 500, damping: 30 }
export const springSoft = { type: 'spring', stiffness: 200, damping: 22, mass: 0.8 }
export const springBar = { type: 'spring', stiffness: 160, damping: 14 }

export const viewportOnce = { once: true, margin: '-80px' }

export const headingReveal = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const cardReveal = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
}

export const rowReveal = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
}

export const chipReveal = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: springSnappy },
}

export const wordReveal = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { type: 'spring', stiffness: 100, damping: 16 } },
}

export const blurUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}
