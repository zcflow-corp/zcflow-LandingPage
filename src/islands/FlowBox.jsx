import React, { useEffect, useRef, useState } from 'react'

const PHASES = {
  NEGATIVE: 'NEGATIVE',
  ACTING: 'ACTING',
  SOLVED: 'SOLVED',
}
const labelsX = ['24-Nov', '25-Nov', '26-Nov', '27-Nov', '28-Nov', '29-Nov']

// Serie base (parecida a tus imágenes)
const negativeSeries = [12000, 16000, 17000, -12000, 19500, 14000]
const solvedSeries = [15000, 20500, 20800, 21000, 19500, 16000]

// helper: serie interpolada según t (0 = negativa, 1 = resuelta)
const getInterpolatedSeries = (t) => negativeSeries.map((v, i) => v + (solvedSeries[i] - v) * t)

const FlowBox = ({ t: _t }) => {
  const text = typeof _t === 'function' ? _t : (k) => k
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)

  const [phase, setPhase] = useState(PHASES.NEGATIVE)
  const [t, setT] = useState(0) // 0 = serie negativa, 1 = serie positiva

  // -------------- CONTROL DEL CICLO (NEGATIVE → ACTING (animación) → SOLVED) -------------
  useEffect(() => {
    let rafId
    let cycleStart = performance.now()

    const loop = (now) => {
      const elapsed = now - cycleStart

      let newPhase
      let newT

      // 0–2000ms: flujo negativo estático
      if (elapsed < 2000) {
        newPhase = PHASES.NEGATIVE
        newT = 0
      }
      // 2000–4000ms: Zcflow + Optimizador actuando, animamos de -8,000 → 20,800
      else if (elapsed < 4000) {
        newPhase = PHASES.ACTING
        const local = Math.min(1, (elapsed - 2000) / 2000)
        // easing suave
        newT = local * local * (3 - 2 * local)
      }
      // 4000–6000ms: flujo solucionado estático
      else if (elapsed < 6000) {
        newPhase = PHASES.SOLVED
        newT = 1
      } else {
        // reiniciamos ciclo
        cycleStart = now
        newPhase = PHASES.NEGATIVE
        newT = 0
      }

      setPhase(newPhase)
      setT(newT)

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // -------------- DIBUJO DEL GRÁFICO EN CANVAS ----------------
  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const rect = wrapper.getBoundingClientRect()
    const width = rect.width || 600
    const height = rect.height || 260

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // colores desde tokens
    const styles = getComputedStyle(document.documentElement)
    const cPrimary = (styles.getPropertyValue('--c-white') || '#0563ff').trim()
    const cError = (styles.getPropertyValue('--c-error') || '#f5222d').trim()
    const cLine = (styles.getPropertyValue('--c-line') || '#a8a8a8').trim()

    const minY = -20000
    const maxY = 40000

    // márgenes (dejamos espacio a la derecha para la leyenda)
    const margin = { top: 34, right: 60, bottom: 36, left: 44 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom

    // serie interpolada según t
    const serie = getInterpolatedSeries(t)

    // índice del punto de foco: SIEMPRE el mínimo de la serie interpolada
    let minIndex = 0
    for (let i = 1; i < serie.length; i++) {
      if (serie[i] < serie[minIndex]) minIndex = i
    }
    const minValue = serie[minIndex]
    const showFocus = minValue < 0 // si el mínimo ya es ≥ 0, desaparece el foco

    const xFor = (i) => margin.left + (i / (serie.length - 1 || 1)) * w
    const yFor = (val) => {
      const norm = (val - minY) / (maxY - minY)
      return margin.top + (1 - norm) * h
    }

    // limpiar fondo pero mantener TRANSPARENCIA
    ctx.clearRect(0, 0, width, height)

    // grid horizontal (con color de línea del tema)
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(168,168,168,0.22)'
    if (cLine.startsWith('#')) {
      // si quieres algo más preciso podrías convertir el hex a rgba aquí
      ctx.strokeStyle = 'rgba(168,168,168,0.22)'
    }
    const gridCount = 5
    for (let i = 0; i <= gridCount; i++) {
      const y = margin.top + (h / gridCount) * i
      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width - margin.right, y)
      ctx.stroke()
    }

    // línea principal (usa color primario de tokens)
    ctx.beginPath()
    serie.forEach((v, i) => {
      const x = xFor(i)
      const y = yFor(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineWidth = 2
    ctx.strokeStyle = cPrimary
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.stroke()

    if (showFocus) {
      // coordenadas del punto mínimo (punto de foco)
      const focusX = xFor(minIndex)
      const focusY = yFor(serie[minIndex])

      // si el mínimo es negativo, segmento previo en rojo
      if (minValue < 0 && minIndex > 0) {
        const prevX = xFor(minIndex - 1)
        const prevY = yFor(serie[minIndex - 1])

        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(focusX, focusY)
        ctx.lineWidth = 2
        ctx.strokeStyle = cError
        ctx.stroke()
      }

      // línea vertical punteada
      ctx.save()
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = 'rgba(148,163,184,0.8)'
      ctx.beginPath()
      ctx.moveTo(focusX, margin.top)
      ctx.lineTo(focusX, height - margin.bottom)
      ctx.stroke()
      ctx.restore()

      // círculo externo (rojo si valor negativo, azul si positivo)
      const isNegativeNow = minValue < 0

      ctx.beginPath()
      ctx.arc(focusX, focusY, 9, 0, Math.PI * 2)
      ctx.lineWidth = 2
      ctx.strokeStyle = isNegativeNow ? cError : cPrimary
      ctx.stroke()

      // círculo interno
      ctx.beginPath()
      ctx.arc(focusX, focusY, 4, 0, Math.PI * 2)
      ctx.fillStyle = isNegativeNow ? cError : cPrimary
      ctx.fill()

      // glow cuando Zcflow está actuando
      if (phase === PHASES.ACTING) {
        ctx.beginPath()
        ctx.arc(focusX, focusY, 18, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(focusX, focusY, 0, focusX, focusY, 18)
        g.addColorStop(0, 'rgba(5,99,255,0.25)')
        g.addColorStop(1, 'rgba(5,99,255,0)')
        ctx.fillStyle = g
        ctx.fill()
      }
    }
  }, [t, phase])

  // -------------- UI: título, tooltip, leyendas, chips -----------------

  // mismos datos que el canvas para tooltip/leyenda
  const serie = getInterpolatedSeries(t)
  let minIndex = 0
  for (let i = 1; i < serie.length; i++) {
    if (serie[i] < serie[minIndex]) minIndex = i
  }
  const focusValue = serie[minIndex]
  const isNegative = focusValue < 0

  const formatted = Math.abs(focusValue).toLocaleString('es-PE', {
    maximumFractionDigits: 0,
  })

  const title =
    phase === PHASES.SOLVED ? text('Flujo de caja solucionado') : text('Flujo de caja proyectado')

  return (
    <section className="flowbox">
      <div className="flowbox__header">
        <div>
          <h3 className="flowbox__title">{title}</h3>
          <p className="flowbox__subtitle">PEN</p>
        </div>
      </div>

      <div className="flowbox__canvas-wrapper" ref={wrapperRef}>
        <canvas ref={canvasRef} className="flowbox__canvas" />

        {/* Tooltip: rojo cuando el mínimo es negativo, normal cuando es positivo */}
        <div
          className={
            'flowbox__tooltip ' +
            (isNegative ? 'flowbox__tooltip--negative' : 'flowbox__tooltip--positive')
          }
        >
          <span className="flowbox__tooltip-text">
            {isNegative ? '-' : ''}
            {formatted}
          </span>
        </div>

        {/* Leyenda numérica del flujo a la derecha (-20k → 40k) */}
        <div className="flowbox__ylabels">
          <span>40,000</span>
          <span>20,000</span>
          <span>0</span>
          <span>-10,000</span>
          <span>-20,000</span>
        </div>

        {/* Soluciones Zcflow + Optimizador (solo cuando está actuando) */}
        <div
          className={'flowbox__chips ' + (phase === PHASES.ACTING ? 'flowbox__chips--visible' : '')}
        >
          <div className="flowbox__chip flowbox__chip--zcflow">
            <span className="flowbox__chip-spinner" />
            <span>{text('Soluciones Zcflow')}</span>
          </div>
          <div className="flowbox__chip flowbox__chip--optimizer">{text('Optimizador')}</div>
        </div>
      </div>

      {/* eje X (fechas) */}
      <footer className="flowbox__footer">
        {labelsX.map((label) => (
          <span key={label} className="flowbox__tick">
            {label}
          </span>
        ))}
      </footer>
    </section>
  )
}

export default FlowBox
