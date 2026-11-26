const imageCache = new Map()

/**
 * Mengonversi path thumbnail `/projects/nama.jpg` menjadi format WebP
 * resolusi desktop (`1280x800`) atau mobile (`640x400`).
 */
export function projectImageSrc(path, compact = false) {
  if (!path) return ''
  if (!path.startsWith('/projects/') || !path.endsWith('.jpg')) return path
  const file = path.slice('/projects/'.length, -4)
  return compact ? `/projects/mobile/${file}.webp` : `/projects/${file}.webp`
}

/**
 * Mengambil instance Image bersama yang di-cache di memori agar Preloader
 * dan CurvedProjectLens berbagi aset hasil decode yang sama tanpa fetch ganda.
 */
export function loadCachedImage(src, onLoad) {
  if (!src) return null
  let img = imageCache.get(src)
  if (!img) {
    img = new Image()
    img.decoding = 'async'
    img.src = src
    imageCache.set(src, img)
  }

  if (img.complete && img.naturalWidth > 0) {
    let active = true
    if (onLoad) {
      queueMicrotask(() => {
        if (active) onLoad(img)
      })
    }
    return () => {
      active = false
    }
  } else if (onLoad) {
    const handle = () => onLoad(img)
    img.addEventListener('load', handle, { once: true })
    return () => img.removeEventListener('load', handle)
  }
  return () => {}
}
