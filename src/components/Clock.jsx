import { useEffect, useState } from 'react'
import { profile } from '../data/content'

// Jam lokal Yogyakarta (WIB) yang jalan tiap detik.
export default function Clock({ className = 'clock' }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className={className}>
      <span className="clock__dot" aria-hidden="true" />
      <span>{profile.location.split(',')[0]}</span>
      <span className="mono clock__time">{time} WIB</span>
    </span>
  )
}
