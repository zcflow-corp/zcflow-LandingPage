'use client'
import { useEffect, useState, useRef } from 'react'
import IconoSvg from './IconoSvg.jsx'
import FlowConexion from './FlowConexion.jsx'
import FlowBox from './FlowBox.jsx'
import FlowDecision from '@/islands/FlowDecision'

/**
 * @param {Object} props
 * @param {Function} [props.t]
 * @param {{ title: string; description: string; image: string; alt?: string; Icono?: string }[]} props.slides
 * @param {number} [props.interval]
 * @param {number} [props.startIndex]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.word]
 */
export default function CardSlider({
  t: _t,
  slides = [],
  interval = 5000,
  startIndex = 0,
  title = '',
  description = '',
  word = '',
}) {
  const t = typeof _t === 'function' ? _t : (k) => k
  const [index, setIndex] = useState(startIndex)
  const timerRef = useRef(null)
  const total = slides.length

  // Cambia al siguiente slide
  const next = () => setIndex((prev) => (prev + 1) % total)
  const prev = () => setIndex((prev) => (prev - 1 + total) % total)

  const play = () => {
    stop()
    timerRef.current = setInterval(next, interval)
  }

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    play()
    return stop
  }, []) // 👈 solo al montar

  // Permitir navegación con teclado
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // 🔹 Función que devuelve el componente según el id del slide
  function renderExtraComponent(slide) {
    if (!slide) return null

    switch (slide.id) {
      case 1:
        // id 1 → FlowConexion
        return (
          <FlowConexion
            client:load
            labels={['Open Banking', 'RPA-ERPs', 'Fintechs, inversionistas y otros']}
            rotationMs={9000}
          />
        )

      case 2:
        return <FlowDecision height={260} />

      // puedes seguir añadiendo casos:
      case 3:
        return <FlowBox client:load />

      default:
        return null
    }
  }

  return (
    <section className="card-slider" aria-label="Card Slider">
      <div
        className="card-slider__viewport"
        aria-roledescription="carrusel"
        aria-live="polite"
        onMouseEnter={stop}
        onMouseLeave={play}
      >
        {/* === MEDIA === */}
        <div className="card-slider__media card-slider__container">
          {slides.map((s, i) => (
            <figure
              key={i}
              className={`card-slider__figure${
                i === index ? ' card-slider__figure--active card-slider__figure--stagger' : ''
              }`}
              aria-hidden={i !== index}
            >
              <div className="card-slider__bg" />
              <div className="card-slider__img-wrap">
                {s.hasFlow == true ? (
                  renderExtraComponent(s)
                ) : (
                  <img
                    className="card-slider__img"
                    src={s.image}
                    alt={s.alt ?? s.title}
                    loading={i === index ? 'eager' : 'lazy'}
                  />
                )}
              </div>
            </figure>
          ))}
        </div>

        {/* === CONTENT === */}
        <div className="card-slider__content card-slider__container">
          <div className="card-slider__title">
            <span>{word}</span>
            <h2 className="gradient-blue-dark">{title}</h2>
            <p>{description}</p>
          </div>

          <ul
            className="card-slider__desc-list"
            role="tablist"
            aria-label="Listado de descripciones"
          >
            {slides.map((s, i) => (
              <li
                key={i}
                className={`card-slider__desc-item${i === index ? ' card-slider__desc-item--active' : ''}`}
                role="tab"
                aria-selected={i === index}
                tabIndex={0}
                onClick={() => setIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setIndex(i)
                  }
                }}
              >
                <IconoSvg name={t(s.Icono)} class="icon" ariaLabel="Activo" />

                <div className="content-slider">
                  <article className="card-slider__desc">
                    <span className="card-slider__desc-title">{t(s.title)}</span>,{' '}
                    {t(s.description)}
                  </article>
                  {t(s.status) == 'beta' ? (
                    <div className="beta-card">
                      <span className="beta gradient-blue-dark"> beta </span>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
