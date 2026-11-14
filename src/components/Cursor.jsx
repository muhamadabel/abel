import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

// Bubble label yang mengikuti kursor di atas elemen ber-atribut data-cursor="Label".
export default function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.6 })
  const [label, setLabel] = useState(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const host = e.target.closest?.('[data-cursor]')
      setLabel(host ? host.getAttribute('data-cursor') : null)
    }
    const onLeave = () => setLabel(null)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  return (
    <motion.div className="cursor" style={{ x: sx, y: sy }} aria-hidden="true">
      <AnimatePresence>
        {label && (
          <motion.span
            key="bubble"
            className="cursor__bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
