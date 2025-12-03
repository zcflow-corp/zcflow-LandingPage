import React, { createContext, useState, useContext, useEffect } from 'react'
import es from '../i18n/es.json' // Traducciones en español
import en from '../i18n/en.json' // Traducciones en inglés

// Crear el contexto del idioma
const LanguageContext = createContext()

// Hook personalizado para acceder al contexto
export const useLanguage = () => {
  return useContext(LanguageContext)
}

// Proveedor que envuelve la aplicación y proporciona el estado del idioma
export const LanguageProvider = ({ children }) => {
  // Inicializa el idioma por defecto
  const getInitialLocale = () => {
    // Solo ejecuta esto en el cliente, ya que `window` no está disponible en el servidor
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      return pathname.startsWith('/en') ? 'en' : 'es' // Detecta el idioma en la URL
    }
    return 'es' // Default to Spanish if on server-side
  }

  const [locale, setLocale] = useState(getInitialLocale()) // Estado para el idioma actual
  const [translations, setTranslations] = useState(es) // Estado para las traducciones

  // Detecta cambios en la URL y actualiza el idioma
  useEffect(() => {
    const handleLocationChange = () => {
      setLocale(getInitialLocale())
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleLocationChange) // Escucha los cambios de la ruta
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleLocationChange)
      }
    }
  }, []) // Solo se ejecuta una vez al montar el componente

  // Cambiar las traducciones cuando el idioma cambia
  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setTranslations(messages)
  }, [locale]) // Se ejecuta cada vez que el idioma cambia

  // Función `t` que toma una clave y devuelve la traducción correspondiente
  const t = (key) => translations[key] ?? key // Si no encuentra la clave, devuelve la clave misma

  // Cambiar de idioma
  const toggleLanguage = () => {
    const newLocale = locale === 'es' ? 'en' : 'es'
    setLocale(newLocale)

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.replace(/^\/(en|es)/, '') // Quita el prefijo del idioma
      const newPath = newLocale === 'en' ? `/en${currentPath}` : `/es${currentPath}` // Redirige con el nuevo idioma
      window.history.pushState(null, '', newPath)
    }
  }

  // Pasamos el contexto a los componentes hijos
  return (
    <LanguageContext.Provider value={{ locale, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
