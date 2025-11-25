import React, { useEffect, useState } from 'react'

const TABLE_DATES = ['01/11/25', '02/11/25', '03/11/25', '04/11/25', '05/11/25', '06/11/25']

const TABLE_ROWS = [
  {
    label: '[-] Saldo',
    values: ['460,000.00', '460,000.00', '460,000.00', '460,000.00', '460,000.00', '460,000.00'],
  },
  {
    label: '[+] Bancos',
    values: ['460,000.00', '460,000.00', '460,000.00', '460,000.00', '460,000.00', '460,000.00'],
  },
  {
    label: '[+] Ingreso',
    values: ['30,000.00', '60,000.00', '40,000.00', '90,000.00', '100,000.00', '80,000.00'],
  },
  {
    label: '[+] Clientes terceros',
    values: ['30,000.00', '30,000.00', '30,000.00', '30,000.00', '30,000.00', '30,000.00'],
  },
  {
    label: '[+] Clientes relacionados',
    values: ['—', '60,000.00', '90,000.00', '—', '80,000.00', '40,000.00'],
  },
  {
    label: '[+] Inversión',
    values: ['—', '—', '—', '—', '—', '—'],
  },
  {
    label: '[-] Egreso',
    values: ['40,000.00', '140,000.00', '20,000.00', '30,000.00', '120,000.00', '150,000.00'],
  },
  {
    label: '[+] Proveedores',
    values: ['40,000.00', '140,000.00', '20,000.00', '30,000.00', '110,000.00', '80,000.00'],
  },
  {
    label: '[+] Personal',
    values: ['—', '—', '—', '—', '—', '—'],
  },
]

const TOTAL_PERIODO = [
  '450,000.00',
  '-80,000.00',
  '90,000.00',
  '70,000.00',
  '-30,000.00',
  '20,000.00',
]
const TOTAL_ACUMULADO = [
  '450,000.00',
  '370,000.00',
  '460,000.00',
  '530,000.00',
  '500,000.00',
  '490,000.00',
]

const CHART_POINTS = [
  { label: '18-Nov', value: 12000 },
  { label: '19-Nov', value: 16000 },
  { label: '20-Nov', value: 17000 },
  { label: '21-Nov', value: 15500 },
  { label: '22-Nov', value: 23000 },
  { label: '23-Nov', value: 14000 },
]

const FlowDecision = () => {
  // 'table' -> se ve tabla, 'chart' -> se ve gráfica
  const [stage, setStage] = useState('table')
  const [animateLine, setAnimateLine] = useState(false)

  // cambio automático tabla -> gráfica
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('chart')
      setAnimateLine(true) // dispara animación del trazo
    }, 6000) // tiempo que se muestra la tabla
    return () => clearTimeout(timer)
  }, [])

  const chartPath = React.useMemo(() => {
    if (!CHART_POINTS.length) return ''
    const values = CHART_POINTS.map((p) => p.value)
    const max = Math.max(...values, 1)
    const min = Math.min(...values, 0)
    const range = max - min || 1

    const w = 480
    const h = 180
    const paddingX = 30
    const paddingY = 20

    return CHART_POINTS.map((point, index) => {
      const x = paddingX + (index / Math.max(CHART_POINTS.length - 1, 1)) * (w - paddingX * 2)
      const y = h - paddingY - ((point.value - min) / range) * (h - paddingY * 2)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }, [])

  return (
    <section className="flow-decision-box">
      <div className="flow-decision-box__card">
        {/* PANEL: TABLA */}
        <div
          className={
            'flow-decision-box__panel flow-decision-box__panel--table ' +
            (stage === 'table' ? 'is-visible' : 'is-hidden')
          }
        >
          <div className="flow-decision-box__tabs">
            <button className="flow-decision-box__tab flow-decision-box__tab--active">
              Flujo Inicial
            </button>
            <button className="flow-decision-box__tab">Flujo Solucionado</button>
          </div>

          <div className="flow-decision-box__filters">
            <div className="flow-decision-box__filter">
              <span>Periodicidad:</span>
              <button className="flow-decision-box__select">DIARIO ▾</button>
            </div>
            <div className="flow-decision-box__filter">
              <span>Moneda:</span>
              <button className="flow-decision-box__select">PEN ▾</button>
            </div>
            <div className="flow-decision-box__filter">
              <span>Sociedad:</span>
              <button className="flow-decision-box__select">Seleccionados: Todos ▾</button>
            </div>
          </div>

          <div className="flow-decision-box__table-wrapper">
            <table className="flow-decision-box__table">
              <thead>
                <tr>
                  <th className="is-sticky">Posición \ Periodo</th>
                  {TABLE_DATES.map((date) => (
                    <th key={date}>{date}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="is-sticky">{row.label}</td>
                    {row.values.map((val, idx) => (
                      <td key={idx}>{val}</td>
                    ))}
                  </tr>
                ))}

                <tr className="is-total-periodo">
                  <td className="is-sticky">Total Periodo</td>
                  {TOTAL_PERIODO.map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>

                <tr className="is-total-acumulado">
                  <td className="is-sticky">Total Acumulado</td>
                  {TOTAL_ACUMULADO.map((val, idx) => (
                    <td key={idx}>{val}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL: GRÁFICA */}
        <div
          className={
            'flow-decision-box__panel flow-decision-box__panel--chart ' +
            (stage === 'chart' ? 'is-visible' : 'is-hidden')
          }
        >
          <div className="flow-decision-box__chart-header">
            <h3>¿Cómo va mi liquidez?</h3>
            <p>Flujo de caja Real - PEN</p>
          </div>

          <div className="flow-decision-box__chart-body">
            <svg viewBox="0 0 480 220" className="flow-decision-box__chart-svg" aria-hidden="true">
              {/* líneas guía */}
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1="40"
                  x2="460"
                  y1={220 * ratio}
                  y2={220 * ratio}
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="1"
                />
              ))}

              {/* línea principal con animación */}
              <path
                d={chartPath}
                className={
                  'flow-decision-box__chart-line ' +
                  (animateLine ? 'flow-decision-box__chart-line--animate' : '')
                }
                fill="none"
              />

              {/* puntos */}
              {CHART_POINTS.map((point, index) => {
                const values = CHART_POINTS.map((p) => p.value)
                const max = Math.max(...values, 1)
                const min = Math.min(...values, 0)
                const range = max - min || 1

                const w = 480
                const h = 180
                const paddingX = 30
                const paddingY = 20

                const x =
                  paddingX + (index / Math.max(CHART_POINTS.length - 1, 1)) * (w - paddingX * 2)
                const y = h - paddingY - ((point.value - min) / range) * (h - paddingY * 2)

                return <circle key={point.label} cx={x} cy={y} r="3" fill="#4773ff" />
              })}
            </svg>

            <div className="flow-decision-box__chart-xlabels">
              {CHART_POINTS.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlowDecision
