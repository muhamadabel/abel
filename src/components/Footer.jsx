import { useRef } from 'react'
import { profile } from '../data/content'
import { scrollTo } from '../lib/smoothScroll'
import Clock from './Clock'
import GridField from './fx/GridField'
import ScrambleText from './fx/ScrambleText'
import useProximity from './fx/useProximity'

export default function Footer() {
  const markRef = useRef(null)
  useProximity(markRef, 260)

  return (
    <footer className="footer no-print">
      <div className="footer__mark" ref={markRef} aria-hidden="true">
        <GridField className="footer__field" />
        <p className="footer__word">
          {[...profile.display].map((ch, i) => (
            <span key={i} className={ch === ' ' ? 'footer__gap' : 'plet'}>
              {ch === ' ' ? '\u00a0' : ch}
            </span>
          ))}
        </p>
      </div>
      <div className="container footer__row">
        <span>
          &copy; {new Date().getFullYear()} {profile.name}
        </span>
        <Clock />
        <a
          href="#top"
          className="footer__top"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('#top')
          }}
        >
          <ScrambleText text="Kembali ke atas" />
        </a>
      </div>
    </footer>
  )
}
