'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import es from '../i18n/es.json'
import en from '../i18n/en.json'
import { useEffect, useState } from 'react'

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

function createTranslationFunction(messages) {
  return (key) => messages[key] || key
}

export function TermsModal({ open, onOpenChange }) {
  const locale = getLocaleFromDoc()
  const [t, setT] = useState(() => createTranslationFunction(es))

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(() => createTranslationFunction(messages))
  }, [locale])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="bg-bg-variant max-h">
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{t('Términos y Condiciones')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted">
          <p>
            {t(
              'Al enviar este formulario, aceptas que Zcflow procese tu información con el fin de contactarte y brindarte información relacionada con nuestros servicios.'
            )}
          </p>

          <p>
            {t(
              'Tus datos serán tratados de forma confidencial y no serán compartidos con terceros sin tu consentimiento, salvo obligación legal.'
            )}
          </p>

          <p>
            {t(
              'Puedes solicitar la modificación o eliminación de tus datos en cualquier momento escribiéndonos a soporte@zcflow.com.'
            )}
          </p>

          <p className="text-xs text-muted">{t('Última actualización: Enero 2026')}</p>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('Cerrar')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
