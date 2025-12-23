'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function TermsModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="bg-bg-variant max-h">
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Términos y Condiciones</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm text-muted">
          <p>
            Al enviar este formulario, aceptas que Zcflow procese tu información con el fin de
            contactarte y brindarte información relacionada con nuestros servicios.
          </p>

          <p>
            Tus datos serán tratados de forma confidencial y no serán compartidos con terceros sin
            tu consentimiento, salvo obligación legal.
          </p>

          <p>
            Puedes solicitar la modificación o eliminación de tus datos en cualquier momento
            escribiéndonos a soporte@zcflow.com.
          </p>

          <p className="text-xs text-muted">Última actualización: Marzo 2025</p>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
