'use client'

import { useEffect, useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  const locale = getLocaleFromDoc()
  const [t, setT] = useState(() => createTranslationFunction(es))

  useEffect(() => {
    const messages = locale === 'en' ? en : es
    setT(() => createTranslationFunction(messages))
  }, [locale])

  const SERVICE_ID = 'service_fg8dkbj'
  const TEMPLATE_ID = 'template_aeexhcd'
  const PUBLIC_KEY = 'OxhdmLgo61idmBNlb'

  const CLOUD_NAME = 'drbbpfygo'
  const UPLOAD_PRESET = 'zcflow-reclamos'

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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)

    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error('Puedes subir hasta 5 archivos como máximo.')
      return
    }

    const validFiles = []

    for (let file of selectedFiles) {
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`El archivo "${file.name}" supera los 20MB.`)
        continue
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Formato no permitido en "${file.name}".`)
        continue
      }

      validFiles.push({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      })
    }

    setFiles((prev) => [...prev, ...validFiles])
  }

  // const uploadToCloudinary = async (file) => {
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   formData.append('upload_preset', UPLOAD_PRESET)
  //   formData.append('folder', 'reclamos')

  //   // Detectar si es imagen
  //   const isImage = file.type.startsWith('image/')

  //   const resourceType = isImage ? 'image' : 'raw'

  //   const response = await fetch(
  //     `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
  //     {
  //       method: 'POST',
  //       body: formData,
  //     }
  //   )

  //   const data = await response.json()

  //   if (!response.ok) {
  //     console.error('Cloudinary error:', data)
  //     throw new Error('Cloudinary upload failed')
  //   }

  //   return data.secure_url
  // }

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

  const {
    register,
    handleSubmit: hookFormSubmit,
    control,
    trigger,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' })

  const next = async () => {
    const fieldsByStep = {
      1: ['lastname', 'name', 'docType', 'docNumber', 'phone', 'email', 'address'],
      2: ['type', 'date', 'service', 'detail', 'request'],
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

  return (
    <section className="form-claim py-0 bg-bg-variant">
      <Card className="max-w-xl mx-auto shadow-xl bg-white">
        <CardHeader className="space-y-2">
          <CardTitle className="text-h3">{t('Libro de Reclamaciones')}</CardTitle>

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
          <form onSubmit={hookFormSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h3 className="font-medium">{t('Datos personales')}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={t('Apellidos')} error={errors.lastname?.message}>
                    <Input {...register('lastname', { required: t('Campo obligatorio') })} />
                  </Field>

                  <Field label={t('Nombres')} error={errors.name?.message}>
                    <Input {...register('name', { required: t('Campo obligatorio') })} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label={t('Tipo de documento')}>
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

                <div className="grid grid-cols-2 gap-4">
                  <Field label={t('Teléfono')}>
                    <Input {...register('phone', { required: t('Campo obligatorio') })} />
                  </Field>

                  <Field label={t('Correo electrónico')}>
                    <Input
                      type="email"
                      {...register('email', { required: t('Campo obligatorio') })}
                    />
                  </Field>
                </div>

                <Field label={t('Dirección')}>
                  <Input {...register('address', { required: t('Campo obligatorio') })} />
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
                  <Input type="date" {...register('date', { required: t('Campo obligatorio') })} />
                </Field>

                <Field label={t('Servicio reclamado')}>
                  <Input {...register('service', { required: t('Campo obligatorio') })} />
                </Field>

                <Field label={t('Detalle del reclamo')}>
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
                <h3 className="font-medium">{t('Adjuntar documentación')}</h3>

                <label className="flex items-center gap-2 cursor-pointer text-primary">
                  <Upload size={18} />
                  <span>{t('Adjuntar archivos')}</span>

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
                          toast.error(`El archivo ${file.name} supera los 20MB`)
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

                <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs text-muted flex gap-2 bg-cuaternary">
                  <span>ℹ️</span>
                  <p>
                    {t(
                      'Los archivos adjuntos deben pesar 10 MB máx. y estar en formato JPG, JPEG, PNG, PDF, DOC o DOCX. Puedes subir hasta 5 archivos como máximo.'
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
                <Button type="submit" className="btn primary" disabled={loading}>
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
