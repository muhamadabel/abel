import { useEffect, useRef } from 'react'

/**
 * Tipografi partikel interaktif berbasis HTML5 Canvas 2D (gaya nbgate.com).
 * Partikel menyatu dari sebaran awal, bergetar halus, dan memencar melingkar
 * saat kursor atau sentuhan melintas sebelum memantul kembali ke posisi huruf.
 */
export default function ParticleText({ text, ready = true, className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const readyRef = useRef(ready)
  const releasedRef = useRef(false)

  readyRef.current = ready

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let particles = []
    let width = 0
    let height = 0
    let dpr = 1
    let rafId = 0
    let isVisible = true
    let isDark = document.documentElement.dataset.theme === 'dark'
    const pointer = { x: -9999, y: -9999, active: false }

    const getPalette = () =>
      isDark
        ? {
            base: [244, 246, 251],
            active: [96, 152, 255],
            alphaMin: 0.66,
            alphaSpan: 0.30,
          }
        : {
            base: [17, 18, 22],
            active: [35, 75, 255],
            alphaMin: 0.72,
            alphaSpan: 0.25,
          }

    const baseColorFor = (alphaRatio) => {
      const pal = getPalette()
      const a = (pal.alphaMin + alphaRatio * pal.alphaSpan).toFixed(2)
      return `rgba(${pal.base[0]}, ${pal.base[1]}, ${pal.base[2]}, ${a})`
    }

    const buildParticles = (scatterOnFirst = false) => {
      const rect = wrap.getBoundingClientRect()
      const cssW = Math.max(280, Math.round(rect.width))
      const compact = cssW < 560
      const cssH = compact
        ? Math.round(Math.min(188, Math.max(138, cssW * 0.42)))
        : Math.round(Math.min(176, Math.max(112, cssW * 0.145)))

      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.round(cssW * dpr)
      height = Math.round(cssH * dpr)

      canvas.width = width
      canvas.height = height
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`

      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const octx = off.getContext('2d')
      if (!octx) return

      octx.clearRect(0, 0, width, height)
      octx.fillStyle = '#000000'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'

      const fontFamily = `'Inter Tight', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif`

      if (compact) {
        const words = text.trim().split(/\s+/)
        const line1 = words[0] || text
        const line2 = words.slice(1).join(' ')
        let fontSize = Math.floor(height * 0.43)
        octx.font = `600 ${fontSize}px ${fontFamily}`
        const maxLineW = width * 0.94
        const measured = Math.max(octx.measureText(line1).width, octx.measureText(line2).width)
        if (measured > maxLineW) {
          fontSize = Math.floor(fontSize * (maxLineW / measured))
          octx.font = `600 ${fontSize}px ${fontFamily}`
        }
        if (line2) {
          octx.fillText(line1, width / 2, height * 0.30)
          octx.fillText(line2, width / 2, height * 0.72)
        } else {
          octx.fillText(line1, width / 2, height / 2)
        }
      } else {
        let fontSize = Math.floor(height * 0.78)
        octx.font = `600 ${fontSize}px ${fontFamily}`
        const maxW = width * 0.96
        const measured = octx.measureText(text).width
        if (measured > maxW) {
          fontSize = Math.floor(fontSize * (maxW / measured))
          octx.font = `600 ${fontSize}px ${fontFamily}`
        }
        octx.fillText(text, width / 2, height * 0.52)
      }

      const img = octx.getImageData(0, 0, width, height).data
      const step = Math.max(2, Math.round((compact ? 2.1 : 2.5) * dpr))
      const next = []
      let idx = 0

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const alpha = img[(y * width + x) * 4 + 3]
          if (alpha > 128) {
            const alphaRatio = Math.random()
            const startScattered = scatterOnFirst && !reducedMotion
            const sx = startScattered ? Math.random() * width : x
            const sy = startScattered ? Math.random() * height : y
            next.push({
              x: sx,
              y: sy,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              r: (compact ? 0.74 + Math.random() * 0.44 : 0.86 + Math.random() * 0.48) * dpr,
              idx,
              alphaRatio,
              heat: 0,
              color: baseColorFor(alphaRatio),
            })
            idx += 1
          }
        }
      }

      particles = next
      if (reducedMotion) drawStatic()
    }

    const recolor = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.color = baseColorFor(p.alphaRatio)
      }
      if (reducedMotion) drawStatic()
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.tx, p.ty, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = () => {
      rafId = requestAnimationFrame(tick)
      if (!isVisible) return

      ctx.clearRect(0, 0, width, height)
      const radius = 92 * dpr
      const radiusSq = radius * radius
      const active = pointer.active
      const px = pointer.x
      const py = pointer.y
      const canSettle = readyRef.current

      if (canSettle && !releasedRef.current) {
        releasedRef.current = true
      }

      const pal = getPalette()
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (active) {
          const dx = p.x - px
          const dy = p.y - py
          const d2 = dx * dx + dy * dy
          if (d2 < radiusSq && d2 > 0.001) {
            const dist = Math.sqrt(d2)
            const prox = (radius - dist) / radius
            const force = prox * 2.65 * dpr
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
            p.heat = Math.min(1, p.heat + prox * 0.55)
          }
        }

        if (canSettle) {
          p.vx += (p.tx - p.x) * 0.084
          p.vy += (p.ty - p.y) * 0.084
        } else {
          p.vx += (Math.random() - 0.5) * 0.25 * dpr
          p.vy += (Math.random() - 0.5) * 0.25 * dpr
        }

        p.vx *= 0.855
        p.vy *= 0.855
        p.heat *= 0.91
        p.x += p.vx + (Math.random() - 0.5) * 0.3 * dpr
        p.y += p.vy + (Math.random() - 0.5) * 0.3 * dpr

        if (p.heat > 0.03) {
          const h = p.heat
          const r = Math.round(pal.base[0] + (pal.active[0] - pal.base[0]) * h)
          const g = Math.round(pal.base[1] + (pal.active[1] - pal.base[1]) * h)
          const b = Math.round(pal.base[2] + (pal.active[2] - pal.base[2]) * h)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.82 + h * 0.16).toFixed(2)})`
        } else {
          ctx.fillStyle = p.color
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const updatePointer = (clientX, clientY) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = (clientX - r.left) * dpr
      pointer.y = (clientY - r.top) * dpr
      pointer.active = true
    }

    const onPointerMove = (e) => {
      if (reducedMotion) return
      updatePointer(e.clientX, e.clientY)
    }

    const onPointerLeave = () => {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    const onPointerDown = (e) => {
      if (reducedMotion) return
      const r = canvas.getBoundingClientRect()
      const cx = (e.clientX - r.left) * dpr
      const cy = (e.clientY - r.top) * dpr
      const burstR = 140 * dpr
      const burstRSq = burstR * burstR
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = p.x - cx
        const dy = p.y - cy
        const d2 = dx * dx + dy * dy
        if (d2 < burstRSq && d2 > 0.01) {
          const dist = Math.sqrt(d2)
          const impulse = ((burstR - dist) / burstR) * 14 * dpr
          p.vx += (dx / dist) * impulse
          p.vy += (dy / dist) * impulse
        }
      }
    }

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('pointerdown', onPointerDown)

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry ? entry.isIntersecting : true
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    const themeObs = new MutationObserver(() => {
      const nextDark = document.documentElement.dataset.theme === 'dark'
      if (nextDark !== isDark) {
        isDark = nextDark
        recolor()
      }
    })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => buildParticles(false), 180)
    }
    window.addEventListener('resize', onResize)

    let cancelled = false
    const start = () => {
      if (cancelled) return
      buildParticles(true)
      if (!reducedMotion) {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(tick)
      }
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start)
    } else {
      start()
    }

    return () => {
      cancelled = true
      clearTimeout(resizeTimer)
      cancelAnimationFrame(rafId)
      io.disconnect()
      themeObs.disconnect()
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerdown', onPointerDown)
    }
  }, [text])

  return (
    <div ref={wrapRef} className={`particle-title-wrap ${className}`.trim()}>
      <h1 className="sr-only">{text}</h1>
      <canvas ref={canvasRef} className="particle-title" aria-hidden="true" />
    </div>
  )
}
