import { lazy, Suspense, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useSmoothScroll } from './lib/smoothScroll'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TechMarquee from './components/TechMarquee'

const FocusDeck = lazy(() => import('./components/FocusDeck'))
const Experience = lazy(() => import('./components/Experience'))
const Skills = lazy(() => import('./components/Skills'))
const CVPreview = lazy(() => import('./components/CVPreview'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))
const Cursor = lazy(() => import('./components/Cursor'))

export default function App() {
  useSmoothScroll()
  const [reveal, setReveal] = useState(false)
  const [ready, setReady] = useState(false)
  const [finePointer, setFinePointer] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(pointer: coarse)')
    const sync = () => setFinePointer(!mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {!ready && (
        <Preloader
          onReveal={() => setReveal(true)}
          onDone={() => {
            setReveal(true)
            setReady(true)
          }}
        />
      )}
      <Nav ready={reveal} />
      <main>
        <Hero reveal={reveal} ready={ready} />
        <TechMarquee />
        <Suspense fallback={null}>
          <FocusDeck />
          <Experience />
          <Skills />
          <CVPreview />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        {finePointer && <Cursor />}
      </Suspense>
    </MotionConfig>
  )
}
