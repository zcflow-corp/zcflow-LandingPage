'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

/* ================== DATA ================== */

const COUNTRIES = [
  { code: 'PE', name: 'Perú', prefix: '+51' },
  { code: 'MX', name: 'México', prefix: '+52' },
  { code: 'CO', name: 'Colombia', prefix: '+57' },
  { code: 'CL', name: 'Chile', prefix: '+56' },
  { code: 'AR', name: 'Argentina', prefix: '+54' },
  { code: 'ES', name: 'España', prefix: '+34' },
  { code: 'US', name: 'Estados Unidos', prefix: '+1' },
  { code: 'BR', name: 'Brasil', prefix: '+55' },
]

const PUBLIC_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']

/* ================== COMPONENT ================== */

export default function ContactForm() {
  const [step, setStep] = useState(1)
  const [prefix, setPrefix] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      country: '',
      name: '',
      lastname: '',
      phone: '',
      company: '',
      interest: '',
      details: '',
      terms: false,
    },
  })

  const country = watch('country')

  /* ================== EFFECT ================== */

  useEffect(() => {
    const found = COUNTRIES.find((c) => c.code === country)
    setPrefix(found?.prefix || '')
  }, [country])

  /* ================== STEPS ================== */

  const next = () => {
    if (step === 1) {
      const email = watch('email')
      const domain = email?.split('@')[1]

      if (!email) return toast.error('Ingresa tu correo corporativo')
      if (PUBLIC_DOMAINS.includes(domain)) return toast.error('Usa un correo corporativo')
      if (!country) return toast.error('Selecciona un país')
    }

    if (step === 2) {
      if (!watch('name') || !watch('lastname') || !watch('company')) {
        return toast.error('Completa todos los campos')
      }
    }

    setStep(step + 1)
  }

  const prev = () => setStep(step - 1)

  /* ================== SUBMIT ================== */

  const onSubmit = async (data) => {
    if (!data.terms) {
      return toast.error('Debes aceptar los términos')
    }

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          ...data,
          phone: `${prefix} ${data.phone}`,
        },
        'YOUR_PUBLIC_KEY'
      )

      toast.success('Formulario enviado', {
        description: 'Te contactaremos pronto',
      })

      reset()
      setStep(1)
    } catch {
      toast.error('No se pudo enviar el formulario')
    }
  }

  /* ================== UI ================== */

  return (
    <div className="bg-[var(--c-bg-variant)] py-20">
      <Card className="max-w-md mx-auto bg-[var(--c-panel)] shadow-xl rounded-[var(--radius)]">
        <CardHeader className="space-y-2">
          <CardTitle className="font-[var(--font-head)] text-[var(--h2)]">
            ¿Cómo podemos contactarte?
          </CardTitle>
          <CardDescription className="text-base">
            Proporciona tu información de contacto.
          </CardDescription>

          {/* Progress bar */}
          <div className="h-1 w-full rounded-full bg-[var(--c-line)] overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(step / 3) * 100}%`,
                background: 'var(--g-primary)',
              }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <Field label="Correo corporativo">
                  <Input placeholder="nombre@empresa.com" {...register('email')} />
                </Field>

                <Field label="País">
                  <Select onValueChange={(v) => setValue('country', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu país" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <Field label="Nombre">
                  <Input placeholder="Ej. Elena" {...register('name')} />
                </Field>

                <Field label="Apellido">
                  <Input placeholder="Ej. Díaz" {...register('lastname')} />
                </Field>

                <Field label="Empresa">
                  <Input placeholder="Ej. Zcflow" {...register('company')} />
                </Field>

                <Field label="Número de teléfono">
                  <div className="flex gap-2">
                    <div className="px-3 flex items-center border rounded-md text-sm bg-[var(--c-bg-variant)]">
                      {prefix || '--'}
                    </div>
                    <Input placeholder="999 999 999" {...register('phone')} />
                  </div>
                </Field>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <Field label="Interés">
                  <Select onValueChange={(v) => setValue('interest', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      <SelectItem value="demo">Solicitar demo</SelectItem>
                      <SelectItem value="solution">Solución específica</SelectItem>
                      <SelectItem value="partner">Alianza</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Detalles">
                  <Textarea
                    rows={4}
                    placeholder="Cuéntanos brevemente qué necesitas…"
                    {...register('details')}
                  />
                </Field>

                <div className="flex items-center gap-2">
                  <Checkbox {...register('terms')} />
                  <span className="text-sm">Acepto términos y condiciones</span>
                </div>
              </>
            )}

            {/* ACTIONS */}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prev}>
                  Atrás
                </Button>
              )}
              {step < 3 && (
                <Button type="button" onClick={next}>
                  Continuar
                </Button>
              )}
              {step === 3 && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando…' : 'Enviar'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

/* ================== FIELD ================== */

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--c-text)]">{label}</label>
      {children}
    </div>
  )
}
