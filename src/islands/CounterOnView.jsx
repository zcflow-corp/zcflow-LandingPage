// src/islands/CounterOnView.jsx
import React from 'react'

export default function CounterOnView({ end = 100, duration = 900, suffix = '' }) {
  const ref = React.useRef(null)
  const [val, setVal] = React.useState(0)

  React.useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now()
          const step = (t) => {
            const p = Math.min(1, (t - start) / duration)
            // easing cúbico suave
            setVal(Math.round(end * (1 - Math.pow(1 - p, 3))))
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  return (
    <div ref={ref}>
      {val}
      {suffix}
    </div>
  )
}
