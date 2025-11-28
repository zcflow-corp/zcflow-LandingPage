// FlowConexion.jsx
import React, { useEffect, useRef } from 'react'
const base = import.meta.env.BASE_URL
const BANK_SVG_BASE = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path fill="#292D32" d="M13.05 16.25h-1.88c-1.33 0-2.42-1.12-2.42-2.5 0-.41.34-.75.75-.75s.75.34.75.75c0 .55.41 1 .92 1h1.88c.39 0 .7-.35.7-.78 0-.54-.15-.62-.49-.74l-3.01-1.05c-.64-.23-1.5-.69-1.5-2.16 0-1.25.99-2.28 2.2-2.28h1.88c1.33 0 2.42 1.12 2.42 2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.55-.41-1-.92-1h-1.88c-.39 0-.7.35-.7.78 0 .54.15.62.49.74l3.01 1.05c.64.23 1.5.69 1.5 2.16 0 1.26-.99 2.28-2.2 2.28Z"/>
  <path fill="#292D32" d="M12 17.25c-.41 0-.75-.34-.75-.75v-9c0-.41.34-.75.75-.75s.75.34.75.75v9c0 .41-.34.75-.75.75Z"/>
  <path fill="#292D32" d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25c.41 0 .75.34.75.75s-.34.75-.75.75C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25c0-.41.34-.75.75-.75s.75.34.75.75c0 5.93-4.82 10.75-10.75 10.75Zm10-16c-.41 0-.75-.34-.75-.75V2.75H18c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75v4c0 .41-.34.75-.75.75Z"/>
  <path fill="#292D32" d="M17 7.75c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l5-5c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-5 5c-.15.15-.34.22-.53.22Z"/>
</svg>`

const DATA_SVG_BASE = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path fill="#292D32" d="M9 22.75H7c-4.41 0-5.75-1.34-5.75-5.75V7c0-4.41 1.34-5.75 5.75-5.75h1.5c1.75 0 2.3.57 3 1.5l1.5 2c.33.44.38.5 1 .5h3c4.41 0 5.75 1.34 5.75 5.75v2c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-2c0-3.57-.67-4.25-4.25-4.25h-3c-1.28 0-1.7-.44-2.2-1.1l-1.5-2c-.52-.69-.68-.9-1.8-.9H7c-3.58 0-4.25.68-4.25 4.25v10c0 3.57.67 4.25 4.25 4.25h2c.41 0 .75.34.75.75s-.34.75-.75.75Z"/>
  <path fill="#292D32" d="M19.34 22.81h-5.59c-1.67-.12-2.51-1.4-2.51-2.62 0-.98.55-2.01 1.61-2.43-.22-1.25.1-2.41.93-3.28 1.02-1.07 2.66-1.5 4.08-1.07 1.24.38 2.13 1.36 2.5 2.72 1.05.32 1.88 1.15 2.22 2.28.4 1.31.03 2.65-.96 3.51-.6.57-1.42.89-2.28.89Zm-5.55-3.74c-.76.07-1.04.64-1.04 1.12 0 .48.28 1.06 1.06 1.12h5.51c.48.04.96-.18 1.32-.5.65-.57.69-1.38.52-1.96-.17-.58-.67-1.23-1.51-1.34a.753.753 0 0 1-.65-.62c-.22-1.35-.98-1.85-1.57-2.04-.88-.27-1.92.01-2.55.67-.43.45-.85 1.26-.38 2.55a.75.75 0 0 1-.45.96c-.09.03-.18.04-.26.04Z"/>
</svg>`

const MOVEMENT_SVG_BASE = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path fill="#292D32" d="M3.93 16.63c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06L15.35 3.4c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L4.46 16.42c-.14.14-.34.21-.53.21Zm7.17 2.4c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l1.2-1.2c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-1.2 1.2a.75.75 0 0 1-.53.22Zm2.69-2.69c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.39-2.39c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.39 2.39c-.14.14-.34.22-.53.22Z"/>
  <path fill="#292D32" d="M11.1 22.75c-.98 0-1.96-.6-3.15-1.79l-4.91-4.91c-2.39-2.39-2.38-3.93.03-6.34l6.64-6.64c2.41-2.41 3.95-2.42 6.34-.03l4.91 4.91c2.39 2.39 2.38 3.93-.03 6.34l-6.64 6.64c-1.21 1.21-2.2 1.82-3.19 1.82Zm1.8-20c-.52 0-1.18.43-2.13 1.38l-6.64 6.64c-.95.95-1.38 1.61-1.38 2.12 0 .52.4 1.15 1.35 2.1l4.91 4.91c.95.95 1.57 1.35 2.09 1.35h.01c.52 0 1.17-.43 2.12-1.38l6.64-6.64c.95-.95 1.38-1.61 1.38-2.12 0-.52-.4-1.15-1.35-2.1L14.99 4.1c-.94-.95-1.57-1.35-2.09-1.35Z"/>
  <path fill="#292D32" d="M22 22.75H2c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h20c.41 0 .75.34.75.75s-.34.75-.75.75Z"/>
</svg>`

const ICON_SVGS_BASE = {
  bank: BANK_SVG_BASE,
  data: DATA_SVG_BASE,
  movement: MOVEMENT_SVG_BASE,
}

const DEFAULT_LABELS = {
  bank: 'Open Banking',
  data: 'RPA-ERPs',
  movement: 'Fintechs, inversionistas y otros',
}

// Crea imágenes para un color dado (gris/azul)
const createIconImages = (color) => {
  const imgs = {}
  Object.entries(ICON_SVGS_BASE).forEach(([key, svg]) => {
    const coloredSvg = svg.replace(/#292D32/gi, color)
    const img = new Image()
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(coloredSvg)
    imgs[key] = img
  })
  return imgs
}

const FlowConexion = ({
  labels = ['Open Banking', 'RPA-ERPs', 'Fintechs, inversionistas y otros'],
  rotationMs = 9000,
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const block = containerRef.current
    if (!block) return

    const canvas = block.querySelector('.flow-conexion__canvas')
    const labelEl = block.querySelector('.flow-conexion__label-text')
    const logoImg = block.querySelector('.flow-logo__img')

    if (!canvas || !labelEl || !logoImg) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Colores para activo/inactivo
    const iconColorActive = '#0563ff' // azul
    const iconColorInactive = '#a8a8a8' // gris

    const iconImagesActive = createIconImages(iconColorActive)
    const iconImagesInactive = createIconImages(iconColorInactive)

    // Labels desde props
    let labelMap = { ...DEFAULT_LABELS }
    if (Array.isArray(labels) && labels.length === 3) {
      labelMap = {
        bank: String(labels[0]),
        data: String(labels[1]),
        movement: String(labels[2]),
      }
    }

    const icons = ['bank', 'data', 'movement']

    let logoCenter = { x: 0, y: 0 }

    const resize = () => {
      const wrapRect = canvas.parentElement.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = wrapRect.width * dpr
      canvas.height = wrapRect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const logoRect = logoImg.getBoundingClientRect()
      const canvasRect = canvas.getBoundingClientRect()
      logoCenter = {
        x: logoRect.left - canvasRect.left + logoRect.width / 2,
        y: logoRect.top - canvasRect.top + logoRect.height / 2,
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const rootStyle = getComputedStyle(document.documentElement)
    const cPrimary = rootStyle.getPropertyValue('--c-primary')?.trim() || '#0563ff'
    const cPrimaryAcc = rootStyle.getPropertyValue('--c-primary-accessible')?.trim() || cPrimary
    const cLineAcc = rootStyle.getPropertyValue('--c-line-acc')?.trim() || '#ced4da'

    const drawZGlow = (x, y, size) => {
      ctx.save()
      const grad = ctx.createRadialGradient(x, y, size * 0.15, x, y, size)
      grad.addColorStop(0, 'rgba(5, 101, 255, 0.51)')
      grad.addColorStop(0.45, 'rgba(5,99,255,0.25)')
      grad.addColorStop(1, 'rgba(5,99,255,0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawLightFlow = (startX, endX, y, elapsed) => {
      const length = endX - startX
      if (length <= 0) return
      const speed = 120
      const t = ((elapsed / 1000) * speed) % length
      const count = 6

      for (let i = 0; i < count; i++) {
        const offset = (length / count) * i
        const pos = (t + offset) % length
        const x = startX + pos

        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7)
        g.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
        g.addColorStop(0.35, 'rgba(5,99,255,0.9)')
        g.addColorStop(1, 'rgba(5, 101, 255, 0.09)')
        ctx.fillStyle = g
        ctx.shadowColor = 'rgba(5,99,255,1)'
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.restore()
      }
    }

    const drawIconCard = (img, x, y, size, { active = false, opacity = 1 } = {}) => {
      const radius = active ? 12 : 8
      const w = active ? size * 0.8 : size * 0.5
      const h = active ? size * 0.8 : size * 0.5

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.translate(x - w / 2, y - h / 2)

      ctx.shadowColor = active ? 'rgba(7,19,129,0.28)' : 'rgba(7,19,129,0.08)'
      ctx.shadowBlur = active ? 22 : 8
      ctx.shadowOffsetY = 0

      ctx.fillStyle = active ? 'white' : 'transparent'
      ctx.strokeStyle = active ? cPrimaryAcc : 'rgba(226,226,226,0.8)'
      ctx.lineWidth = active ? 1.2 : 0.5
      ctx.beginPath()
      ctx.moveTo(radius, 0)
      ctx.lineTo(w - radius, 0)
      ctx.quadraticCurveTo(w, 0, w, radius)
      ctx.lineTo(w, h - radius)
      ctx.quadraticCurveTo(w, h, w - radius, h)
      ctx.lineTo(radius, h)
      ctx.quadraticCurveTo(0, h, 0, h - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      if (img && img.complete) {
        const iw = img.width || 24
        const ih = img.height || 24
        const scale = (h * 0.45) / Math.max(iw, ih)
        const iconW = iw * scale
        const iconH = ih * scale
        ctx.shadowBlur = 0
        ctx.drawImage(img, (w - iconW) / 2, (h - iconH) / 2, iconW, iconH)
      }

      ctx.restore()
    }

    let startTime = performance.now()
    let frameId

    const loop = (now) => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const elapsed = now - startTime

      ctx.clearRect(0, 0, w, h)

      const radius = 20
      ctx.save()
      ctx.fillStyle = 'transparent'
      ctx.shadowColor = 'none'
      ctx.shadowBlur = 26
      ctx.beginPath()
      ctx.moveTo(radius, 0)
      ctx.lineTo(w - radius, 0)
      ctx.quadraticCurveTo(w, 0, w, radius)
      ctx.lineTo(w, h - radius)
      ctx.quadraticCurveTo(w, h, w - radius, h)
      ctx.lineTo(radius, h)
      ctx.quadraticCurveTo(0, h, 0, h - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      const centerY = h * 0.52

      const orbitCenterX = w * 0.23
      const orbitCenterY = centerY
      const rx = Math.min(w * 0.19, 140)
      const ry = h * 0.38
      const startAng = -1.1
      const endAng = 1.1
      const targetAngle = 0

      ctx.save()
      const gradLine = ctx.createLinearGradient(
        orbitCenterX,
        orbitCenterY - ry,
        orbitCenterX,
        orbitCenterY + ry
      )
      gradLine.addColorStop(0, 'rgba(127,174,255,0)')
      gradLine.addColorStop(0.5, 'rgba(5,99,255,0.9)')
      gradLine.addColorStop(1, 'rgba(7,19,129,0)')
      ctx.strokeStyle = gradLine
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.ellipse(orbitCenterX, orbitCenterY, rx, ry, 0, startAng, endAng, false)
      ctx.stroke()
      ctx.restore()

      const joinX = orbitCenterX + Math.cos(targetAngle) * rx
      const joinY = orbitCenterY + Math.sin(targetAngle) * ry

      const dashedStartX = joinX
      const dashedEndX = logoCenter.x - 24

      ctx.save()
      ctx.strokeStyle = cLineAcc
      ctx.lineWidth = 1.4
      ctx.setLineDash([4, 5])
      ctx.beginPath()
      ctx.moveTo(dashedStartX, joinY)
      ctx.lineTo(dashedEndX, joinY)
      ctx.stroke()
      ctx.restore()

      drawLightFlow(dashedStartX, dashedEndX, joinY, elapsed)

      const logoSize = Math.min(w, h) * 0.22
      // drawZGlow(logoCenter.x, logoCenter.y, logoSize)

      const cycleT = (elapsed % rotationMs) / rotationMs

      let activeKey = icons[0]
      let minAngleDist = Infinity

      icons.forEach((key, index) => {
        const localT = (cycleT + index / icons.length) % 1
        const angle = startAng + (endAng - startAng) * localT

        const x = orbitCenterX + Math.cos(angle) * rx
        const y = orbitCenterY + Math.sin(angle) * ry

        const angleDist = Math.abs(angle - targetAngle)
        if (angleDist < minAngleDist) {
          minAngleDist = angleDist
          activeKey = key
        }

        const norm = 1 - Math.min(angleDist / (endAng - startAng), 1)
        const size = 52 + norm * 28
        const opacity = 0.5 + norm * 0.8

        const img = key === activeKey ? iconImagesActive[key] : iconImagesInactive[key]

        drawIconCard(img, x, y, size, {
          active: key === activeKey,
          opacity,
        })
      })

      labelEl.textContent = labelMap[activeKey] || ''

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [labels, rotationMs])

  return (
    <section
      ref={containerRef}
      className="flow-conexion"
      data-flow-conexion
      data-labels={JSON.stringify(labels)}
      data-rotation-ms={rotationMs}
    >
      <div className="flow-conexion__inner">
        {/* Canvas donde se dibuja TODO */}
        <canvas className="flow-conexion__canvas" />

        {/* Logo Zcflow (posición fija, el canvas dibuja glow + línea hasta aquí) */}
        <div className="flow-logo">
          <img
            src={`${base}assets/logo_header_light.webp`}
            alt="ZCFlow"
            className="flow-logo__img"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Texto dinámico sincronizado con el icono central */}
        <div className="flow-conexion__label">
          <span className="flow-conexion__label-text" />
        </div>
      </div>
    </section>
  )
}

export default FlowConexion
