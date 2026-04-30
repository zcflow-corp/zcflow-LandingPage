'use client'
import { useEffect, useState, useRef } from 'react'
import IconoSvg from './IconoSvg.jsx'
import es from '../i18n/es.json'
import en from '../i18n/en.json'

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

const locale = getLocaleFromDoc()

export default function CardSolution({
  slides = [],
  interval = 5000,
  startIndex = 0,
  title = '',
  description = '',
  word = '',
  textinfo = '',
}) {
  const [index, setIndex] = useState(startIndex)
  const [t, setT] = useState(startIndex)
  const [localeR, setlocaleR] = useState('es')
  const timerRef = useRef(null)

  const gridRef = useRef(null)

  const total = slides.length
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
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(messages)

    setlocaleR(locale)
  }, [locale])

  // ✅ ANIMACIÓN SMOOTH (reveal al entrar)
  useEffect(() => {
    const root = gridRef.current
    if (!root) return

    const cards = Array.from(root.querySelectorAll('.dCard'))
    cards.forEach((el) => el.classList.add('dCard--reveal'))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px', // entra un poquito antes (se siente más premium)
      }
    )

    cards.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [slides])

  return (
    <section className="card-slider" aria-label="Card Slider">
      <div
        className="card-slider__viewport"
        aria-roledescription="carrusel"
        aria-live="polite"
        onMouseEnter={stop}
        onMouseLeave={play}
      >
        <div className="card-slider__content card-slider__container">
          <div className="card-slider__title">{/* ... */}</div>

          {/* ✅ ref aquí */}
          <ul
            className="drivenCards__grid"
            role="tablist"
            aria-label="Listado de descripciones"
            ref={gridRef}
          >
            {slides.map((s, i) => {
              const imageSrc = localeR == 'es' ? s.image?.src : s.imageEn?.src
              const hasImage = Boolean(imageSrc)

              return (
                <article
                  className="dCard"
                  key={`${s.title}-${i}`}
                  style={{ '--delay': `${i * 90}ms` }} // ✅ cascada suave
                >
                  <div className="dCard__top">
                    <span className="dCard__badge">{word}</span>
                  </div>

                  {s.status === 'beta' && (
                    <div className="beta-card">
                      <span className="beta-ribbon ">beta</span>
                    </div>
                  )}

                  <div className="dCard__body">
                    <h3 className="dCard__title">{s.title}</h3>
                    <p className="dCard__desc">{s.description}</p>

                    <button
                      type="button"
                      className="dCard__button"
                      aria-label="Ver detalle de la tarjeta"
                    >
                      <span className="dCard__arrow">{textinfo}</span>
                    </button>
                  </div>

                  <div className="dCard__preview" role="img" aria-label={s.title}>
                    <div className={`dCard__frame ${!hasImage ? 'is-empty' : ''}`}>
                      {hasImage ? (
                        <img
                          className="dCard__img"
                          src={imageSrc}
                          alt={s.alt || s.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="dCard__placeholder" />
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
