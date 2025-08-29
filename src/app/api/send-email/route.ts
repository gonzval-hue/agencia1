import { NextRequest, NextResponse } from 'next/server'

interface EmailData {
  type: 'quote-general' | 'quote-product' | 'services'
  clientName: string
  clientEmail: string
  clientPhone: string
  company: string
  message: string
  to: string
  quantity?: string
  productName?: string
  productCode?: string
  productPrice?: number
  contactPreference?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: EmailData = await request.json()

    // Crear el contenido del correo según el tipo
    let subject = ''
    let htmlContent = ''

    switch (data.type) {
      case 'quote-general':
        subject = 'Solicitud de Cotización General - Agencia 1'
        htmlContent = `
          <h2>Nueva Solicitud de Cotización General</h2>
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>Nombre:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
            <p><strong>Teléfono:</strong> ${data.clientPhone}</p>
            <p><strong>Empresa:</strong> ${data.company}</p>
            <p><strong>Cantidad:</strong> ${data.quantity}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${data.message}</p>
          </div>
        `
        break

      case 'quote-product':
        subject = `Solicitud de Cotización - ${data.productName}`
        htmlContent = `
          <h2>Nueva Solicitud de Cotización de Producto</h2>
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>Nombre:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
            <p><strong>Teléfono:</strong> ${data.clientPhone}</p>
            <p><strong>Empresa:</strong> ${data.company}</p>
            
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3 style="margin: 0 0 10px 0; color: #1976d2;">Información del Producto</h3>
              <p><strong>Producto:</strong> ${data.productName}</p>
              <p><strong>Código:</strong> ${data.productCode}</p>
              <p><strong>Precio Unitario:</strong> $${data.productPrice?.toFixed(2)}</p>
              <p><strong>Cantidad:</strong> ${data.quantity}</p>
              <p><strong>Total Estimado:</strong> $${(data.productPrice! * parseInt(data.quantity || '1')).toFixed(2)}</p>
            </div>
            
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${data.message}</p>
          </div>
        `
        break

      case 'services':
        subject = 'Solicitud de Información de Servicios - Agencia 1'
        htmlContent = `
          <h2>Nueva Solicitud de Información de Servicios</h2>
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p><strong>Nombre:</strong> ${data.clientName}</p>
            <p><strong>Email:</strong> ${data.clientEmail}</p>
            <p><strong>Teléfono:</strong> ${data.clientPhone}</p>
            <p><strong>Empresa:</strong> ${data.company}</p>
            <p><strong>Preferencia de Contacto:</strong> ${data.contactPreference}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${data.message}</p>
          </div>
        `
        break
    }

    // Aquí iría la lógica real de envío de correo
    // Por ahora, simulamos el envío y registramos en la consola
    console.log('=== EMAIL ENVIADO ===')
    console.log('Para:', data.to)
    console.log('Asunto:', subject)
    console.log('Contenido HTML:', htmlContent)
    console.log('===================')

    // Simulamos una respuesta exitosa
    // En un entorno real, aquí usarías un servicio como SendGrid, Mailgun, Nodemailer, etc.
    
    return NextResponse.json({ 
      success: true, 
      message: 'Correo enviado exitosamente',
      emailData: {
        to: data.to,
        subject,
        htmlContent
      }
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el correo' },
      { status: 500 }
    )
  }
}