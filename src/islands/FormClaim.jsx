'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import es from '@/i18n/es.json'
import en from '@/i18n/en.json'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

function getLocaleFromDoc() {
  if (typeof document === 'undefined') return 'es'
  return document.documentElement.lang === 'en' ? 'en' : 'es'
}

function createTranslationFunction(messages) {
  return (key) => messages[key] || key
}

const localeR = getLocaleFromDoc()

export default function FormClaim() {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const locale = getLocaleFromDoc()
  const [t, setT] = useState(() => createTranslationFunction(es))

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(() => createTranslationFunction(messages))
  }, [locale])

  const SERVICE_ID = 'service_fg8dkbj'
  const TEMPLATE_ID = 'template_aeexhcd'
  const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY

  const CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME

  const UPLOAD_PRESET = import.meta.env.PUBLIC_CLOUDINARY_UPLOAD_PRESET

  const MAX_FILES = 5
  const MAX_SIZE_BYTES = 10 * 1024 * 1024

  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  const PUBLIC_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']

  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('folder', 'reclamos')

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error(data)
      throw new Error('Cloudinary upload failed')
    }

    return data.secure_url
  }

  const fieldsByStep = {
    1: ['lastname', 'name', 'docType', 'docNumber', 'phone', 'email'],
    2: ['type', 'service', 'detail', 'request'],
  }

  const {
    register,
    handleSubmit: hookFormSubmit,
    control,
    trigger,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const next = async () => {
    const fieldsByStep = {
      1: ['lastname', 'name', 'docType', 'docNumber', 'phone', 'email', 'address'],
      2: ['type', 'date', 'service', 'detail'],
    }
    const valid = await trigger(fieldsByStep[step])
    if (valid) setStep(step + 1)
  }

  const prev = () => setStep(step - 1)

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      let uploadedLinks = []

      if (files.length > 0) {
        toast.loading(t('Subiendo archivos...'), { id: 'upload' })

        uploadedLinks = await Promise.all(files.map((item) => uploadToCloudinary(item.file)))

        toast.success(t('Archivos subidos correctamente'), { id: 'upload' })
      }

      toast.loading(t('Enviando reclamo...'), { id: 'send' })

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          ...data,
          type: data.type === 'reclamo' ? 'Reclamo' : 'Queja',
          attachments:
            uploadedLinks.length > 0
              ? `
      <ul>
        ${uploadedLinks
          .map(
            (link, i) => `<li><a href="${link}" target="_blank">Descargar adjunto ${i + 1}</a></li>`
          )
          .join('')}
      </ul>
    `
              : '<p>No se adjuntaron archivos.</p>',
        },
        PUBLIC_KEY
      )

      toast.success(t('Reclamo enviado correctamente'), { id: 'send' })

      files.forEach((item) => item.preview && URL.revokeObjectURL(item.preview))

      reset()
      setFiles([])
      setStep(1)
    } catch (error) {
      console.error('ERROR', error)
      toast.error(t('No se pudo enviar el reclamo'))
    } finally {
      setLoading(false)
    }
  }
  const termsAccepted = watch('terms')

  const formRef = useRef(null)
  useEffect(() => {
    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [step])

  return (
    <section ref={formRef} className="form-claim py-0 bg-bg-variant">
      <Card className="max-w-xl mx-auto shadow-xl bg-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-h3">{t('Libro de Reclamaciones')}</CardTitle>
          <CardDescription>
            {t('Completa el formulario para registrar tu reclamo o queja')}
          </CardDescription>

          <div className="h-1 w-full bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-g-primary transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h3 className="font-medium">{t('Datos personales')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                  <Field label={t('Apellidos')} error={errors.lastname?.message}>
                    <Input {...register('lastname', { required: t('Campo obligatorio') })} />
                  </Field>

                  <Field label={t('Nombres')} error={errors.name?.message}>
                    <Input {...register('name', { required: t('Campo obligatorio') })} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label={t('Tipo de documento')} error={errors.docType?.message}>
                    <select
                      className="w-full h-10 px-3 border rounded-md bg-transparent"
                      {...register('docType', { required: t('Campo obligatorio') })}
                    >
                      <option value="">{t('Seleccionar')}</option>
                      <option value="dni">{t('DNI')}</option>
                      <option value="passport">{t('Pasaporte')}</option>
                    </select>
                  </Field>

                  <Field label={t('N° Documento')}>
                    <Input {...register('docNumber', { required: t('Campo obligatorio') })} />
                  </Field>
                </div>

                <h3 className="font-medium pt-4">{t('Medios de contacto')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label={t('Teléfono')} error={errors.phone?.message}>
                    <Input {...register('phone', { required: t('Campo obligatorio') })} />
                  </Field>

                  <Field label={t('Correo electrónico')} error={errors.email?.message}>
                    <Input
                      type="email"
                      {...register('email', {
                        required: t('Campo obligatorio'),
                        validate: (value) => {
                          const domain = value.split('@')[1]
                          if (!domain) return t('Correo inválido')
                          // if (PUBLIC_DOMAINS.includes(domain)) return t('Usa un correo corporativo')
                          return true
                        },
                      })}
                    />
                  </Field>
                </div>

                <Field label={t('Dirección')}>
                  <Input {...register('address')} />
                </Field>
              </>
            )}

            {/* STEP 2 */}
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
                          className="mt-1 accent-blue-600"
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
                          className="mt-1 accent-blue-600"
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
                <Field label={t('Fecha de ocurrencia')} error={errors.date?.message}>
                  <Input
                    type="date"
                    className="h-11 px-4 rounded-lg border border-gray-300 
                  focus:ring-2 focus:ring-primary focus:border-primary
                  transition-all duration-200
                  text-gray-700"
                    {...register('date')}
                  />
                </Field>
                <Field label={t('Servicio reclamado')} error={errors.service?.message}>
                  <Input {...register('service', { required: t('Campo obligatorio') })} />
                </Field>
                <Field label={t('Detalle del reclamo')} error={errors.detail?.message}>
                  <Textarea
                    rows={4}
                    {...register('detail', { required: t('Campo obligatorio') })}
                  />
                </Field>
                <Field label={t('Pedido del reclamo')}>
                  <Textarea
                    rows={3}
                    {...register('request', { required: t('Campo obligatorio') })}
                  />
                </Field>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <h3 className="font-medium">
                  {t('Adjuntar documentación')} ({t('opcional')})
                </h3>

                <label
                  className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition
  border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-500"
                >
                  {/* Icono */}
                  <Upload className="w-8 h-8 text-gray-400 mb-3" />

                  {/* Texto principal */}
                  <p className="text-sm text-gray-500 font-medium">
                    {t('Adjunta tu archivo aquí')}
                  </p>

                  {/* Texto secundario */}
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF, DOC, DOCX (Máx. 10MB)</p>

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const selectedFiles = Array.from(e.target.files || [])

                      const allowedTypes = [
                        'image/jpeg',
                        'image/png',
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                      ]

                      const maxSize = 10 * 1024 * 1024
                      const maxFiles = 5

                      if (files.length + selectedFiles.length > maxFiles) {
                        toast.error('Solo puedes subir hasta 5 archivos.')
                        return
                      }

                      const validFiles = selectedFiles.filter((file) => {
                        if (!allowedTypes.includes(file.type)) {
                          toast.error(`Formato no permitido: ${file.name}`)
                          return false
                        }

                        if (file.size > maxSize) {
                          toast.error(`El archivo ${file.name} supera los 10MB`)
                          return false
                        }

                        return true
                      })

                      const mappedFiles = validFiles.map((file) => ({
                        file,
                        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                      }))

                      setFiles((prev) => [...prev, ...mappedFiles])
                    }}
                  />
                </label>

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
                              {item.file.name.split('.').pop()?.toUpperCase()}
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

                <div className="flex items-start gap-2 pt-2">
                  <Field error={errors.terms?.message}>
                    <Controller
                      name="terms"
                      control={control}
                      rules={{
                        required: t('Debes aceptar la política de privacidad'),
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
                              {t('Acepto la')}{' '}
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
                </div>

                <p className="text-xs text-muted pt-3">
                  {t('También puedes registrar tu reclamo escribiendo a:')}
                  <br />
                  <a
                    href="mailto:ayuda@zcflow.com"
                    className="hover:underline font-bold text-primary"
                  >
                    ayuda@zcflow.com
                  </a>
                </p>
              </>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prev}>
                  {t('Atrás')}
                </Button>
              )}

              {step < 3 && (
                <Button
                  type="button"
                  className="btn primary"
                  onClick={next}
                  disabled={
                    errors.lastname ||
                    errors.name ||
                    errors.docNumber ||
                    errors.phone ||
                    errors.email ||
                    errors.docType
                  }
                >
                  {t('Continuar')}
                </Button>
              )}

              {step === 3 && (
                <Button type="submit" className="btn primary" disabled={loading || !termsAccepted}>
                  {loading ? 'Enviando...' : 'Enviar reclamo'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      {children}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
