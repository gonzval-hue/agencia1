'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Product {
  id: number
  name: string
  code: string
  price: number
}

type FormType = 'quote-general' | 'quote-product' | 'services'

interface DynamicContactFormProps {
  isOpen: boolean
  onClose: () => void
  type: FormType
  product?: Product | null
}

export default function DynamicContactForm({ isOpen, onClose, type, product }: DynamicContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    company: '',
    quantity: '',
    message: '',
    contactPreference: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let emailData = {
        type,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        company: formData.company,
        message: formData.message,
        to: 'ventas@agencia1.cl'
      }

      // Agregar datos específicos según el tipo de formulario
      if (type === 'quote-product' && product) {
        emailData = {
          ...emailData,
          productName: product.name,
          productCode: product.code,
          productPrice: product.price,
          quantity: formData.quantity
        }
      } else if (type === 'quote-general') {
        emailData = {
          ...emailData,
          quantity: formData.quantity
        }
      } else if (type === 'services') {
        emailData = {
          ...emailData,
          contactPreference: formData.contactPreference
        }
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      if (response.ok) {
        toast.success('¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.')
        onClose()
        // Reset form
        setFormData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          company: '',
          quantity: '',
          message: '',
          contactPreference: ''
        })
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al enviar el mensaje')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error de conexión. Por favor intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDialogTitle = () => {
    switch (type) {
      case 'quote-general':
        return 'Solicitar Cotización'
      case 'quote-product':
        return 'Cotizar Producto'
      case 'services':
        return 'Conozca Nuestros Servicios'
      default:
        return 'Contacto'
    }
  }

  const getDialogDescription = () => {
    switch (type) {
      case 'quote-general':
        return 'Complete el formulario para recibir una cotización personalizada'
      case 'quote-product':
        return 'Complete el formulario para cotizar este producto'
      case 'services':
        return 'Complete el formulario y le contactaremos según su preferencia'
      default:
        return 'Complete el formulario para contactarnos'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos comunes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nombre Completo *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Correo Electrónico *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                placeholder="juan@empresa.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientPhone">Teléfono</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                placeholder="+52 123 456 7890"
              />
            </div>
            <div>
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Empresa S.A. de C.V."
              />
            </div>
          </div>

          {/* Campo específico para formulario de servicios */}
          {type === 'services' && (
            <div>
              <Label htmlFor="contactPreference">¿Cómo prefiere ser contactado? *</Label>
              <Select value={formData.contactPreference} onValueChange={(value) => setFormData(prev => ({ ...prev, contactPreference: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Teléfono</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="meeting">Agendar una reunión</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Información del producto (solo para cotización de producto específico) */}
          {type === 'quote-product' && product && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Producto Seleccionado</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.code}</p>
                  </div>
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campo de cantidad (solo para formularios de cotización) */}
          {(type === 'quote-general' || type === 'quote-product') && (
            <div>
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="100"
                min="1"
                required
              />
            </div>
          )}

          {/* Campo de mensaje */}
          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder={
                type === 'services' 
                  ? "Describa qué servicios le interesan..." 
                  : "Describa su proyecto o requisitos especiales..."
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}