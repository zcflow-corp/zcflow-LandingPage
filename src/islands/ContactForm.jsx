import React from 'react'
import { Form, Input, Button, Select, Checkbox, notification } from 'antd'

const { Option } = Select

const ContactForm = () => {
  const [form] = Form.useForm()

  // Custom email validation to block public domains
  const validateEmail = (rule, value) => {
    if (!value) return Promise.reject('Por favor ingresa tu correo corporativo!')
    const publicEmailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']
    const domain = value.split('@')[1]
    if (publicEmailDomains.includes(domain)) {
      return Promise.reject('Por favor ingresa un correo corporativo!')
    }
    return Promise.resolve()
  }

  // Phone validation to check for valid phone format
  const validatePhone = (rule, value) => {
    const phonePattern = /^\+?\d{1,4}?[\s\-]?\(?\d{1,5}?\)?[\s\-]?\d{1,5}[\s\-]?\d{1,9}$/
    if (!value) return Promise.reject('Por favor ingresa tu teléfono de contacto!')
    if (!phonePattern.test(value)) {
      return Promise.reject('Por favor ingresa un número de teléfono válido con prefijo!')
    }
    return Promise.resolve()
  }

  // Handle form submission
  const onFinish = (values) => {
    const emailBody = `
      Nombre Completo: ${values.name}
      Correo: ${values.email}
      Nombre de la Empresa: ${values.company}
      Teléfono: ${values.phone}
      Interés Principal: ${values.interest}
      Detalles: ${values.details || 'No hay detalles adicionales'}
    `
    const mailtoLink = `mailto:nataliaespin@gmail.com?subject=Nuevo Formulario de Contacto&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink

    notification.success({
      message: 'Formulario Enviado',
      description: 'Te contactaremos pronto.',
    })
    console.log('Formulario Enviado:', values)
  }

  return (
    <section className="container">
      <div className="container contact-form-container">
        <Form form={form} name="contact-form" onFinish={onFinish} layout="vertical">
          <h2 className="gradient-blue-dark">
            ¿Listo para transformar tus operaciones financieras?
          </h2>
          <p>
            Un especialista te contactará para ayudarte a integrar o evaluar la solución adecuada.
          </p>

          <div>
            <div className="form-group">
              <Form.Item
                label="Nombre Completo"
                name="name"
                rules={[{ required: true, message: 'Por favor ingresa tu nombre completo!' }]}
              >
                <Input className="form-input" placeholder="Ingresa nombre completo" />
              </Form.Item>

              <Form.Item
                label="Correo Electrónico Corporativo"
                name="email"
                rules={[
                  { required: true, message: 'Por favor ingresa tu correo corporativo!' },
                  { validator: validateEmail },
                ]}
              >
                <Input className="form-input" placeholder="Ingresa correo corporativo" />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                label="Nombre de la Empresa"
                name="company"
                rules={[{ required: true, message: 'Por favor ingresa el nombre de la empresa!' }]}
              >
                <Input className="form-input" placeholder="Ingresa nombre de la empresa" />
              </Form.Item>

              <Form.Item
                label="Teléfono de Contacto"
                name="phone"
                rules={[
                  { required: true, message: 'Por favor ingresa tu teléfono de contacto!' },
                  { validator: validatePhone },
                ]}
              >
                <Input className="form-input" placeholder="Ingresa tu teléfono" />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                label="Interés Principal"
                name="interest"
                rules={[{ required: true, message: 'Por favor selecciona un interés!' }]}
              >
                <Select className="form-select" placeholder="Selecciona una opción">
                  <Option value="demo">Solicitar una Demo Personalizada</Option>
                  <Option value="solution">Pregunta sobre una solución específica</Option>
                  <Option value="partnership">Asociación / Alianza Comercial</Option>
                  <Option value="general">Otro Motivo / Consulta General</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Detalles sobre tu Interés (Opcional)" name="details">
                <textarea className="form-textarea" placeholder="Escribe tus detalles aquí..." />
              </Form.Item>
            </div>

            <div className="form-group">
              <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[{ required: true, message: 'Debes aceptar los términos y condiciones!' }]}
              >
                <Checkbox className="form-checkbox">
                  Acepto la Política de Privacidad y los Términos y Condiciones
                </Checkbox>
              </Form.Item>
            </div>
          </div>

          <div className="form-group-submit">
            <Form.Item>
              <Button className="btn primary" type="submit">
                Hablar con un especialista
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </section>
  )
}

export default ContactForm
