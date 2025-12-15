'use client'
import { useEffect, useState, useRef } from 'react'
import IconoSvg from './IconoSvg.jsx'
import FlowConexion from './FlowConexion.jsx'
import FlowBox from './FlowBox.jsx'
import FlowDecision from '@/islands/FlowDecision'
import es from '../i18n/es.json'
import en from '../i18n/en.json'
import { LanguageProvider } from '@/context/LanguageContext.jsx'

/**
 * @param {Object} props
 * @param {Function} props.t
 * @param {{ title: string; description: string; image: string; alt?: string; Icono?: string }[]} props.slides
 * @param {number} [props.interval]
 * @param {number} [props.startIndex]
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.word]
 */

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

export default function CardZcflow({
  slides = [],
  interval = 5000,
  startIndex = 0,
  title = '',
  description = '',
  word = '',
}) {
  const [index, setIndex] = useState(startIndex)
  const [t, setT] = useState(startIndex)

  const timerRef = useRef(null)
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

  const locale = getLocaleFromDoc()

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(messages)
  }, locale)

  // Render extra components for flow items
  function renderExtraComponent(slide) {
    if (!slide) return null

    switch (slide.id) {
      case 1:
        return (
          <LanguageProvider>
            <FlowConexion rotationMs={9000} client:only />
          </LanguageProvider>
        )

      case 2:
        return (
          <LanguageProvider>
            <FlowDecision height={260} />
          </LanguageProvider>
        )

      case 3:
        return (
          <LanguageProvider>
            <FlowBox />
          </LanguageProvider>
        )

      default:
        return null
    }
  }

  return (
    <section className="card-slider card-zcflow" aria-label="Card Slider">
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
                {s.hasFlow ? (
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
        <div className="card-slider__content zcflow-description">
          <p>
            Con <h3> ZCFLOW </h3> integramos toda tu información financiera en una plataforma 100%
            data driven, potenciada por
            <span className="gradient-blue-ligth"> agentes de IA </span> que anticipan tu liquidez y
            simulan escenarios para orientar decisiones financieras más precisas.
          </p>

          <p>
            Hacemos que el{' '}
            <span className="gradient-blue-ligth"> mercado financiero compita por tu liquidez</span>
            : el menor costo cuando necesitas caja y el mejor retorno cuando tienes excedentes.
          </p>

          <p className="driver">
            De hojas de cálculo y tareas manuales <span className="gradient-blue-ligth"> → </span> a
            decisiones precisas, confiables y asistidas desde una única plataforma.
          </p>
          <ul class="checks" role="list">
            {slides.map((c, i) => (
              <li
                class={`check ${i === index ? 'gradient-blue-ligth' : 'check-desactive'}`}
                key={c.id}
              >
                <IconoSvg name="check" />

                <div>{c.title}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
