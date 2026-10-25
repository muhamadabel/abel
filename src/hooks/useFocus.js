import { useState } from 'react'
import { ease } from '../lib/motion'

const canHover = () => window.matchMedia('(hover: hover)').matches

// Fokus saat hover: item yang disorot tetap tajam, saudaranya redup dan blur.
// `group` dipasang di pembungkus daftar, `item(i)` di elemen motion tiap item.
export function useFocus() {
  const [active, setActive] = useState(null)

  const item = (i) => {
    const dim = active !== null && active !== i
    return {
      onMouseEnter: () => canHover() && setActive(i),
      animate: { opacity: dim ? 0.3 : 1, filter: dim ? 'blur(1.5px)' : 'blur(0px)' },
      transition: { duration: 0.35, ease },
    }
  }

  const group = { onMouseLeave: () => setActive(null) }

  return [item, group]
}
