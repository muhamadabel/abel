import { useEffect, useRef } from 'react'
import { getParticleDpr, particleDotRadius, sampleParticleTitle } from '../../lib/particleLayout'

const TAU = Math.PI * 2
const BUCKETS = 4

/**
 * Tipografi partikel interaktif berbasis HTML5 Canvas 2D (gaya nbgate.com).
 * Saat preloader aktif, kanvas tersembunyi (masked) agar partikel dari preloader
 * bisa mendarat tepat subpiksel lalu langsung diambil alih secara interaktif tanpa kedip.
 */
export default function ParticleText({ text, ready = true, settledIntro = false, className = '' }) {
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
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    let particles = []
    let width = 0
    let height = 0
    let dpr = 1
    let isCompact = false
    let rafId = 0
    let isVisible = true
    let isDark = document.documentElement.dataset.theme === 'dark'
    let lastDrawAt = 0
    const pointer = { x: -9999, y: -9999, active: false }

    const baseBuckets = Array.from({ length: BUCKETS }, () => [])
    const heatBuckets = Array.from({ length: BUCKETS }, () => [])
    let baseStyles = []
    let heatStyles = []

    const rebuildStyles = () => {
      const pal = isDark
        ? { base: [244, 246, 251], active: [96, 152, 255], alphaMin: 0.66, alphaSpan: 0.3 }
        : { base: [17, 18, 22], active: [35, 75, 255], alphaMin: 0.72, alphaSpan: 0.25 }

      baseStyles = Array.from({ length: BUCKETS }, (_, b) => {
        const a = (pal.alphaMin + ((b + 0.5) / BUCKETS) * pal.alphaSpan).toFixed(2)
        return `rgba(${pal.base[0]},${pal.base[1]},${pal.base[2]},${a})`
      })
      heatStyles = Array.from({ length: BUCKETS }, (_, b) => {
        const h = (b + 0.6) / BUCKETS
        const r = Math.round(pal.base[0] + (pal.active[0] - pal.base[0]) * h)
        const g = Math.round(pal.base[1] + (pal.active[1] - pal.base[1]) * h)
        const bl = Math.round(pal.base[2] + (pal.active[2] - pal.base[2]) * h)
        return `rgba(${r},${g},${bl},${(0.82 + h * 0.16).toFixed(2)})`
      })
    }
    rebuildStyles()

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      for (let b = 0; b < BUCKETS; b++) baseBuckets[b].length = 0
      for (let i = 0; i < particles.length; i++) {
        baseBuckets[particles[i].bucket].push(particles[i])
      }
      for (let b = 0; b < BUCKETS; b++) {
        const list = baseBuckets[b]
        if (!list.length) continue
        ctx.fillStyle = baseStyles[b]
        ctx.beginPath()
        for (let i = 0; i < list.length; i++) {
          const p = list[i]
          ctx.moveTo(p.tx + p.r, p.ty)
          ctx.arc(p.tx, p.ty, p.r, 0, TAU)
        }
        ctx.fill()
      }
    }

    const buildParticles = (scatterOnFirst = false) => {
      const rect = wrap.getBoundingClientRect()
      dpr = getParticleDpr(window.innerWidth)
      const sampled = sampleParticleTitle(text, rect.width, dpr)
      width = sampled.width
      height = sampled.height
      isCompact = sampled.compact

      canvas.width = width
      canvas.height = height
      canvas.style.width = `${sampled.cssW}px`
      canvas.style.height = `${sampled.cssH}px`

      const startScattered = scatterOnFirst && !settledIntro && !reducedMotion
      const next = sampled.points.map((pt, idx) => {
        const alphaRatio = Math.random()
        const sx = startScattered ? Math.random() * width : pt.tx
        const sy = startScattered ? Math.random() * height : pt.ty
        return {
          x: sx,
          y: sy,
          tx: pt.tx,
          ty: pt.ty,
          vx: 0,
          vy: 0,
          r: particleDotRadius(sampled.compact, dpr),
          idx,
          bucket: Math.min(BUCKETS - 1, Math.floor(alphaRatio * BUCKETS)),
          heat: 0,
        }
      })

      particles = next
      drawStatic()
    }

    const tick = (now) => {
      rafId = requestAnimationFrame(tick)
      if (!isVisible || document.hidden) return
      // Jangan membakar CPU/GPU saat kanvas masih tertutup Preloader (frame statis sudah siap untuk handoff)
      if (!readyRef.current && settledIntro) return

      const active = pointer.active
      // Di layar mobile saat idle (tanpa sentuhan), cukup ~24fps untuk shimmer halus; langsung 60fps saat disentuh
      if ((isCoarse || isCompact) && !active && releasedRef.current) {
        if (now - lastDrawAt < 40) return
      }
      lastDrawAt = now

      ctx.clearRect(0, 0, width, height)
      const radius = 92 * dpr
      const radiusSq = radius * radius
      const px = pointer.x
      const py = pointer.y
      const canSettle = settledIntro || readyRef.current

      if (canSettle && !releasedRef.current) {
        releasedRef.current = true
      }

      for (let b = 0; b < BUCKETS; b++) {
        baseBuckets[b].length = 0
        heatBuckets[b].length = 0
      }

      let hasEnergy = active
      const jitter = 0.3 * dpr
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
        p.x += p.vx + (Math.random() - 0.5) * jitter
        p.y += p.vy + (Math.random() - 0.5) * jitter

        if (!hasEnergy && (Math.abs(p.vx) > 0.35 || Math.abs(p.vy) > 0.35)) {
          hasEnergy = true
        }

        if (p.heat > 0.03) {
          hasEnergy = true
          const hb = Math.min(BUCKETS - 1, Math.floor(p.heat * BUCKETS))
          heatBuckets[hb].push(p)
        } else {
          baseBuckets[p.bucket].push(p)
        }
      }

      if (hasEnergy) lastDrawAt = 0

      // Batch render: maksimal 4-8 fill() per frame (sebelumnya ~2.500-3.500 fill() per frame)
      for (let b = 0; b < BUCKETS; b++) {
        const list = baseBuckets[b]
        if (!list.length) continue
        ctx.fillStyle = baseStyles[b]
        ctx.beginPath()
        for (let i = 0; i < list.length; i++) {
          const p = list[i]
          ctx.moveTo(p.x + p.r, p.y)
          ctx.arc(p.x, p.y, p.r, 0, TAU)
        }
        ctx.fill()
      }

      for (let b = 0; b < BUCKETS; b++) {
        const list = heatBuckets[b]
        if (!list.length) continue
        ctx.fillStyle = heatStyles[b]
        ctx.beginPath()
        for (let i = 0; i < list.length; i++) {
          const p = list[i]
          ctx.moveTo(p.x + p.r, p.y)
          ctx.arc(p.x, p.y, p.r, 0, TAU)
        }
        ctx.fill()
      }
    }

    const updatePointer = (clientX, clientY) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = (clientX - r.left) * dpr
      pointer.y = (clientY - r.top) * dpr
      pointer.active = true
      lastDrawAt = 0
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
      lastDrawAt = 0
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

    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true })

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
        rebuildStyles()
        if (reducedMotion || (!readyRef.current && settledIntro)) drawStatic()
      }
    })
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => buildParticles(false), 180)
    }
    window.addEventListener('resize', onResize, { passive: true })

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
  }, [text, settledIntro])

  return (
    <div ref={wrapRef} className={`particle-title-wrap${ready ? '' : ' particle-title-wrap--masked'} ${className}`.trim()}>
      <h1 className="sr-only">{text}</h1>
      <canvas ref={canvasRef} className="particle-title" aria-hidden="true" />
    </div>
  )
}
