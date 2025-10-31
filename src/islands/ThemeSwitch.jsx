import React from 'react'
const Sun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
)
const Moon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
)
export default function ThemeSwitch() {
  const [theme, setTheme] = React.useState('light')
  React.useEffect(() => {
    const t = localStorage.getItem('tema_activo') || 'light'
    setTheme(t)
    document.documentElement.setAttribute('data-theme', t)
  }, [])
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('tema_activo', next)
    document.documentElement.setAttribute('data-theme', next)
  }
  return (
    <button className="btn ghost" onClick={toggle} aria-label="Cambiar tema">
      {theme === 'light' ? (
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <Moon />
        </span>
      ) : (
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <Sun />
        </span>
      )}
    </button>
  )
}
