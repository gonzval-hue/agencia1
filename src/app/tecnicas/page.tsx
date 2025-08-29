'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  ArrowRight,
  CheckCircle
} from 'lucide-react'

interface TechniqueDetails {
  name: string
  description: string
  icon: string
  features: string[]
  applications: string[]
  advantages: string[]
  bestFor: string[]
}

export default function TecnicasPage() {
  const techniqueDetails: TechniqueDetails[] = [
    {
      name: "Serigrafía",
      description: "Impresión duradera y vibrante. Ideal para grandes cantidades de monocromo, resistente al lavado y de uso prolongado.",
      icon: "🎨",
      features: ["Alta durabilidad", "Colores vibrantes", "Económica por cantidad", "Versátil"],
      applications: ["Camisetas", "Gorras", "Bolsas", "Artículos promocionales"],
      advantages: ["Resistente al lavado", "Colores intensos", "Ideal para grandes volúmenes", "Acabado profesional"],
      bestFor: ["Pedidos de 50+ unidades", "Diseños de 1-4 colores", "Productos textiles", "Artículos promocionales"]
    },
    {
      name: "Sublimación",
      description: "Calidad fotográfica perfecta. Los colores se integran directamente en las fibras, ideal para diseños complejos y fotografías.",
      icon: "🌈",
      features: ["Calidad fotográfica", "A prueba de agua", "Sin relieve al tacto", "A todo color"],
      applications: ["Ropa sintética", "Tazas", "Gorras", "Artículos promocionales"],
      advantages: ["Colores vivos", "Duradero", "Sin sensación al tacto", "Perfecto para fotos"],
      bestFor: ["Ropa deportiva", "Productos de poliéster", "Diseños complejos", "Fotografías a todo color"]
    },
    {
      name: "Impresión Digital",
      description: "Rapidez y flexibilidad. Perfecta para pedidos pequeños y prototipos, permite cambios rápidos y personalización.",
      icon: "🖨️",
      features: ["Sin mínimo de cantidad", "Alta resolución", "Entrega rápida", "Personalización"],
      applications: ["Pedidos pequeños", "Prototipos", "Artículos personalizados", "Eventos urgentes"],
      advantages: ["Producción bajo demanda", "Calidad superior", "Flexibilidad", "Entrega inmediata"],
      bestFor: ["Diseños complejos", "Fotografías", "Pedidos urgentes", "Prototipos", "Eventos"]
    },
    {
      name: "Transferencia Térmica",
      description: "Versatilidad y precisión. Mediante calor se pueden lograr diseños complejos, ideal para detalles finos y multicolores.",
      icon: "🔥",
      features: ["Alta precisión", "Buen detalle", "Múltiples colores", "Versátil"],
      applications: ["Uniformes", "Mochilas", "Textiles", "Artículos promocionales"],
      advantages: ["Detalles nítidos", "Colores vivos", "Ideal para diseños complejos", "Aplicación versátil"],
      bestFor: ["Uniformes deportivos", "Mochilas", "Textiles variados", "Diseños multicolores", "Artículos promocionales"]
    },
    {
      name: "Grabado Láser",
      description: "Elegancia y precisión. Permanente y de alta precisión, ideal para materiales duros como metal, cristal y madera.",
      icon: "⚡",
      features: ["Permanente", "Premium", "Alta precisión", "Duradero"],
      applications: ["Plumas", "Artículos metálicos", "Cristal", "Madera", "Regalos corporativos"],
      advantages: ["Acabado elegante", "Extremadamente duradero", "Personalización detallada", "Apto para regalos de lujo"],
      bestFor: ["Artículos de lujo", "Regalos corporativos", "Productos metálicos", "Cristalería", "Artículos de madera"]
    },
    {
      name: "Bordado",
      description: "Textura y calidad premium. Costura de alta calidad que proporciona textura y presencia, transmitiendo elegancia y profesionalismo.",
      icon: "🧵",
      features: ["Textura premium", "Duradero", "Alta percepción", "Profesional"],
      applications: ["Gorras", "Chamarras", "Polos", "Ropa corporativa", "Toallas"],
      advantages: ["Apariencia de lujo", "Extremadamente resistente", "Alta percepción de calidad", "Acabado profesional"],
      bestFor: ["Ropa corporativa", "Uniformes de alta gama", "Gorras", "Polos", "Regalos ejecutivos"]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header Section */}
      <section className="bg-white border-b py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Técnicas de Impresión
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Especialistas en personalización de productos con las mejores técnicas del mercado
            </p>
          </div>
        </div>
      </section>

      {/* Techniques Grid - 3 Columns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dominamos las técnicas más avanzadas para garantizar resultados excepcionales en cada proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techniqueDetails.map((technique, index) => (
              <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">{technique.icon}</span>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {technique.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">
                    {technique.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Características */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Características:</h4>
                      <div className="space-y-1">
                        {technique.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Aplicaciones */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Aplicaciones:</h4>
                      <div className="flex flex-wrap gap-1">
                        {technique.applications.slice(0, 4).map((app, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full text-sm"
                        >
                          Ver más detalles
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-3">
                            <span className="text-2xl">{technique.icon}</span>
                            {technique.name}
                          </DialogTitle>
                          <DialogDescription className="text-base">
                            {technique.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Características */}
                          <div>
                            <h4 className="font-semibold mb-3 text-gray-900">Características Principales</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {technique.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Aplicaciones */}
                          <div>
                            <h4 className="font-semibold mb-3 text-gray-900">Aplicaciones Comunes</h4>
                            <div className="flex flex-wrap gap-2">
                              {technique.applications.map((app, index) => (
                                <Badge key={index} variant="outline">
                                  {app}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Ventajas */}
                          <div>
                            <h4 className="font-semibold mb-3 text-gray-900">Ventajas</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {technique.advantages.map((advantage, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {advantage}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Ideal para */}
                          <div>
                            <h4 className="font-semibold mb-3 text-gray-900">Ideal Para</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {technique.bestFor.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ¿Necesitas asesoría profesional?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Nuestros expertos están aquí para ayudarte a seleccionar la técnica de impresión 
              perfecta para tu proyecto. Contáctanos para una consulta personalizada.
            </p>
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              Solicitar Asesoría
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}