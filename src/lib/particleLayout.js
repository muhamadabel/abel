// Helper bersama antara Preloader.jsx dan ParticleText.jsx agar target titik huruf
// identik 100% hingga subpiksel saat transisi dari preloader menuju Hero.

export const PARTICLE_FONT_FAMILY =
  "'Inter Tight', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif"

export function getParticleDpr(viewportWidth) {
  const raw = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  return viewportWidth < 640 ? Math.min(raw, 1.25) : Math.min(raw, 2)
}

export function particleDotRadius(compact, dpr) {
  return (compact ? 0.84 + Math.random() * 0.44 : 0.86 + Math.random() * 0.48) * dpr
}

export function computeParticleBox(rawWidth) {
  const cssW = Math.max(280, Math.round(rawWidth))
  const compact = cssW < 560
  const cssH = compact
    ? Math.round(Math.min(188, Math.max(138, cssW * 0.42)))
    : Math.round(Math.min(176, Math.max(112, cssW * 0.145)))
  return { cssW, cssH, compact }
}

/**
 * Mengambil koordinat piksel target (tx, ty) dan penanda kelompok kata (0 = kiri/baris 1, 1 = kanan/baris 2)
 * dalam ruang piksel fisik (cssW * dpr, cssH * dpr).
 */
export function sampleParticleTitle(text, rawWidth, dpr) {
  const { cssW, cssH, compact } = computeParticleBox(rawWidth)
  const width = Math.round(cssW * dpr)
  const height = Math.round(cssH * dpr)

  const off = document.createElement('canvas')
  off.width = width
  off.height = height
  const octx = off.getContext('2d')
  if (!octx) {
    return { cssW, cssH, width, height, compact, points: [] }
  }

  octx.clearRect(0, 0, width, height)
  octx.fillStyle = '#000000'
  octx.textAlign = 'center'
  octx.textBaseline = 'middle'

  const words = text.trim().split(/\s+/)
  const firstWord = words[0] || text
  const restWords = words.slice(1).join(' ')
  let splitX = width * 0.5

  if (compact) {
    let fontSize = Math.floor(height * 0.43)
    octx.font = `600 ${fontSize}px ${PARTICLE_FONT_FAMILY}`
    const maxLineW = width * 0.94
    const measured = Math.max(
      octx.measureText(firstWord).width,
      restWords ? octx.measureText(restWords).width : 0,
    )
    if (measured > maxLineW) {
      fontSize = Math.floor(fontSize * (maxLineW / measured))
      octx.font = `600 ${fontSize}px ${PARTICLE_FONT_FAMILY}`
    }
    if (restWords) {
      octx.fillText(firstWord, width / 2, height * 0.30)
      octx.fillText(restWords, width / 2, height * 0.72)
    } else {
      octx.fillText(firstWord, width / 2, height / 2)
    }
  } else {
    let fontSize = Math.floor(height * 0.78)
    octx.font = `600 ${fontSize}px ${PARTICLE_FONT_FAMILY}`
    const maxW = width * 0.96
    const measured = octx.measureText(text).width
    if (measured > maxW) {
      fontSize = Math.floor(fontSize * (maxW / measured))
      octx.font = `600 ${fontSize}px ${PARTICLE_FONT_FAMILY}`
    }
    const fullW = octx.measureText(text).width
    const firstW = octx.measureText(`${firstWord} `).width
    splitX = width / 2 - fullW / 2 + firstW
    octx.fillText(text, width / 2, height * 0.52)
  }

  const img = octx.getImageData(0, 0, width, height).data
  const step = Math.max(2, Math.round((compact ? 3.05 : 2.5) * dpr))
  const points = []

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = img[(y * width + x) * 4 + 3]
      if (alpha > 128) {
        const group = compact ? (y < height * 0.51 ? 0 : 1) : x < splitX ? 0 : 1
        points.push({ tx: x, ty: y, group })
      }
    }
  }

  return { cssW, cssH, width, height, compact, points }
}

/**
 * Mengambil posisi piksel sumber dari teks samping preloader ("Abel" / "Abhinaya.")
 * dalam koordinat layar CSS (viewport px) untuk titik awal partikel.
 */
export function sampleWordPixels(word, rect, fontSizePx, fontWeight = '500') {
  const w = Math.max(24, Math.ceil(rect.width + 12))
  const h = Math.max(24, Math.ceil(rect.height + 12))
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const ctx = off.getContext('2d')
  if (!ctx) return [{ x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 }]

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#000000'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${fontWeight} ${fontSizePx}px ${PARTICLE_FONT_FAMILY}`
  ctx.fillText(word, w / 2, h / 2)

  const img = ctx.getImageData(0, 0, w, h).data
  const out = []
  const ox = rect.left - 6
  const oy = rect.top - 6
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (img[(y * w + x) * 4 + 3] > 90) {
        out.push({ x: ox + x, y: oy + y })
      }
    }
  }

  if (out.length === 0) {
    return [{ x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 }]
  }
  return out
}
