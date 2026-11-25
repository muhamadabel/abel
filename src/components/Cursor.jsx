import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'

function FineCursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.6 })
  const [label, setLabel] = useState(null)

  useEffect(() => {
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || window.innerWidth < 768) {
        setLabel(null)
        return
      }
      x.set(e.clientX)
      y.set(e.clientY)
      const host = e.target.closest?.('[data-cursor]')
      setLabel(host ? host.getAttribute('data-cursor') : null)
    }
    const onLeave = () => setLabel(null)
    const onResize = () => {
      if (window.innerWidth < 768) setLabel(null)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
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

// Bubble label yang mengikuti kursor di atas elemen ber-atribut data-cursor="Label".
// Tidak dipasang sama sekali di perangkat sentuh agar nol beban spring dan DOM di HP.
export default function Cursor() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  if (!fine) return null
  return <FineCursor />
}
