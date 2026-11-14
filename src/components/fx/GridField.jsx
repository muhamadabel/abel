import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Grid tipis 72px (sama dengan latar awal) yang hidup: garis melengkung menjauhi kursor
// seperti lensa, kotak yang dilewati menyala lalu memudar, dan klik memicu riak.
const CELL = 72
const STEP = 12
const RADIUS = 190
const BULGE = 26
const RIPPLE_SPEED = 0.9
const RIPPLE_WIDTH = 46
const RIPPLE_AMP = 14

function palette() {
  const css = getComputedStyle(document.documentElement)
  return {
    line: css.getPropertyValue('--line').trim() || '#e6e6e8',
    accent: css.getPropertyValue('--accent').trim() || '#b64400',
  }
}

export default function GridField({ className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const cvs = ref.current
    const c = cvs?.getContext('2d')
    if (!c) return

    let W = 0
    let H = 0
    let cols = 0
    let rows = 0
    let glow = new Float32Array(0)
    let colors = palette()
    let raf = 0
    let visible = true
    const target = { x: -9999, y: -9999, in: false }
    const m = { x: -9999, y: -9999, k: 0 }
    const ripples = []

    // Pergeseran satu titik grid: lensa di sekitar kursor + gelombang riak.
    const shift = (x, y, now) => {
      let dx = 0
      let dy = 0
      if (m.k > 0.001) {
        const ox = x - m.x
        const oy = y - m.y
        const d = Math.hypot(ox, oy)
        if (d < RADIUS && d > 0.01) {
          const f = (1 - d / RADIUS) ** 2 * BULGE * m.k
          dx += (ox / d) * f
          dy += (oy / d) * f
        }
      }
      for (const r of ripples) {
        const ox = x - r.x
        const oy = y - r.y
        const d = Math.hypot(ox, oy)
        const front = (now - r.t) * RIPPLE_SPEED
        const g = Math.exp(-(((d - front) / RIPPLE_WIDTH) ** 2))
        if (g > 0.01 && d > 0.01) {
          const a = g * RIPPLE_AMP * Math.max(0, 1 - front / 900)
          dx += (ox / d) * a
          dy += (oy / d) * a
        }
      }
      return [x + dx, y + dy]
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = cvs.offsetWidth
      H = cvs.offsetHeight
      cvs.width = W * dpr
      cvs.height = H * dpr
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(W / CELL) + 1
      rows = Math.ceil(H / CELL) + 1
      glow = new Float32Array(cols * rows)
      draw(performance.now(), true)
    }

    const gridPath = (now) => {
      c.beginPath()
      for (let i = 0; i <= cols; i++) {
        const x = i * CELL
        for (let y = 0; y <= H + STEP; y += STEP) {
          const [px, py] = shift(x, y, now)
          y === 0 ? c.moveTo(px, py) : c.lineTo(px, py)
        }
      }
      for (let j = 0; j <= rows; j++) {
        const y = j * CELL
        for (let x = 0; x <= W + STEP; x += STEP) {
          const [px, py] = shift(x, y, now)
          x === 0 ? c.moveTo(px, py) : c.lineTo(px, py)
        }
      }
    }

    const draw = (now, once = false) => {
      raf = 0
      m.x += (target.x - m.x) * 0.16
      m.y += (target.y - m.y) * 0.16
      m.k += ((target.in && !reduce ? 1 : 0) - m.k) * 0.08
      for (let i = ripples.length - 1; i >= 0; i--) {
        if ((now - ripples[i].t) * RIPPLE_SPEED > 900) ripples.splice(i, 1)
      }

      c.clearRect(0, 0, W, H)

      // Kotak yang dilewati kursor menyala, lalu memudar.
      let lit = false
      c.fillStyle = colors.accent
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i
          const cx = i * CELL + CELL / 2
          const cy = j * CELL + CELL / 2
          const d = Math.hypot(cx - m.x, cy - m.y)
          const want = m.k * Math.max(0, 1 - d / (RADIUS * 0.75))
          glow[idx] = Math.max(glow[idx] * 0.955, want)
          if (glow[idx] < 0.01) continue
          lit = true
          const [ax, ay] = shift(i * CELL, j * CELL, now)
          const [bx, by] = shift((i + 1) * CELL, j * CELL, now)
          const [qx, qy] = shift((i + 1) * CELL, (j + 1) * CELL, now)
          const [dx, dy] = shift(i * CELL, (j + 1) * CELL, now)
          c.globalAlpha = glow[idx] * 0.1
          c.beginPath()
          c.moveTo(ax, ay)
          c.lineTo(bx, by)
          c.lineTo(qx, qy)
          c.lineTo(dx, dy)
          c.closePath()
          c.fill()
        }
      }

      gridPath(now)
      c.globalAlpha = 0.8
      c.lineWidth = 1
      c.strokeStyle = colors.line
      c.stroke()

      // Gelombang riak ikut mewarnai garis yang dilewati.
      for (const r of ripples) {
        const front = (now - r.t) * RIPPLE_SPEED
        const inner = Math.max(0, front - RIPPLE_WIDTH * 1.5)
        const g = c.createRadialGradient(r.x, r.y, inner, r.x, r.y, front + RIPPLE_WIDTH * 1.5)
        g.addColorStop(0, 'transparent')
        g.addColorStop(0.5, colors.accent)
        g.addColorStop(1, 'transparent')
        c.globalAlpha = 0.85 * Math.max(0, 1 - front / 900)
        c.strokeStyle = g
        c.stroke()
      }

      if (m.k > 0.01) {
        const g = c.createRadialGradient(m.x, m.y, 0, m.x, m.y, RADIUS)
        g.addColorStop(0, colors.accent)
        g.addColorStop(1, 'transparent')
        c.globalAlpha = 0.55 * m.k
        c.strokeStyle = g
        c.stroke()
      }
      c.globalAlpha = 1

      const moving =
        Math.abs(target.x - m.x) > 0.3 || Math.abs(target.y - m.y) > 0.3 || (target.in ? m.k < 0.99 : m.k > 0.01)
      if (!once && (moving || lit || ripples.length || target.in)) start()
    }

    function start() {
      if (!raf && !reduce && visible && !document.hidden) raf = requestAnimationFrame((t) => draw(t))
    }

    const onMove = (e) => {
      const b = cvs.getBoundingClientRect()
      target.x = e.clientX - b.left
      target.y = e.clientY - b.top
      target.in = target.x >= 0 && target.y >= 0 && target.x <= b.width && target.y <= b.height
      if (m.k < 0.01 && target.in) {
        m.x = target.x
        m.y = target.y
      }
      start()
    }
    const onDown = (e) => {
      const b = cvs.getBoundingClientRect()
      const x = e.clientX - b.left
      const y = e.clientY - b.top
      if (x < 0 || y < 0 || x > b.width || y > b.height) return
      ripples.push({ x, y, t: performance.now() })
      start()
    }
    const onLeave = () => {
      target.in = false
      start()
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? true
      start()
    })
    const ro = new ResizeObserver(resize)
    const mo = new MutationObserver(() => {
      colors = palette()
      draw(performance.now(), true)
    })

    io.observe(cvs)
    ro.observe(cvs)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', start)
    resize()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', start)
    }
  }, [reduce])

  return <canvas ref={ref} className={className} aria-hidden="true" />
}
