import { lazy, Suspense, useState } from 'react'
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

export default function App() {
  useSmoothScroll()
  const [reveal, setReveal] = useState(false)
  const [ready, setReady] = useState(false)

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
      </Suspense>
    </MotionConfig>
  )
}
