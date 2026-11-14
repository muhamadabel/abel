import { useEffect } from 'react'

// Isi --p (0..1) di tiap elemen `selector` di dalam ref sesuai jarak ke kursor.
// Hanya aktif di perangkat dengan mouse dan tanpa reduced motion.
export default function useProximity(ref, radius = 220, selector = '.plet') {
  useEffect(() => {
    const el = ref.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !fine || reduce) return

    const letters = [...el.querySelectorAll(selector)]
    let raf = 0

    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        for (const l of letters) {
          const b = l.getBoundingClientRect()
          const d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2))
          const p = Math.max(0, 1 - d / radius)
          l.style.setProperty('--p', (p * p * (3 - 2 * p)).toFixed(3))
        }
      })
    }
    const reset = () => letters.forEach((l) => l.style.setProperty('--p', '0'))

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', reset)
    }
  }, [ref, radius, selector])
}
