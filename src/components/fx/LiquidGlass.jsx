import { useEffect, useId, useRef, useState } from 'react'

function supportsUrlBackdropFilter() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false
  return CSS.supports('backdrop-filter', 'url(#x)') || CSS.supports('-webkit-backdrop-filter', 'url(#x)')
}

function prefersReducedTransparency() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-transparency: reduce)').matches
}

function isSafariLike() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua)
}

function sdRoundedBox(px, py, halfW, halfH, r) {
  const qx = Math.abs(px) - halfW + r
  const qy = Math.abs(py) - halfH + r
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
  const inside = Math.min(Math.max(qx, qy), 0)
  return inside + outside - r
}

function bendFromDepth(x) {
  const u = 1 - Math.min(1, Math.max(0, x))
  const denom = Math.pow(1 - Math.pow(u, 4), 0.75)
  if (denom < 1e-6) return 0
  const thetaI = Math.atan(Math.min(Math.pow(u, 3) / denom, 8))
  const sinT = Math.sin(thetaI) / 1.5
  if (sinT >= 1) return Math.sin(thetaI)
  return Math.sin(thetaI - Math.asin(sinT))
}

function buildPhiTable(bevelPx) {
  const n = Math.max(1, Math.ceil(bevelPx))
  const phi = new Float32Array(n + 1)
  for (let d = 1; d <= n; d++) phi[d] = phi[d - 1] + bendFromDepth(d / n)
  return phi
}

function samplePhi(phi, depth) {
  const max = phi.length - 1
  if (depth <= 0) return phi[0]
  if (depth >= max) return phi[max]
  const i = Math.floor(depth)
  const f = depth - i
  return phi[i] * (1 - f) + phi[i + 1] * f
}

function computeDisplacementData({ width, height, radius, bevelDepth, gain = 1.3, dpr = 1 }) {
  const W = Math.max(1, Math.round(width * dpr))
  const H = Math.max(1, Math.round(height * dpr))
  const halfW = W / 2
  const halfH = H / 2
  const r = Math.min(radius * dpr, halfW, halfH)
  const bevel = Math.max(1, bevelDepth * dpr)
  const phi = buildPhiTable(bevel)

  const field = new Float32Array(W * H)
  for (let y = 0; y < H; y++) {
    const py = y - halfH + 0.5
    for (let x = 0; x < W; x++) {
      const d = sdRoundedBox(x - halfW + 0.5, py, halfW, halfH, r)
      field[y * W + x] = d > 0 ? 0 : samplePhi(phi, Math.min(bevel, -d))
    }
  }

  const data = new Uint8ClampedArray(W * H * 4)
  for (let y = 0; y < H; y++) {
    const py = y - halfH + 0.5
    for (let x = 0; x < W; x++) {
      const px = x - halfW + 0.5
      const i = (y * W + x) << 2
      const d = sdRoundedBox(px, py, halfW, halfH, r)
      if (d > 0) {
        data[i] = data[i + 1] = data[i + 2] = 128
        data[i + 3] = 0
        continue
      }
      const x0 = Math.max(0, x - 1)
      const x1 = Math.min(W - 1, x + 1)
      const y0 = Math.max(0, y - 1)
      const y1 = Math.min(H - 1, y + 1)
      const dPhiX = (field[y * W + x1] - field[y * W + x0]) / (x1 - x0 || 1)
      const dPhiY = (field[y1 * W + x] - field[y0 * W + x]) / (y1 - y0 || 1)
      const dx = Math.max(-1, Math.min(1, dPhiX * gain))
      const dy = Math.max(-1, Math.min(1, dPhiY * gain))
      data[i] = 128 + dx * 127
      data[i + 1] = 128 + dy * 127
      data[i + 2] = 128
      data[i + 3] = 255
    }
  }
  return { data, width: W, height: H }
}

async function generateDisplacementBlobUrl(opts) {
  const { data, width, height } = computeDisplacementData(opts)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')
  ctx.putImageData(new ImageData(data, width, height), 0, 0)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('Failed to encode displacement map')
  return URL.createObjectURL(blob)
}

function buildFilterSvg({ id, mapUrl, width, height, scale, aberration, frost }) {
  const pad = Math.ceil(scale + aberration + 4)
  const px = (pad / Math.max(1, width)) * 100
  const py = (pad / Math.max(1, height)) * 100
  const region = `x="-${px.toFixed(3)}%" y="-${py.toFixed(3)}%" width="${(100 + 2 * px).toFixed(3)}%" height="${(100 + 2 * py).toFixed(3)}%"`
  const map = `<feImage href="${mapUrl}" xlink:href="${mapUrl}" x="0" y="0" width="${width}" height="${height}" result="map" preserveAspectRatio="none"/>`
  const displace = (s, result) =>
    `<feDisplacementMap in="SourceGraphic" in2="map" scale="${s}" xChannelSelector="R" yChannelSelector="G" result="${result}"/>`

  const body =
    aberration <= 0
      ? displace(scale, 'rgb')
      : `${displace(scale + aberration, 'dispR')}
  <feColorMatrix in="dispR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red"/>
  ${displace(scale, 'dispG')}
  <feColorMatrix in="dispG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green"/>
  ${displace(Math.max(0, scale - aberration), 'dispB')}
  <feColorMatrix in="dispB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue"/>
  <feBlend in="red" in2="green" mode="screen" result="rg"/>
  <feBlend in="rg" in2="blue" mode="screen" result="rgb"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><filter id="${id}" color-interpolation-filters="sRGB" ${region}>
  ${map}
  ${body}
  <feGaussianBlur in="rgb" stdDeviation="${frost}"/>
</filter></svg>`
}

/**
 * Permukaan Liquid Glass optik (adaptasi Snell's-law SVG displacement).
 * Chromium memakai refraksi SVG backdrop-filter; Safari/Firefox fallback frosted glass halus.
 */
export default function LiquidGlass({
  as = 'div',
  children,
  className = '',
  radius = 999,
  bevelDepth = 14,
  scale = 28,
  aberration = 3,
  frost = 0.65,
  style,
  ...rest
}) {
  const Tag = as
  const reactId = useId().replace(/:/g, '')
  const rootRef = useRef(null)
  const blobRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [filter, setFilter] = useState(null)
  const [mode, setMode] = useState('pending')

  useEffect(() => {
    if (prefersReducedTransparency()) setMode('opaque')
    else if (isSafariLike() || !supportsUrlBackdropFilter()) setMode('simple')
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el || mode !== 'pending') return
    let raf = 0
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const box = entry.borderBoxSize?.[0]
      const width = box?.inlineSize ?? entry.contentRect.width
      const height = box?.blockSize ?? entry.contentRect.height
      const w = Math.max(1, Math.round(width))
      const h = Math.max(1, Math.round(height))
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }))
      })
    })
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'pending' || size.w <= 2 || size.h <= 2) return
    let cancelled = false

    ;(async () => {
      try {
        const mapUrl = await generateDisplacementBlobUrl({
          width: size.w,
          height: size.h,
          radius: Math.min(radius, size.w / 2, size.h / 2),
          bevelDepth: Math.min(bevelDepth, Math.min(size.w, size.h) / 2),
          dpr: 1,
        })
        await new Promise((resolve) => {
          const img = new Image()
          img.onload = img.onerror = () => resolve()
          img.src = mapUrl
        })
        if (cancelled) {
          URL.revokeObjectURL(mapUrl)
          return
        }
        if (blobRef.current) URL.revokeObjectURL(blobRef.current)
        blobRef.current = mapUrl

        const id = `lg-${reactId}-${size.w}x${size.h}-${Date.now().toString(36)}`
        setFilter({
          id,
          svg: buildFilterSvg({
            id,
            mapUrl,
            width: size.w,
            height: size.h,
            scale,
            aberration,
            frost,
          }),
        })
      } catch {
        if (!cancelled) setMode('simple')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [mode, size.w, size.h, radius, bevelDepth, scale, aberration, frost, reactId])

  useEffect(
    () => () => {
      if (blobRef.current) URL.revokeObjectURL(blobRef.current)
    },
    [],
  )

  const backdrop =
    mode === 'opaque'
      ? 'none'
      : mode === 'simple'
        ? 'blur(20px) saturate(1.7)'
        : filter
          ? `url(#${filter.id}) blur(1.2px) saturate(1.85) brightness(1.03)`
          : 'blur(16px) saturate(1.7)'

  return (
    <Tag
      ref={rootRef}
      data-refract={mode === 'pending' && filter ? 'true' : 'false'}
      className={`lglass ${className}`.trim()}
      style={{
        borderRadius: radius,
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
        ...style,
      }}
      {...rest}
    >
      {filter && (
        <span
          key={filter.id}
          aria-hidden="true"
          className="lglass__svg"
          dangerouslySetInnerHTML={{ __html: filter.svg }}
        />
      )}
      {children}
    </Tag>
  )
}
