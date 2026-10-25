// =============================================================
//  MOTION PRESETS - Framer Motion
//  Satu bahasa gerak: ease-out panjang untuk reveal, spring untuk interaksi.
// =============================================================

export const ease = [0.22, 1, 0.36, 1]

export const springCard = { type: 'spring', stiffness: 120, damping: 18 }
export const springTilt = { stiffness: 200, damping: 20 }
export const springBar = { type: 'spring', stiffness: 160, damping: 14 }
export const springMagnet = { stiffness: 300, damping: 20 }
export const springSnappy = { type: 'spring', stiffness: 500, damping: 30 }
export const springSoft = { type: 'spring', stiffness: 220, damping: 26, mass: 0.8 }

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' }

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
}

export const wordReveal = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { type: 'spring', stiffness: 100, damping: 16 } },
}

// Reveal blur-to-focus khas versi awal
export const cardReveal = {
  hidden: { opacity: 0, scale: 0.92, filter: 'blur(6px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}

export const rowReveal = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease } },
}

export const itemReveal = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease } },
}

export const blurUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease } },
}
