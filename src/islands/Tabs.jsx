import React from 'react'

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

export default function Tabs() {
  const [data, setData] = React.useState({ pestañas: [] })
  const [active, setActive] = React.useState(0)
  const [status, setStatus] = React.useState('idle')
  const loadTabs = React.useCallback(async () => {
    setStatus('loading')
    try {
      const locale = getLocaleFromDoc()
      const base = ''
      const url = `${base}/data/${locale}/tabs.json?v=${Date.now()}`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setActive(0)
      setStatus('idle')
    } catch (e) {
      console.error('Error cargando tabs', e)
      setData({ pestañas: [] })
      setStatus('error')
    }
  }, [])
  React.useEffect(() => {
    loadTabs()
  }, [loadTabs])
  const onKeyDown = (e) => {
    if (!data.pestañas?.length) return
    if (e.key === 'ArrowRight') setActive((i) => (i + 1) % data.pestañas.length)
    if (e.key === 'ArrowLeft')
      setActive((i) => (i - 1 + data.pestañas.length) % data.pestañas.length)
    if (e.key === 'Home') setActive(0)
    if (e.key === 'End') setActive(data.pestañas.length - 1)
  }
  if (status === 'loading') return <div className="card">Cargando…</div>
  if (status === 'error') return <div className="card">No se pudieron cargar las pestañas.</div>
  return (
    <div style={{height:'242px'}}>
      <div role="tablist" aria-label="Qué podrás hacer" className="tabs" onKeyDown={onKeyDown}>
        {data.pestañas.map((t, i) => (
          <button
            key={t.título + i}
            id={`tab-${i}`}
            role="tab"
            className="tab-btn"
            aria-selected={i === active}
            aria-controls={`panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {t.título}
          </button>
        ))}
      </div>
      {data.pestañas.map((t, i) => (
        <div
          key={`panel-${i}`}
          id={`panel-${i}`}
          role="tabpanel"
          aria-labelledby={`tab-${i}`}
          hidden={i !== active}
          className="card"
        >
          <h3 style={{ marginTop: 0 }}>{t.título}</h3>
          {t.resumen && <p>{t.resumen}</p>}
          {Array.isArray(t.características) && t.características.length > 0 && (
            <ul style={{ margin: '0.75rem 0 0 1rem' }}>
              {t.características.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          )}
          {i === 0 && (
            <div style={{ marginTop: '1rem' }} aria-label="Mini mapa de conexiones">
              <svg width="100%" height="120" viewBox="0 0 600 120">
                <circle cx="80" cy="60" r="18" fill="var(--d1)" />
                <circle cx="300" cy="60" r="18" fill="var(--d2)" />
                <circle cx="520" cy="60" r="18" fill="var(--d3)" />
                <line x1="98" y1="60" x2="282" y2="60" stroke="var(--d6)" strokeWidth="3" />
                <line x1="318" y1="60" x2="502" y2="60" stroke="var(--d6)" strokeWidth="3" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
