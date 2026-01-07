import es from '../i18n/es.json'
import en from '../i18n/en.json'

const messages = { es, en }

export const getT = (locale) => (key) => messages[locale][key] ?? key

export const localeHelper = (Astro) => {
  const locale = Astro.currentLocale || 'es'
  const t = getT(locale)
  return { locale, t }
}
