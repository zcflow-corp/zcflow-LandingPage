'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'
import { TermsModal } from './TermsModal'
import es from '@/i18n/es.json'
import en from '@/i18n/en.json'
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

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

const localeR = getLocaleFromDoc()

function createTranslationFunction(messages) {
  return (key) => messages[key] || key
}
export default function ContactForm() {
  const [step, setStep] = useState(1)
  const [prefix, setPrefix] = useState('')

  // ✅ i18n
  const locale = getLocaleFromDoc()
  const [t, setT] = useState(() => createTranslationFunction(es))

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(() => createTranslationFunction(messages))
  }, [locale])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: 'onTouched',
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

  const next = async () => {
    const fieldsByStep = {
      1: ['email', 'country'],
      2: ['name', 'lastname', 'company'],
      3: ['interest', 'terms'],
    }

    const valid = await trigger(fieldsByStep[step])
    if (!valid) return

    setStep(step + 1)
  }

  const prev = () => setStep(step - 1)

  /* ================== SUBMIT ================== */
 
  const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY
  const SERVICE_ID = 'service_3avdpu8'
  const TEMPLATE_ID = 'template_32m276g'

  const onSubmit = async (data) => {
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          ...data,
          phone: `${prefix} ${data.phone}`,
        },
        PUBLIC_KEY
      )

      toast.success('Formulario enviado', {
        description: t('Te contactaremos pronto'),
      })

      reset()
      setStep(1)
    } catch (error) {
      console.error('[EmailJS ERROR]', error)

      toast.error(t('No se pudo enviar el formulario'))
    }
  }
  /* ================== UI ================== */

  return (
    <section className="bg-bg-variant py-40 section-contact">
      <Card className="max-w-md mx-auto bg-panel shadow-xl rounded-base">
        <CardHeader className="space-y-3 text-h3">
          <CardTitle className="font-head text-h2 leading-tight text-text">
            {t('¿Cómo podemos contactarte?')}
          </CardTitle>

          <CardDescription className="text-muted">
            {t('Proporciona tu información de contacto')}
          </CardDescription>

          <div className="h-1 w-full rounded-full bg-line overflow-hidden">
            <div
              className="h-full transition-all duration-300 bg-g-primary"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <Field label={t('Correo corporativo')} error={errors.email?.message}>
                  <Input
                    placeholder="nombre@empresa.com"
                    {...register('email', {
                      required: t('El correo es obligatorio'),
                      validate: (value) => {
                        const domain = value.split('@')[1]
                        if (!domain) return t('Correo inválido')
                        if (PUBLIC_DOMAINS.includes(domain)) return t('Usa un correo corporativo')
                        return true
                      },
                    })}
                  />
                </Field>

                <Field label={t('País')} error={errors.country?.message}>
                  <Select onValueChange={(v) => setValue('country', v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Selecciona tu país')} />
                    </SelectTrigger>
                    <SelectContent className="bg-panel">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register('country', {
                      required: t('Selecciona un país'),
                    })}
                  />
                </Field>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <Field label={t('Nombre')} error={errors.name?.message}>
                  <Input
                    placeholder="Ej. Elena"
                    {...register('name', {
                      required: t('El nombre es obligatorio'),
                    })}
                  />
                </Field>

                <Field label={t('Apellido')} error={errors.lastname?.message}>
                  <Input
                    placeholder="Ej. Díaz"
                    {...register('lastname', {
                      required: t('El apellido es obligatorio'),
                    })}
                  />
                </Field>

                <Field label={t('Empresa')} error={errors.company?.message}>
                  <Input
                    placeholder="Ej. Zcflow"
                    {...register('company', {
                      required: t('La empresa es obligatoria'),
                    })}
                  />
                </Field>

                <Field label={t('Número de teléfono')}>
                  <div className="flex gap-2">
                    <div className="px-3 flex items-center border rounded-md text-sm bg-bg-variant">
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
                <Field label={t('Interés')} error={errors.interest?.message}>
                  <Select onValueChange={(v) => setValue('interest', v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Selecciona una opción')} />
                    </SelectTrigger>
                    <SelectContent className="bg-panel">
                      <SelectItem value="demo">{t('Solicitar demo')} </SelectItem>
                      <SelectItem value="solution">{t('Solución específica')} </SelectItem>
                      <SelectItem value="alianza">{t('Alianza Comercial')} </SelectItem>

                      <SelectItem value="partner"> {t('Otro Motivo')} </SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register('interest', {
                      required: t('Selecciona un interés'),
                    })}
                  />
                </Field>

                <Field label={t('Detalles')}>
                  <Textarea
                    rows={4}
                    placeholder={t('Cuéntanos brevemente qué necesitas…')}
                    {...register('details')}
                  />
                </Field>

                <Field error={errors.terms?.message}>
                  <Controller
                    name="terms"
                    control={control}
                    rules={{
                      required: t('Debes aceptar los términos'),
                    }}
                    render={({ field }) => (
                      <div className="flex items-start gap-2">
                        <Checkbox
                          className="
                        border-muted
                        data-[state=checked]:bg-primary
                        data-[state=checked]:border-primary
                        data-[state=checked]:text-white
                      "
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />

                        <div className="flex items-start gap-2 ">
                          <p className="text-sm leading-snug">
                            {t('Al continuar acepto la')}{' '}
                            <a
                              href={`/${localeR}/privacidad`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-primary cursor-pointer"
                            >
                              {t('Política de Privacidad')}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                  />
                </Field>
              </>
            )}

            {/* ACTIONS */}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prev}>
                  {t('Atrás')}
                </Button>
              )}

              {step < 3 && (
                <Button type="button" onClick={next} className="btn primary">
                  {t('Continuar')}
                </Button>
              )}

              {step === 3 && (
                <Button type="submit" className="btn primary" disabled={isSubmitting}>
                  {isSubmitting ? t('Enviando…') : t('Enviar')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

/* ================== FIELD ================== */

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      {children}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
