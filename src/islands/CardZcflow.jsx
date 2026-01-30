'use client'
import { useEffect, useState, useRef } from 'react'
import IconoSvg from './IconoSvg.jsx'
import FlowConexion from './FlowConexion.jsx'
import FlowBox from './FlowBox.jsx'
import FlowDecision from '@/islands/FlowDecision'
import es from '../i18n/es.json'
import en from '../i18n/en.json'
import { LanguageProvider } from '@/context/LanguageContext.jsx'

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

function createTranslationFunction(messages) {
  return (key) => messages[key] || key
}

export default function CardZcflow({
  slides = [],
  interval = 5000, // ✅ duración normal (ms)
  startIndex = 0,
  title = '',
  description = '',
  word = ''
}) {
  const [index, setIndex] = useState(startIndex)
  const [t, setT] = useState(() => createTranslationFunction(es))

  const total = slides.length

  // ✅ SOLO usamos timeout (no interval) para poder variar la duración por slide
  const timeoutRef = useRef(null)

  const stop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const next = () => setIndex((prev) => (prev + 1) % total)
  const prev = () => setIndex((prev) => (prev - 1 + total) % total)

  const scheduleNext = (currentIndex) => {
    stop()
    if (total <= 1) return

    // ✅ el primero dura menos (ajusta aquí)
    const firstMs = 7000
    const ms = currentIndex === 0 ? firstMs : interval

    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % total)
    }, ms)
  }

  // ✅ Autoplay: cada vez que cambia index, programamos el siguiente con duración dinámica
  useEffect(() => {
    scheduleNext(index)
    return stop
  }, [index, interval, total])

  // ✅ teclado
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [total])

  // ✅ i18n
  const locale = getLocaleFromDoc()

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(() => createTranslationFunction(messages))
  }, [locale])

  function renderExtraComponent(slide) {
    if (!slide) return null

    switch (slide.id) {
      case 2:
        return (
          <LanguageProvider>
            <FlowConexion rotationMs={9000} client:only />
          </LanguageProvider>
        )
      case 3:
        return (
          <LanguageProvider>
            <FlowDecision height={260} />
          </LanguageProvider>
        )
      case 1:
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
        onMouseLeave={() => scheduleNext(index)}
      >
        {/* === MEDIA === */}
        <div className="card-slider__media card-slider__container">
          {slides.map((s, i) => (
            
            <figure
              key={s.id ?? i}
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
                    src={s.image?.src}
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
            {t('Con')} Zcflow{' '}
            {t(
              'integramos toda tu información financiera en una plataforma 100% data driven, potenciada por'
            )}{' '}
            <span className="gradient-blue-ligth"> {t('agentes de IA')} </span>{' '}
            {t(
              'que anticipan tu liquidez y simulan escenarios para orientar decisiones financieras más precisas.'
            )}
          </p>

          <p>
            {t('')}<span className="gradient-blue-ligth">
              {' '}
              {t('Hacemos que el mercado financiero compita por tu liquidez : ')}
            </span>
            {t(
              'El menor costo cuando necesitas caja y el mejor retorno cuando tienes excedentes.'
            )}
          </p>

          <div className="driver ">
            <p className="gradient-border-left">
              {t('De hojas de cálculo y tareas manuales')}{' '}
              <span className="arrow gradient-blue-ligth"> {t('→')} </span>{' '}
              {t('a decisiones precisas, confiables y asistidas desde una única plataforma.')}
            </p>
          </div>

          <ul className="checks" role="tablist" aria-label="Slide selector">
            {slides.map((c, i) => (
              <li key={c.id ?? i} role="presentation">
                <button
                  type="button"
                  className={`check lis-checks ${
                    i === index ? 'gradient-blue-ligth' : 'check-desactive'
                  }`}
                  role="tab"
                  aria-selected={i === index}
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => setIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') setIndex((i + 1) % total)
                    if (e.key === 'ArrowLeft') setIndex((i - 1 + total) % total)
                  }}
                >
                  <IconoSvg name="check" />
                  <span>{c.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
