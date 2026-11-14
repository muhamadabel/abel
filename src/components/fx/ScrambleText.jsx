import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const DURATION = 420

// Teks diacak lalu tersusun kembali dari kiri ke kanan saat elemen induknya di-hover.
export default function ScrambleText({ text, className }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(text)

  useEffect(() => {
    const host = ref.current?.closest('a, button') ?? ref.current
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0

    const run = () => {
      cancelAnimationFrame(raf)
      const t0 = performance.now()
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / DURATION)
        const settled = Math.floor(k * text.length)
        setShown(
          [...text]
            .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(''),
        )
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    host.addEventListener('mouseenter', run)
    host.addEventListener('focus', run)
    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('mouseenter', run)
      host.removeEventListener('focus', run)
    }
  }, [text])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}
