import React from 'react'
import { Form, Input, Button, Select, Checkbox, notification } from 'antd'
import { MailOutlined, PhoneOutlined } from '@ant-design/icons'

const { Option } = Select

const ContactForm = () => {
  const [form] = Form.useForm()

  // Custom email validation to block public domains
  const validateEmail = (rule, value) => {
    if (!value) {
      return Promise.reject('Por favor ingresa tu correo corporativo!')
    }
    const publicEmailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com']
    const domain = value.split('@')[1]
    if (publicEmailDomains.includes(domain)) {
      return Promise.reject('Por favor ingresa un correo corporativo!')
    }
    return Promise.resolve()
  }

  // Handle form submission
  const onFinish = (values) => {
    // Send email with the form data (use mailto for now)
    const emailBody = `
      Nombre Completo: ${values.name}
      Correo: ${values.email}
      Nombre de la Empresa: ${values.company}
      Teléfono: ${values.phone}
      Interés Principal: ${values.interest}
      Detalles: ${values.details || 'No hay detalles adicionales'}
    `
    const mailtoLink = `mailto:nataliaespin2021@gmail.com?subject=Nuevo Formulario de Contacto&body=${encodeURIComponent(emailBody)}`
    window.location.href = mailtoLink

    // Success notification
    notification.success({
      message: 'Formulario Enviado',
      description: 'Te contactaremos pronto.',
    })
    console.log('Formulario Enviado:', values)
  }

  return (
    <div className="contact-form-container">
      <Form
        form={form}
        name="contact-form"
        onFinish={onFinish}
        layout="vertical"
        className="contact-form"
      >
        <h2 className="gradient-blue-dark">¿Listo para transformar tus operaciones financieras?</h2>
        <p>
          Un especialista te contactará para ayudarte a integrar o evaluar la solución adecuada.
        </p>

        <div className="form-fields">
          {/* Nombre Completo */}
          <Form.Item
            label="Nombre Completo"
            name="name"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre completo!' }]}
          >
            <Input placeholder="Ingresa nombre completo" />
          </Form.Item>

          {/* Correo Electrónico Corporativo */}
          <Form.Item
            label="Correo Electrónico Corporativo"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo corporativo!' },
              { validator: validateEmail },
            ]}
          >
            <Input placeholder="Ingresa correo corporativo" />
          </Form.Item>

          {/* Nombre de la Empresa */}
          <Form.Item
            label="Nombre de la Empresa"
            name="company"
            rules={[{ required: true, message: 'Por favor ingresa el nombre de la empresa!' }]}
          >
            <Input placeholder="Ingresa nombre de la empresa" />
          </Form.Item>

          {/* Teléfono de Contacto */}
          <Form.Item
            label="Teléfono de Contacto"
            name="phone"
            rules={[
              { required: true, message: 'Por favor ingresa tu teléfono de contacto!' },
              {
                pattern: /^\+?\d{1,4}?[\s\-]?\(?\d{1,5}?\)?[\s\-]?\d{1,5}[\s\-]?\d{1,9}$/,
                message: 'Por favor ingresa un número de teléfono válido con prefijo!',
              },
            ]}
          >
            <Input placeholder="Ingresa tu teléfono" prefix={<PhoneOutlined />} />
          </Form.Item>

          {/* Interés Principal */}
          <Form.Item
            label="Interés Principal"
            name="interest"
            rules={[{ required: true, message: 'Por favor selecciona un interés!' }]}
          >
            <Select placeholder="Selecciona una opción">
              <Option value="demo">Solicitar una Demo Personalizada</Option>
              <Option value="solution">Pregunta sobre una solución específica</Option>
              <Option value="partnership">Asociación / Alianza Comercial</Option>
              <Option value="general">Otro Motivo / Consulta General</Option>
            </Select>
          </Form.Item>

          {/* Detalles sobre tu Interés */}
          <Form.Item label="Detalles sobre tu Interés (Opcional)" name="details">
            <Input.TextArea placeholder="Escribe tus detalles aquí..." />
          </Form.Item>

          {/* Términos y Condiciones */}
          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[{ required: true, message: 'Debes aceptar los términos y condiciones!' }]}
          >
            <Checkbox>Acepto la Política de Privacidad y los Términos y Condiciones</Checkbox>
          </Form.Item>
        </div>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Hablar con un especialista
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ContactForm
