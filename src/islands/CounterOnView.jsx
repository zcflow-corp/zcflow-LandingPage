// src/islands/CounterOnView.jsx
import React from 'react'

const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}
const IMAGE_ANIMATION_DELAY = 1400
export default function CounterOnView({ end = 100, duration = 900, suffix = '' }) {
  const ref = React.useRef(null)
  const [val, setVal] = React.useState(0)

  React.useEffect(() => {
    if (!ref.current) return
    if (prefersReducedMotion()) {
      setVal(end)
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) obs.disconnect()
        },
        { threshold: 0.1 }
      )
      obs.observe(ref.current)
      return
    }

    const mainContainer = ref.current.closest('.container.indicators.card')
    const parentCounter = ref.current.closest('.counter')

    if (parentCounter) {
      parentCounter.classList.add('is-visible')
    }

    let animatedImage = null
    if (mainContainer) {
      animatedImage = mainContainer.querySelector('.imagen-indicador')
    }

    if (animatedImage) {
      animatedImage.classList.add('is-visible')
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startCounting = () => {
            const start = performance.now()
            const step = (t) => {
              const p = Math.min(1, (t - start) / duration)
              setVal(Math.round(end * (1 - Math.pow(1 - p, 3))))
              if (p < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
            obs.disconnect()
          }
          setTimeout(startCounting, IMAGE_ANIMATION_DELAY)
        }
      },
      { threshold: 0.1 }
    )

    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  return (
    <div className="style-indicators" ref={ref}>
      {val}
      {suffix}
    </div>
  )
}
