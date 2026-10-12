import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile, sections } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'
import { useScrollSpy, useScrolled } from '../hooks/useScrollSpy'
import { ease, springSoft } from '../lib/motion'
import ThemeToggle from './ThemeToggle'

// 'top' ikut dipantau supaya di hero tidak ada link yang aktif
const ids = ['top', ...sections.map((s) => s.id)]

export default function Nav() {
  const active = useScrollSpy(ids)
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e, target) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(target)
    history.replaceState(null, '', target === '#top' ? location.pathname : target)
  }

  return (
    <motion.header
      className={`nav no-print${scrolled ? ' is-scrolled' : ''}`}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease, delay: 0.2 }}
    >
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={(e) => go(e, '#top')}>
          <span className="nav__mark">{profile.initials}</span>
          <span className="nav__name">{profile.display}</span>
        </a>

        <nav className="nav__links" aria-label="Navigasi utama">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`nav__link${active === s.id ? ' is-active' : ''}`}
              aria-current={active === s.id ? 'true' : undefined}
              onClick={(e) => go(e, `#${s.id}`)}
            >
              {active === s.id && (
                <motion.span className="nav__pill" layoutId="nav-pill" transition={springSoft} />
              )}
              <span className="nav__label">{s.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <ThemeToggle />
          <button
            className={`nav__burger${open ? ' is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__sheet"
            aria-label="Navigasi mobile"
            initial={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease }}
          >
            {sections.map((s, i) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                className={`nav__sheet-link${active === s.id ? ' is-active' : ''}`}
                onClick={(e) => go(e, `#${s.id}`)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springSoft, delay: 0.04 * i }}
              >
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
