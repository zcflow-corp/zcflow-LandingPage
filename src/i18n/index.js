import es from '../i18n/es.json'
import en from '../i18n/en.json'

const messages = { es, en }
const getT = (locale) => (key) => messages[locale][key] ?? key

export const localeHelper = (Astro) => {
  const locale = Astro.currentLocale ?? 'es'
  const base = import.meta.env.BASE_URL
  
  const t = getT(locale)
  /**url puede ser '' para home */
  const path = (url = '') => `${base}${locale}/${url}/`.replace(/\/+/g, '/')

 

  return { locale, t, path }
}
