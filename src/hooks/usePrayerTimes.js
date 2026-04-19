import { useState, useEffect } from 'react'
import * as adhan from 'adhan'

const PRAYER_NAMES = {
  fajr: 'Subuh',
  sunrise: 'Syuruq',
  dhuhr: 'Dzuhur',
  asr: 'Ashar',
  maghrib: 'Maghrib',
  isha: 'Isya',
}

function fmt(d) {
  return d ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'
}

export function usePrayerTimes(lat = -7.2575, lng = 112.7521) {
  const [times, setTimes]         = useState(null)
  const [nextPrayer, setNext]     = useState(null)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const coords  = new adhan.Coordinates(lat, lng)
    const params  = adhan.CalculationMethod.MoonsightingCommittee()
    params.madhab = adhan.Madhab.Shafi

    function calc() {
      const now = new Date()
      const pt  = new adhan.PrayerTimes(coords, now, params)
      const list = [
        { key: 'fajr',    name: 'Subuh',   time: pt.fajr },
        { key: 'sunrise', name: 'Syuruq',  time: pt.sunrise },
        { key: 'dhuhr',   name: 'Dzuhur',  time: pt.dhuhr },
        { key: 'asr',     name: 'Ashar',   time: pt.asr },
        { key: 'maghrib', name: 'Maghrib', time: pt.maghrib },
        { key: 'isha',    name: 'Isya',    time: pt.isha },
      ]
      setTimes(list.map(p => ({ ...p, fmt: fmt(p.time) })))

      const next = pt.nextPrayer()
      const nextTime = pt.timeForPrayer(next)
      setNext({ key: next, name: PRAYER_NAMES[next] || next, time: nextTime, fmt: fmt(nextTime) })
    }

    calc()
    const interval = setInterval(calc, 60000)
    return () => clearInterval(interval)
  }, [lat, lng])

  useEffect(() => {
    if (!nextPrayer) return
    const tick = () => {
      const diff = nextPrayer.time - new Date()
      if (diff <= 0) { setCountdown('Waktu Shalat'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${h > 0 ? h + ' jam ' : ''}${m} menit ${s} detik`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [nextPrayer])

  return { times, nextPrayer, countdown }
}
