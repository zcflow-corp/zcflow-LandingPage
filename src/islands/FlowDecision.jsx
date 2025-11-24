// src/islands/FlowDecision.jsx
import React, { useEffect, useRef, useState } from 'react'

/**
 * FlowDecision
 * Animación de líneas que fluyen de izquierda a derecha (fondo transparente).
 *
 * Props:
 *  - height?: número (alto del canvas en px). Default: 260
 */
const FlowDecision = ({ height = 260 }) => {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const [dims, setDims] = useState({ width: 600, height })

  // Medir el ancho del contenedor
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const update = () => {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0) {
        setDims({
          width: rect.width,
          height,
        })
      }
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { width, height: h } = dims

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = h * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${h}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Config de líneas: posición base (0–1) y amplitud de curva
    const lines = [
      { base: 0.3, amp: -40, offset: 0.0 },
      { base: 0.4, amp: -15, offset: 0.08 },
      { base: 0.5, amp: 10, offset: 0.16 },
      { base: 0.6, amp: 25, offset: 0.24 },
      { base: 0.7, amp: 35, offset: 0.32 },
    ]

    const duration = 4000 // ms para una vuelta

    let rafId

    const render = (time) => {
      const tNorm = (time % duration) / duration // 0–1

      // Fondo transparente: sólo limpiar
      ctx.clearRect(0, 0, width, h)

      const maxX = width * 0.6 // hasta dónde llegan las líneas

      lines.forEach((line, idx) => {
        // Progreso local (con pequeño desfase entre líneas)
        let local = tNorm * 1.2 - line.offset
        if (local <= 0) return
        if (local > 1) local = 1

        const baseY = line.base * h
        const endX = maxX * local
        const ctrlX = endX * 0.5
        const ctrlY = baseY + line.amp

        // Línea curva
        ctx.beginPath()
        ctx.moveTo(0, baseY)
        ctx.quadraticCurveTo(ctrlX, ctrlY, endX, baseY + line.amp * 0.4)

        const opacity = 0.25 + 0.15 * (1 - idx / lines.length)
        ctx.lineWidth = 1.6
        ctx.strokeStyle = `rgba(79, 70, 229, ${opacity})`
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

        // Punto al frente de la línea
        ctx.beginPath()
        ctx.arc(endX, baseY + line.amp * 0.4, 3.3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(79, 70, 229, 0.95)'
        ctx.fill()
      })

      // “logo” Z simplificado al final de las líneas
      const logoX = maxX + 26
      const logoY = h * 0.5
      const logoR = 12

      // glow
      ctx.beginPath()
      ctx.arc(logoX, logoY, logoR + 8, 0, Math.PI * 2)
      const glow = ctx.createRadialGradient(logoX, logoY, 0, logoX, logoY, logoR + 16)
      glow.addColorStop(0, 'rgba(79,70,229,0.30)')
      glow.addColorStop(1, 'rgba(79,70,229,0)')
      ctx.fillStyle = glow
      ctx.fill()

      // círculo blanco + borde
      ctx.beginPath()
      ctx.arc(logoX, logoY, logoR, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = '#4F46E5'
      ctx.stroke()

      // pequeña “Z”
      ctx.beginPath()
      ctx.moveTo(logoX - 5, logoY - 4)
      ctx.lineTo(logoX + 4, logoY - 4)
      ctx.lineTo(logoX - 4, logoY + 4)
      ctx.lineTo(logoX + 5, logoY + 4)
      ctx.lineWidth = 1.8
      ctx.strokeStyle = '#4F46E5'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => cancelAnimationFrame(rafId)
  }, [dims])

  return (
    <div ref={wrapperRef} className="flow-decision" style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} className="flow-decision__canvas" />
    </div>
  )
}

export default FlowDecision
