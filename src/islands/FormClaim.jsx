'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, X } from 'lucide-react'
// import FileUploader from './FileUploader'

export default function FormClaim() {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState([])

  const {
    register,
    handleSubmit,
    control,
    trigger,
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
    console.log('CLAIM DATA', data)
  }

  return (
    <section className="py-32 bg-bg-variant">
      <Card className="max-w-xl mx-auto shadow-xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-h2">Libro de Reclamaciones</CardTitle>
          <CardDescription>
            Completa el formulario para registrar tu reclamo o queja
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
                <h3 className="font-medium">Datos personales</h3>

                <Field label="Apellidos" error={errors.lastname?.message}>
                  <Input {...register('lastname', { required: 'Campo obligatorio' })} />
                </Field>

                <Field label="Nombres" error={errors.name?.message}>
                  <Input {...register('name', { required: 'Campo obligatorio' })} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tipo de documento">
                    <select
                      className="w-full h-10 px-3 border rounded-md bg-transparent"
                      {...register('docType', { required: 'Campo obligatorio' })}
                    >
                      <option value="">Seleccionar</option>
                      <option value="dni">DNI</option>
                      <option value="passport">Pasaporte</option>
                    </select>
                  </Field>

                  <Field label="N° Documento">
                    <Input {...register('docNumber', { required: 'Campo obligatorio' })} />
                  </Field>
                </div>

                <h3 className="font-medium pt-4">Medios de contacto</h3>

                <Field label="Teléfono">
                  <Input {...register('phone', { required: 'Campo obligatorio' })} />
                </Field>

                <Field label="Correo electrónico">
                  <Input type="email" {...register('email', { required: 'Campo obligatorio' })} />
                </Field>

                <Field label="Dirección">
                  <Input {...register('address', { required: 'Campo obligatorio' })} />
                </Field>

                <Controller
                  name="privacy"
                  control={control}
                  rules={{ required: 'Debes aceptar la política de privacidad' }}
                  render={({ field }) => (
                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      <p className="text-sm leading-snug">
                        Acepto la{' '}
                        <span className="underline text-primary cursor-pointer">
                          Política de Privacidad
                        </span>
                      </p>
                    </div>
                  )}
                />
              </>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <>
                <h3 className="font-medium">Detalles de la solicitud</h3>

                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Selecciona una opción' }}
                  render={({ field }) => (
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          value="reclamo"
                          checked={field.value === 'reclamo'}
                          onChange={() => field.onChange('reclamo')}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium">Reclamo</p>
                          <p className="text-sm text-muted">
                            Disconformidad relacionada a un producto o servicio.
                          </p>
                        </div>
                      </label>

                      <label className="flex items-start gap-3 p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          value="queja"
                          checked={field.value === 'queja'}
                          onChange={() => field.onChange('queja')}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium">Queja</p>
                          <p className="text-sm text-muted">
                            Disconformidad relacionada a la atención recibida.
                          </p>
                        </div>
                      </label>
                    </div>
                  )}
                />

                <Field label="Fecha de ocurrencia">
                  <Input type="date" {...register('date', { required: 'Campo obligatorio' })} />
                </Field>

                <Field label="Servicio reclamado">
                  <Input {...register('service', { required: 'Campo obligatorio' })} />
                </Field>

                <Field label="Detalle del reclamo">
                  <Textarea rows={4} {...register('detail', { required: 'Campo obligatorio' })} />
                </Field>

                <Field label="Pedido del reclamo">
                  <Textarea rows={3} {...register('request', { required: 'Campo obligatorio' })} />
                </Field>
              </>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
              <>
                <h3 className="font-medium">Adjuntar documentación</h3>

                <label className="flex items-center gap-2 cursor-pointer text-primary">
                  <Upload size={18} />
                  <span>Adjuntar archivos</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (!e.target.files) return
                      setFiles((prev) => [...prev, ...Array.from(e.target.files)])
                    }}
                  />
                </label>

                {files.length > 0 && (
                  <ul className="mt-4 space-y-3">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between border rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded text-xs">
                              FILE
                            </div>
                          )}

                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* <FileUploader /> */}

                <p className="text-xs text-muted">
                  También puedes registrar tu reclamo escribiendo a:
                  <br />
                  <strong>reclamos@empresa.com</strong>
                </p>
              </>
            )}

            {/* ================= ACTIONS ================= */}
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
                  Registrar reclamo
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
