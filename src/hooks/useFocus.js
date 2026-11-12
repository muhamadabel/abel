import { useState } from 'react'
import { ease } from '../lib/motion'

const canHover = () => window.matchMedia('(hover: hover)').matches

// Fokus saat hover: item yang disorot tetap tajam, saudaranya sedikit redup tanpa blur.
// `group` dipasang di pembungkus daftar, `item(i)` di elemen motion tiap item.
export function useFocus() {
  const [active, setActive] = useState(null)

  const item = (i) => {
    const dim = active !== null && active !== i
    return {
      onMouseEnter: () => canHover() && setActive(i),
      animate: { opacity: dim ? 0.38 : 1 },
      transition: { duration: 0.25, ease },
    }
  }

  const group = { onMouseLeave: () => setActive(null) }

  return [item, group]
}
