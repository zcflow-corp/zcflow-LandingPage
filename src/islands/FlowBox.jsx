// src/islands/FlowBox.jsx
import React, { useEffect, useRef, useState } from 'react'

const PHASES = {
  NEGATIVE: 'NEGATIVE',
  ACTING: 'ACTING',
  SOLVED: 'SOLVED',
}

const labelsX = ['24-Nov', '25-Nov', '26-Nov', '27-Nov', '28-Nov', '29-Nov']

// Serie base (parecida a tus imágenes)
const negativeSeries = [12000, 16000, 17000, -8000, 19500, 14000]
const solvedSeries = [15000, 20500, 20800, 21000, 19500, 16000]
const activeIndex = 2 // 26-Nov

const FlowBox = () => {
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

      let newPhase = phase
      let newT = t

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

    const minY = -20000
    const maxY = 40000

    // márgenes (dejamos espacio a la derecha para la leyenda)
    const margin = { top: 34, right: 60, bottom: 36, left: 44 }
    const w = width - margin.left - margin.right
    const h = height - margin.top - margin.bottom

    // serie interpolada según t
    const serie = negativeSeries.map((v, i) => {
      const to = solvedSeries[i]
      return v + (to - v) * t
    })

    const xFor = (i) => margin.left + (i / (serie.length - 1 || 1)) * w

    const yFor = (val) => {
      const norm = (val - minY) / (maxY - minY)
      return margin.top + (1 - norm) * h
    }

    // limpiar fondo
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // grid horizontal
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(15,23,42,0.06)'
    const gridCount = 5
    for (let i = 0; i <= gridCount; i++) {
      const y = margin.top + (h / gridCount) * i
      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(width - margin.right, y)
      ctx.stroke()
    }

    // linea principal azul (serie interpolada)
    ctx.beginPath()
    serie.forEach((v, i) => {
      const x = xFor(i)
      const y = yFor(v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.lineWidth = 2
    ctx.strokeStyle = '#4F46E5'
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.stroke()

    // valor actual en el punto 26-Nov
    const activeValue =
      negativeSeries[activeIndex] + (solvedSeries[activeIndex] - negativeSeries[activeIndex]) * t
    const isNegativeNow = activeValue < 0

    // si SIGUE negativo (fase NEGATIVE o inicio de ACTING) pintamos
    // el segmentito al punto en rojo, para remarcar el problema
    if (isNegativeNow) {
      const prevX = xFor(activeIndex - 1)
      const prevY = yFor(serie[activeIndex - 1])
      const actX = xFor(activeIndex)
      const actY = yFor(serie[activeIndex])

      ctx.beginPath()
      ctx.moveTo(prevX, prevY)
      ctx.lineTo(actX, actY)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#DC2626'
      ctx.stroke()
    }

    // coordenadas del punto activo
    const activeX = xFor(activeIndex)
    const activeY = yFor(serie[activeIndex])

    // línea vertical punteada
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = 'rgba(148,163,184,0.8)'
    ctx.beginPath()
    ctx.moveTo(activeX, margin.top)
    ctx.lineTo(activeX, height - margin.bottom)
    ctx.stroke()
    ctx.restore()

    // círculo externo (rojo si valor negativo, azul si positivo)
    ctx.beginPath()
    ctx.arc(activeX, activeY, 9, 0, Math.PI * 2)
    ctx.lineWidth = 2
    ctx.strokeStyle = isNegativeNow ? 'rgba(220,38,38,0.9)' : 'rgba(129,140,248,0.9)'
    ctx.stroke()

    // círculo interno
    ctx.beginPath()
    ctx.arc(activeX, activeY, 4, 0, Math.PI * 2)
    ctx.fillStyle = isNegativeNow ? '#DC2626' : '#4F46E5'
    ctx.fill()

    // glow cuando Zcflow está actuando
    if (phase === PHASES.ACTING) {
      ctx.beginPath()
      ctx.arc(activeX, activeY, 18, 0, Math.PI * 2)
      const g = ctx.createRadialGradient(activeX, activeY, 0, activeX, activeY, 18)
      g.addColorStop(0, 'rgba(79,70,229,0.25)')
      g.addColorStop(1, 'rgba(79,70,229,0)')
      ctx.fillStyle = g
      ctx.fill()
    }
  }, [t, phase])

  // -------------- UI: título, tooltip, leyendas, chips -----------------

  const activeValue =
    negativeSeries[activeIndex] + (solvedSeries[activeIndex] - negativeSeries[activeIndex]) * t
  const isNegative = activeValue < 0

  const formatted = Math.abs(activeValue).toLocaleString('es-PE', {
    maximumFractionDigits: 0,
  })

  const title = phase === PHASES.SOLVED ? 'Flujo de caja solucionado' : 'Flujo de caja proyectado'

  return (
    <section className="flowbox">
      <header className="flowbox__header">
        <div>
          <h3 className="flowbox__title">{title}</h3>
          <p className="flowbox__subtitle">PEN</p>
        </div>
      </header>

      <div className="flowbox__canvas-wrapper" ref={wrapperRef}>
        <canvas ref={canvasRef} className="flowbox__canvas" />

        {/* Tooltip: rojo cuando es negativo, gris oscuro cuando es positivo */}
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
            <span>Soluciones Zcflow</span>
          </div>
          <div className="flowbox__chip flowbox__chip--optimizer">Optimizador</div>
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
