import { useEffect, useRef } from 'react'

// Diadaptasi dari "Spotlight" (21st.dev, kevingirelli): cahaya lembut yang mengikuti
// pointer plus tepi yang ikut menyala. Hanya mengubah dua CSS variable per frame.
export default function Spotlight({ as: Tag = 'div', className = '', ring = true, children, onPointerMove, ...props }) {
  const frame = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const track = (e) => {
    onPointerMove?.(e)
    if (e.pointerType === 'touch') return
    const el = e.currentTarget
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const b = el.getBoundingClientRect()
      el.style.setProperty('--spot-x', `${clientX - b.left}px`)
      el.style.setProperty('--spot-y', `${clientY - b.top}px`)
      el.style.setProperty('--rx', `${(((clientY - b.top) / b.height) - 0.5) * -7}deg`)
      el.style.setProperty('--ry', `${(((clientX - b.left) / b.width) - 0.5) * 9}deg`)
    })
  }

  return (
    <Tag className={`spotlight ${className}`} onPointerMove={track} {...props}>
      <span className="spotlight__light" aria-hidden="true" />
      {ring && <span className="spotlight__ring" aria-hidden="true" />}
      {children}
    </Tag>
  )
}
