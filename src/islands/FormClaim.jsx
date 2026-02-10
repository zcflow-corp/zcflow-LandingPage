'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import es from '@/i18n/es.json'
import en from '@/i18n/en.json'
import emailjs from '@emailjs/browser' // ✅ EMAILJS
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, X } from 'lucide-react'
// import FileUploader from './FileUploader'

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

function createTranslationFunction(messages) {
  return (key) => messages[key] || key
}

export default function FormClaim() {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState([])

  // ✅ i18n
  const locale = getLocaleFromDoc()
  const [t, setT] = useState(() => createTranslationFunction(es))

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(() => createTranslationFunction(messages))
  }, [locale])

  const SERVICE_ID = 'service_fg8dkbj'
  const TEMPLATE_ID = 'template_aeexhcd'
  const PUBLIC_KEY = 'OxhdmLgo61idmBNlb'
  // helper para adjuntos
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onTouched' })

  const next = async () => {
    const fieldsByStep = {
      1: ['lastname', 'name', 'docType', 'docNumber', 'phone', 'email', 'address', 'privacy'],
      2: ['type', 'date', 'service', 'detail', 'request'],
    }

    const valid = await trigger(fieldsByStep[step])
    if (valid) setStep(step + 1)
  }

  const prev = () => setStep(step - 1)

  const onSubmit = async (data) => {
    try {
      const attachments = await Promise.all(
        files.map(async (item) => ({
          name: item.file.name,
          content: await fileToBase64(item.file),
        }))
      )

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          ...data,
          type: data.type === 'reclamo' ? 'Reclamo' : 'Queja',
          attachments: JSON.stringify(attachments),
        },
        PUBLIC_KEY
      )

      files.forEach((item) => item.preview && URL.revokeObjectURL(item.preview))

      reset()
      setFiles([])
      setStep(1)
      toast.success(t('Reclamo enviado correctamente'))
    } catch (error) {
      console.error('EMAILJS ERROR', error)
      toast.error(t('No se pudo enviar el reclamo'))
    }
  }

  return (
    <section className="form-claim py-0 bg-bg-variant">
      <Card className="max-w-xl mx-auto shadow-xl bg-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-h3 ">{t('Libro de Reclamaciones')}</CardTitle>

          <CardDescription>
            {t('Completa el formulario para registrar tu reclamo o queja')}
          </CardDescription>

          <div className="h-1 w-full bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <>
                <h3 className="font-medium">{t('Datos personales')}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={t('Apellidos')} error={errors.lastname?.message}>
                    <Input
                      {...register('lastname', {
                        required: t('Campo obligatorio'),
                      })}
                    />
                  </Field>

                  <Field label={t('Nombres')} error={errors.name?.message}>
                    <Input
                      {...register('name', {
                        required: t('Campo obligatorio'),
                      })}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={t('Tipo de documento')}>
                    <select
                      className="w-full h-10 px-3 border rounded-md bg-transparent"
                      {...register('docType', {
                        required: t('Campo obligatorio'),
                      })}
                    >
                      <option value="">{t('Seleccionar')}</option>
                      <option value="dni">{t('DNI')}</option>
                      <option value="passport">{t('Pasaporte')}</option>
                    </select>
                  </Field>

                  <Field label={t('N° Documento')}>
                    <Input
                      {...register('docNumber', {
                        required: t('Campo obligatorio'),
                      })}
                    />
                  </Field>
                </div>

                <h3 className="font-medium pt-4">{t('Medios de contacto')}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={t('Teléfono')}>
                    <Input
                      {...register('phone', {
                        required: t('Campo obligatorio'),
                      })}
                    />
                  </Field>

                  <Field label={t('Correo electrónico')}>
                    <Input
                      type="email"
                      {...register('email', {
                        required: t('Campo obligatorio'),
                      })}
                    />
                  </Field>
                </div>

                <Field label={t('Dirección')}>
                  <Input
                    {...register('address', {
                      required: t('Campo obligatorio'),
                    })}
                  />
                </Field>
              </>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <>
                <h3 className="font-medium">{t('Detalles de la solicitud')}</h3>

                <Controller
                  name="type"
                  control={control}
                  rules={{ required: t('Selecciona una opción') }}
                  render={({ field }) => (
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          checked={field.value === 'reclamo'}
                          onChange={() => field.onChange('reclamo')}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium">{t('Reclamo')}</p>
                          <p className="text-sm text-muted">
                            {t('Disconformidad relacionada a un producto o servicio.')}
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          checked={field.value === 'queja'}
                          onChange={() => field.onChange('queja')}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium">{t('Queja')}</p>
                          <p className="text-sm text-muted">
                            {t('Disconformidad relacionada a la atención recibida.')}
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                />

                <Field label={t('Fecha de ocurrencia')}>
                  <Input
                    type="date"
                    {...register('date', {
                      required: t('Campo obligatorio'),
                    })}
                  />
                </Field>

                <Field label={t('Servicio reclamado')}>
                  <Input
                    {...register('service', {
                      required: t('Campo obligatorio'),
                    })}
                  />
                </Field>

                <Field label={t('Detalle del reclamo')}>
                  <Textarea
                    rows={4}
                    {...register('detail', {
                      required: t('Campo obligatorio'),
                    })}
                  />
                </Field>

                <Field label={t('Pedido del reclamo')}>
                  <Textarea
                    rows={3}
                    {...register('request', {
                      required: t('Campo obligatorio'),
                    })}
                  />
                </Field>
              </>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
              <>
                <h3 className="font-medium">{t('Adjuntar documentación')}</h3>

                <label className="flex items-center gap-2 cursor-pointer text-primary">
                  <Upload size={18} />
                  <span>{t('Adjuntar archivos')}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg,application/pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (!e.target.files) return

                      const selectedFiles = Array.from(e.target.files)

                      if (files.length + selectedFiles.length > 5) {
                        alert(t('Puedes subir hasta 5 archivos como máximo'))
                        return
                      }

                      const mapped = selectedFiles
                        .map((file) => {
                          if (file.size > 20 * 1024 * 1024) {
                            alert(t('Cada archivo debe pesar como máximo 20 MB'))
                            return null
                          }

                          return {
                            file,
                            preview: file.type.startsWith('image/')
                              ? URL.createObjectURL(file)
                              : null,
                          }
                        })
                        .filter(Boolean)

                      setFiles((prev) => [...prev, ...mapped])
                      e.target.value = ''
                    }}
                  />
                </label>

                {/* PREVIEW */}
                {files.length > 0 && (
                  <ul className="space-y-2 pt-3">
                    {files.map((item, index) => (
                      <li
                        key={`${item.file.name}-${index}`}
                        className="flex items-center justify-between gap-3 text-sm border rounded-md px-3 py-2"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.preview ? (
                            <img
                              src={item.preview}
                              alt={item.file.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                              {item.file.name.split('.').pop().toUpperCase()}
                            </span>
                          )}

                          <div className="truncate">
                            <p className="font-medium truncate">{item.file.name}</p>
                            <p className="text-xs text-muted">
                              {(item.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="text-muted hover:text-error"
                          onClick={() => {
                            if (item.preview) URL.revokeObjectURL(item.preview)
                            setFiles((prev) => prev.filter((_, i) => i !== index))
                          }}
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* TEXTO INFORMATIVO (IMAGEN) */}
                <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs text-muted flex gap-2">
                  <span>ℹ️</span>
                  <p>
                    {t(
                      'Los archivos adjuntos deben pesar 20 MB máx. y estar en formato JPG, JPEG, PNG, PDF, DOC o DOCX. Puedes subir hasta 5 archivos como máximo.'
                    )}
                  </p>
                </div>

                <p className="text-xs text-muted pt-3">
                  {t('También puedes registrar tu reclamo escribiendo a:')}
                  <br />
                  <strong>ayuda@zcflow.com</strong>
                </p>
              </>
            )}

            {/* ================= ACTIONS ================= */}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prev}>
                  {t('Atrás')}
                </Button>
              )}

              {step < 3 && (
                <Button type="button" className="btn primary" onClick={next}>
                  {t('Continuar')}
                </Button>
              )}

              {step === 3 && (
                <Button type="submit" className="btn primary" disabled={isSubmitting}>
                  {t('Registrar reclamo')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

/* ================= FIELD ================= */

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      {children}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
