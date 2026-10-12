import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function useToast(duration = 2200) {
  const [msg, setMsg] = useState(null)
  const timer = useRef(null)

  const show = useCallback((m) => {
    clearTimeout(timer.current)
    setMsg(m)
    timer.current = setTimeout(() => setMsg(null), duration)
  }, [duration])

  useEffect(() => () => clearTimeout(timer.current), [])

  return [msg, show]
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    el.remove()
    return ok
  }
}

export default function Toast({ message }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast no-print"
          role="status"
          initial={{ opacity: 0, y: 60, scale: 0.9, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, y: 30, scale: 0.95, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        >
          <span className="toast__dot" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
