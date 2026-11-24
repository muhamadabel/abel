import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { profile, projects } from '../data/content'

const nameParts = profile.display.trim().split(/\s+/)
const leftWord = nameParts[0] || profile.display
const rightWord = nameParts.length > 1 ? `${nameParts.slice(1).join(' ')}.` : ''

// Distribusi lintang 3D supaya 8 proyek membentuk bola/globe utuh, namun 3 kartu utama tetap harmonis saat membuka
const LATITUDES = [0.0, 0.34, -0.36, 0.42, -0.40, 0.36, -0.34, 0.0]

function wrap(i, n) {
  return n > 0 ? ((i % n) + n) % n : 0
}

function offsetOf(i, pos, n) {
  if (n <= 0) return 0
  return wrap(i - pos + n / 2, n) - n / 2
}

// Identik dengan CurvedProjectLens.jsx agar handoff ke Hero tepat hingga subpiksel
function heroCardSize(w, h) {
  const isMobile = w < 640
  const maxW = isMobile ? w * 0.78 : Math.min(w * 0.36, 480)
  const cw = Math.min(maxW, h * 1.12)
  const ch = cw * 0.625
  return [Math.round(cw), Math.round(ch)]
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeInOutQuart = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2)

const VERT = `
attribute vec2 aPos;
uniform vec2 uScreen;
uniform vec2 uTargetCenter;
uniform vec2 uTargetSize;
uniform vec2 uHeroCard;
uniform float uHeroX;
uniform float uBend;

uniform float uLon;
uniform float uLat;
uniform float uGlobeR;
uniform vec2 uPatchAng;
uniform float uMorph;
uniform float uIntro;

varying vec2 vUv;
varying float vX;
varying float vDepth;
varying float vMorph;

void main() {
  // 1. Posisi 3D melengkung pada permukaan bola/globe (muter ke kanan)
  float lon = uLon + (aPos.x - 0.5) * uPatchAng.x;
  float lat = uLat + (aPos.y - 0.5) * uPatchAng.y;
  float cLat = cos(lat);
  vec3 sp = vec3(
    cLat * sin(lon),
    sin(lat),
    cLat * cos(lon)
  ) * (uGlobeR * mix(0.76, 1.0, uIntro));

  // Kemiringan poros globe elegan (tilt X + sedikit tilt Z)
  float ax = 0.20;
  float az = -0.14;
  float cx = cos(ax), sx = sin(ax);
  float cz = cos(az), sz = sin(az);
  vec3 r1 = vec3(sp.x, sp.y * cx - sp.z * sx, sp.y * sx + sp.z * cx);
  vec3 r2 = vec3(r1.x * cz - r1.y * sz, r1.x * sz + r1.y * cz, r1.z);

  float camZ = uGlobeR * 2.85;
  float persp = camZ / max(40.0, camZ - r2.z);
  vec2 globeNdc = (r2.xy * persp) / (uScreen * 0.5);

  // 2. Posisi target tepat di dalam kanvas CurvedProjectLens Hero
  vec2 hp = vec2(uHeroX + (aPos.x - 0.5) * uHeroCard.x, (aPos.y - 0.5) * uHeroCard.y);
  vec2 hn = hp / (uTargetSize * 0.5);
  float hx = clamp(hn.x, -1.45, 1.45);
  hn.y *= 1.0 + uBend * hx * hx;
  hn.x *= 1.0 - 0.07 * uBend * hx * hx;
  vec2 heroPx = uTargetCenter + hn * (uTargetSize * 0.5);
  vec2 heroNdc = heroPx / (uScreen * 0.5);

  // 3. Interpolasi mulus dari permukaan globe 3D langsung ke posisi panorama Hero
  vec2 finalNdc = mix(globeNdc, heroNdc, uMorph);

  vUv = aPos;
  vX = hx;
  vDepth = clamp((r2.z / max(1.0, uGlobeR)) * 0.5 + 0.5, 0.0, 1.0);
  vMorph = uMorph;

  gl_Position = vec4(finalNdc, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uSize;
uniform float uAspect;
uniform float uShift;
uniform float uReady;
uniform float uDark;
uniform float uIntro;
uniform float uSpinVel;

varying vec2 vUv;
varying float vX;
varying float vDepth;
varying float vMorph;

float sdRoundBox(vec2 q, vec2 b, float r) {
  vec2 d = abs(q) - b + r;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

void main() {
  float a = uSize.x / uSize.y;
  vec2 uv = vUv - 0.5;
  if (uAspect > a) {
    uv.x *= a / uAspect;
  } else {
    float scaleY = uAspect / a;
    uv.y = (uv.y - 0.5) * scaleY + 0.5;
  }
  uv = uv / 1.03 + 0.5;
  uv.x = clamp(uv.x + uShift * vMorph, 0.002, 0.998);
  uv.y = clamp(uv.y, 0.002, 0.998);

  float ca = mix(0.0018 + uSpinVel * 0.0025, 0.0006 + 0.0036 * vX * vX, vMorph);
  vec3 img = vec3(
    texture2D(uTex, vec2(clamp(uv.x + ca, 0.002, 0.998), uv.y)).r,
    texture2D(uTex, uv).g,
    texture2D(uTex, vec2(clamp(uv.x - ca, 0.002, 0.998), uv.y)).b
  );
  vec3 ph = mix(vec3(0.95, 0.96, 0.98), vec3(0.09, 0.10, 0.13), uDark);
  vec3 c = mix(ph, img, uReady);

  // Kedalaman ruang: belakang globe meredup lembut -> mulus menyatu ke fade tepi panorama Hero
  float globeAtten = 1.0 - vDepth;
  float heroFade = min(1.0, vX * vX);
  if (uDark > 0.5) {
    float dim = mix(0.54 * globeAtten, 0.40 * heroFade, vMorph);
    c *= 1.0 - dim;
  } else {
    float mist = mix(0.42 * globeAtten, 0.28 * heroFade, vMorph);
    c = mix(c, vec3(0.96, 0.972, 0.99), mist);
  }

  float radius = min(20.0, min(uSize.x, uSize.y) * 0.085);
  float d = sdRoundBox((vUv - 0.5) * uSize, uSize * 0.5, radius);

  float outerBorder = smoothstep(-2.2, -0.35, d) * smoothstep(0.6, -0.6, d);
  float innerRim = smoothstep(-6.0, -0.8, d) * smoothstep(0.4, -0.8, d);
  vec3 borderCol = mix(vec3(0.80, 0.84, 0.90), vec3(1.0, 1.0, 1.0), 0.58 - 0.34 * uDark);
  c = mix(c, borderCol, outerBorder * (uDark > 0.5 ? 0.42 : 0.78));
  c += innerRim * (uDark > 0.5 ? 0.08 : 0.07);

  float sheen = smoothstep(0.76, 1.0, vUv.y) * mix(vDepth, 1.0 - min(1.0, abs(vX) * 1.15), vMorph);
  c += sheen * (uDark > 0.5 ? 0.055 : 0.04);

  // Kartu sisi belakang globe sedikit transparan agar terasa seperti bola kaca 3D, lalu solid saat membuka
  float depthAlpha = mix(0.38 + 0.62 * smoothstep(0.05, 0.65, vDepth), 1.0, vMorph);
  float al = smoothstep(1.0, -1.0, d) * uIntro * depthAlpha;
  gl_FragColor = vec4(c * al, al);
}
`

function compileShader(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

function buildGrid(segX, segY) {
  const out = []
  for (let y = 0; y < segY; y++) {
    for (let x = 0; x < segX; x++) {
      const x0 = x / segX
      const x1 = (x + 1) / segX
      const y0 = y / segY
      const y1 = (y + 1) / segY
      out.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1)
    }
  }
  return new Float32Array(out)
}

/**
 * Preloader WebGL 3D Globe berputar ke kanan yang melebur langsung ke posisi panorama 3D Hero.
 * 8 kartu proyek membentuk bola 3D melengkung di tengah layar, berputar mulus ke kanan,
 * lalu terurai sempurna tepat ke koordinat piksel CurvedProjectLens tanpa patahan.
 */
export default function Preloader({ onReveal, onDone }) {
  const reduceMotion = useReducedMotion()
  const canvasRef = useRef(null)
  const [unfolding, setUnfolding] = useState(false)
  const onRevealRef = useRef(onReveal)
  const onDoneRef = useRef(onDone)
  onRevealRef.current = onReveal
  onDoneRef.current = onDone

  useEffect(() => {
    if (reduceMotion) {
      onRevealRef.current?.()
      const t = setTimeout(() => onDoneRef.current?.(), 140)
      return () => clearTimeout(t)
    }

    const canvas = canvasRef.current
    if (!canvas) {
      onRevealRef.current?.()
      onDoneRef.current?.()
      return
    }

    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true })
    if (!gl) {
      onRevealRef.current?.()
      const t = setTimeout(() => onDoneRef.current?.(), 300)
      return () => clearTimeout(t)
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onRevealRef.current?.()
      onDoneRef.current?.()
      return
    }

    gl.useProgram(prog)
    const mesh = buildGrid(28, 12)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = {}
    for (const k of [
      'uScreen',
      'uTargetCenter',
      'uTargetSize',
      'uHeroCard',
      'uHeroX',
      'uBend',
      'uLon',
      'uLat',
      'uGlobeR',
      'uPatchAng',
      'uMorph',
      'uIntro',
      'uTex',
      'uSize',
      'uAspect',
      'uShift',
      'uReady',
      'uDark',
      'uSpinVel',
    ]) {
      u[k] = gl.getUniformLocation(prog, k)
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    let disposed = false
    const n = projects.length
    const tex = projects.map((s) => {
      const t = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([240, 242, 246, 255]))
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      const entry = { t, aspect: 1.6, ready: false }
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return
        gl.bindTexture(gl.TEXTURE_2D, t)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        entry.aspect = img.naturalWidth / Math.max(1, img.naturalHeight)
        entry.ready = true
      }
      img.src = s.image
      return entry
    })

    let W = window.innerWidth
    let H = window.innerHeight
    let dpr = 1

    const syncSize = () => {
      W = Math.max(1, window.innerWidth)
      H = Math.max(1, window.innerHeight)
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    syncSize()
    window.addEventListener('resize', syncSize, { passive: true })

    // Hitung posisi target persis dari kanvas Hero di bawah
    const measureTarget = () => {
      const targetEl = document.querySelector('.lens-stage__canvas')
      if (targetEl) {
        const r = targetEl.getBoundingClientRect()
        if (r.width > 10 && r.height > 10) {
          const cx = r.left + r.width * 0.5 - W * 0.5
          const cy = H * 0.5 - (r.top + r.height * 0.5)
          return { cx, cy, tw: r.width, th: r.height }
        }
      }
      const fallbackH = Math.max(248, Math.min(392, H * 0.39))
      return { cx: 0, cy: -H * 0.14, tw: W, th: fallbackH }
    }

    const SPIN_DURATION = 1.55 // detik berputar 3D globe ke kanan
    const MORPH_START = 1.48 // mulai membuka mulus ke posisi Hero
    const MORPH_DURATION = 0.92 // detik transisi dari globe -> panorama Hero
    const TOTAL_END = MORPH_START + MORPH_DURATION

    const startTime = performance.now()
    let revealed = false
    let finished = false
    let raf = 0

    // Kemiringan poros globe untuk sorting kedalaman z back-to-front
    const ax = 0.20
    const sx = Math.sin(ax)
    const cx = Math.cos(ax)

    const frame = (now) => {
      if (disposed) return
      const t = (now - startTime) / 1000
      const intro = easeOutCubic(Math.min(1, t / 0.45))

      // Putaran globe ke kanan (sudut naik dari -1.15 putaran menuju 0 tepat di Desiltrace)
      const spinT = Math.min(1, t / SPIN_DURATION)
      const spinEase = easeOutCubic(spinT)
      const spinAngle = -Math.PI * 2.25 * (1 - spinEase)
      const spinVel = Math.max(0, 1 - spinT)

      const morphRaw = Math.max(0, Math.min(1, (t - MORPH_START) / MORPH_DURATION))
      const morph = easeInOutQuart(morphRaw)

      if (t >= MORPH_START && !revealed) {
        revealed = true
        setUnfolding(true)
        onRevealRef.current?.()
      }

      const { cx: tcx, cy: tcy, tw, th } = measureTarget()
      const [cw, ch] = heroCardSize(tw, th)
      const gap = cw * (tw < 640 ? 0.08 : 0.095)
      const step = cw + gap
      const bend = tw < 640 ? 0.24 : 0.34
      const globeR = Math.min(W * (W < 640 ? 0.46 : 0.34), H * (W < 640 ? 0.34 : 0.42), 400)
      const isDark = document.documentElement.dataset.theme === 'dark' ? 1 : 0

      // Ukuran sudut tiap kartu di permukaan bola agar besar, tajam, dan utuh membentuk globe 3D
      const patchLon = W < 640 ? 0.72 : 0.68
      const patchLat = patchLon * 0.625

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(u.uScreen, W, H)
      gl.uniform2f(u.uTargetCenter, tcx, tcy)
      gl.uniform2f(u.uTargetSize, tw, th)
      gl.uniform2f(u.uHeroCard, cw, ch)
      gl.uniform1f(u.uBend, bend)
      gl.uniform1f(u.uGlobeR, globeR)
      gl.uniform2f(u.uPatchAng, patchLon, patchLat)
      gl.uniform1f(u.uMorph, morph)
      gl.uniform1f(u.uIntro, intro)
      gl.uniform2f(u.uSize, cw, ch)
      gl.uniform1f(u.uDark, isDark)
      gl.uniform1f(u.uSpinVel, spinVel)

      // Hitung posisi & urutan gambar: di fase globe urut dari z belakang ke depan; saat membuka urut ke tengah
      const drawList = projects.map((_, i) => {
        const d = offsetOf(i, 0, n)
        const baseLon = d * ((Math.PI * 2) / n)
        const lon = baseLon + spinAngle
        const lat = LATITUDES[i % LATITUDES.length]
        const zRaw = Math.cos(lat) * Math.cos(lon)
        const yRaw = Math.sin(lat)
        const zTilt = yRaw * sx + zRaw * cx
        return { i, d, lon, lat, zTilt }
      })

      if (morph < 0.55) {
        drawList.sort((a, b) => a.zTilt - b.zTilt)
      } else {
        drawList.sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
      }

      for (const item of drawList) {
        const { i, d, lon, lat } = item
        const heroX = d * step
        gl.bindTexture(gl.TEXTURE_2D, tex[i].t)
        gl.uniform1f(u.uLon, lon)
        gl.uniform1f(u.uLat, lat)
        gl.uniform1f(u.uHeroX, heroX)
        gl.uniform1f(u.uAspect, tex[i].aspect)
        gl.uniform1f(u.uReady, tex[i].ready ? 1 : 0)
        gl.uniform1f(u.uShift, Math.max(-0.04, Math.min(0.04, -d * 0.025)))
        gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 2)
      }

      if (t >= TOTAL_END && !finished) {
        finished = true
        onDoneRef.current?.()
        return
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', syncSize)
      tex.forEach((entry) => gl.deleteTexture(entry.t))
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [reduceMotion])

  return (
    <div className={`preloader preloader--globe no-print${unfolding ? ' is-unfolding' : ''}`} aria-hidden="true">
      {/* Latar yang perlahan transparan tepat saat globe mulai terbuka menuju Hero */}
      <motion.div
        className="preloader__backdrop"
        initial={{ opacity: 1 }}
        animate={{ opacity: unfolding ? 0 : 1 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Lingkar halo halus di belakang bola 3D */}
      <motion.div
        className="preloader__orbit"
        initial={{ opacity: 0, scale: 0.84 }}
        animate={unfolding ? { opacity: 0, scale: 1.25 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Teks editorial minimal mengapit globe */}
      <motion.span
        className="preloader__side preloader__side--left"
        initial={{ opacity: 0, x: -20 }}
        animate={unfolding ? { opacity: 0, x: -32 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {leftWord}
      </motion.span>

      <motion.span
        className="preloader__side preloader__side--right"
        initial={{ opacity: 0, x: 20 }}
        animate={unfolding ? { opacity: 0, x: 32 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {rightWord}
      </motion.span>

      {/* Kanvas WebGL penuh layar: 3D Globe berputar ke kanan -> melebur langsung ke Hero */}
      <canvas ref={canvasRef} className="preloader__canvas" />

      <motion.p
        className="preloader__foot"
        initial={{ opacity: 0, y: 8 }}
        animate={unfolding ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {profile.role} · {profile.institution}
      </motion.p>
    </div>
  )
}
