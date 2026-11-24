import { useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useSmoothScroll } from './lib/smoothScroll'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TechMarquee from './components/TechMarquee'
import FocusDeck from './components/FocusDeck'
import Experience from './components/Experience'
import Skills from './components/Skills'
import CVPreview from './components/CVPreview'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'

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
        <FocusDeck />
        <Experience />
        <Skills />
        <CVPreview />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </MotionConfig>
  )
}
