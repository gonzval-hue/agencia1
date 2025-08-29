'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gift, Palette, Truck, Users, ArrowRight, Search, Plus, Edit, Trash2, Package, Settings, Award } from "lucide-react"
import { toast } from "sonner"
import DynamicContactForm from "@/components/DynamicContactForm"

interface Product {
  id: number
  name: string
  code: string
  description: string
  price: number
  image: string
  featured: boolean
  category: string
  materials: string[]
  colors: string[]
  sizes: string[]
}

interface PrintingTechnique {
  name: string
  description: string
  icon: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [showServicesDialog, setShowServicesDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    
    // Add event listeners for header interactions
    const handleOpenQuoteDialog = () => setShowQuoteDialog(true)
    const handleShowAdminSection = () => setActiveTab("admin")
    
    window.addEventListener('open-quote-dialog', handleOpenQuoteDialog)
    window.addEventListener('show-admin-section', handleShowAdminSection)
    
    return () => {
      window.removeEventListener('open-quote-dialog', handleOpenQuoteDialog)
      window.removeEventListener('show-admin-section', handleShowAdminSection)
    }
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?featured=true&limit=8')
      const data = await response.json()
      
      // Transform the API data to match the Product interface
      const transformedProducts = (data.products || []).map((product: any) => ({
        id: parseInt(product.id),
        name: product.name,
        code: product.code,
        description: product.description || '',
        price: product.price || 0,
        image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : (product.image || '/placeholder-product.svg'),
        featured: product.featured,
        category: product.category?.name || 'Sin categoría',
        materials: Array.isArray(product.materials) ? product.materials : [],
        colors: Array.isArray(product.colors) ? product.colors : [],
        sizes: Array.isArray(product.sizes) ? product.sizes : []
      }))
      
      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to mock data if API fails
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const printingTechniques: PrintingTechnique[] = [
    {
      name: "Serigrafía",
      description: "Ideal para grandes cantidades y superficies planas. Ofrece colores vibrantes y excelente durabilidad.",
      icon: "🎨"
    },
    {
      name: "Impresión Digital",
      description: "Perfecta para diseños complejos y fotografías. Permite impresión a todo color sin costos adicionales.",
      icon: "🖨️"
    },
    {
      name: "Bordado",
      description: "Elegante y duradero para prendas textiles. Aporta un toque premium de alta calidad.",
      icon: "🧵"
    },
    {
      name: "Grabado Láser",
      description: "Precisión y elegancia en metales y madera. Resultado permanente y sofisticado.",
      icon: "⚡"
    },
    {
      name: "Transferencia de Calor",
      description: "Ideal para diseños complejos en prendas. Excelente definición y variedad de colores.",
      icon: "🔥"
    },
    {
      name: "Tampografía",
      description: "Perfecta para superficies irregulares y objetos pequeños. Alta precisión y versatilidad.",
      icon: "🎯"
    }
  ]

  const categories = ["Todos", "Accesorios", "Identificación", "Oficina", "Hogar y Oficina", "Bolsos y Maletines", "Hidratación", "Ropa y Accesorios"]

  const renderHomeSection = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Agencia 1
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Especialistas en Regalos Publicitarios y Merchandising Corporativo
            </p>
            <p className="text-lg mb-10 text-blue-50 max-w-2xl mx-auto">
              ¡Bienvenidos! Somos Agencia 1, una agencia de merchandising apasionada por transformar ideas en experiencias memorables.
              Nos especializamos en crear estrategias de marca impactantes a través de productos promocionales innovadores, 
              displays creativos y soluciones personalizadas que conectan con su público objetivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setShowQuoteDialog(true)}>
                Solicitar Cotización
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Ver Catálogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="productos-destacados" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra nuestra selección de productos más populares para promocionar su marca
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : products.filter(p => p.featured).length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No hay productos destacados disponibles</p>
              </div>
            ) : (
              products.filter(p => p.featured).map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg overflow-hidden">
                    {product.image && !product.image.includes('placeholder') ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-product.svg'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="h-16 w-16 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary">{product.code}</Badge>
                    </div>
                    <CardDescription>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                      <Button size="sm" onClick={() => {
                        setSelectedProduct(product)
                        setShowQuoteDialog(true)
                      }}>
                        Cotizar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="por-que-elegir" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Agencia 1?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Con un enfoque en la calidad, la creatividad y la efectividad, nuestro objetivo es impulsar
              la visibilidad de su marca y generar un impacto duradero en el mercado.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Personalización</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Diseñamos productos únicos con materiales de primera y técnicas de impresión avanzadas
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Variedad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Catálogo extenso con más de 1000 productos para todas las necesidades y presupuestos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Logística</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tiempos de producción rápidos (6-14 días hábiles) y entrega puntal en todo el país
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Soporte</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Equipo comprometido con su éxito, desde el diseño hasta la entrega final
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Soluciones integrales para potenciar su marca y conectar con su audiencia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Soluciones Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Estrategias a medida para la conexión con el público. Adaptamos cada proyecto a las necesidades específicas de su marca.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Displays Creativos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visibilidad de marca a largo plazo en el mercado. Soluciones visualmente atractivas para la participación del cliente.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Productos Promocionales</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Impacto duradero con artículos innovadores para la visibilidad de la marca. Productos que generan recordación positiva.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Estrategia de Marca</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Desarrollo de estrategias de marca impactantes que conectan emocionalmente con su público objetivo y generan lealtad.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-blue-50 rounded-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Transformamos ideas en experiencias memorables
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                En Agencia 1, nos especializamos en crear estrategias de marca impactantes a través de productos promocionales innovadores, 
                displays creativos y soluciones personalizadas que conectan con su público objetivo.
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowServicesDialog(true)}>
                Conozca Nuestros Servicios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proceso" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Proceso de Personalización
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Un método probado para garantizar resultados excepcionales en cada proyecto
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultoría</h3>
              <p className="text-gray-600">
                Analizamos sus necesidades y objetivos para recomendar los productos ideales
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Diseño</h3>
              <p className="text-gray-600">
                Creamos mockups digitales para visualizar el producto final con su marca
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Producción</h3>
              <p className="text-gray-600">
                Utilizamos técnicas de impresión avanzadas para una calidad superior
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega</h3>
              <p className="text-gray-600">
                Entrega puntal con control de calidad y seguimiento en tiempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contacto" className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listos para llevar su estrategia de merchandising al siguiente nivel?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Contáctenos hoy mismo en ventas@agencia1.cl o al WhatsApp +56 9 6688 3253 para explorar cómo podemos trabajar juntos.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" onClick={() => setShowQuoteDialog(true)}>
            ¡Comencemos!
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )

  const renderCatalogSection = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Catálogo de Productos
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore nuestra amplia selección de productos personalizados para promocionar su marca
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar productos..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-600" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="secondary">{product.code}</Badge>
              </div>
              <CardDescription>
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Categoría:</span>
                  <span className="text-sm font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  <Button size="sm" onClick={() => {
                    setSelectedProduct(product)
                    setShowQuoteDialog(true)
                  }}>
                    Cotizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderTechniquesSection = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Técnicas de Impresión
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Dominamos las técnicas más avanzadas de personalización para garantizar la máxima calidad en cada producto
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {printingTechniques.map((technique, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="text-6xl mb-4">{technique.icon}</div>
              <CardTitle className="text-xl">{technique.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {technique.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿No está seguro qué técnica elegir?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Nuestros expertos están aquí para ayudarle a seleccionar la técnica perfecta para su proyecto
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowQuoteDialog(true)}>
            Consultar con Expertos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  const renderAdminSection = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Acceda al panel completo de administración para gestionar productos, categorías y más
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Settings className="h-6 w-6" />
                Administración
              </CardTitle>
              <CardDescription className="text-center">
                Gestione su catálogo de productos y configuración del sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin" className="block">
                <Button className="w-full" size="lg">
                  <Package className="mr-2 h-4 w-4" />
                  Ir al Panel de Administración
                </Button>
              </Link>
              <p className="text-sm text-gray-500 text-center">
                Acceda al panel completo para crear, editar y eliminar productos
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation */}
      {/* Main Content */}
      <main>
        {activeTab === "home" && renderHomeSection()}
        {activeTab === "catalog" && renderCatalogSection()}
        {activeTab === "techniques" && renderTechniquesSection()}
        {activeTab === "admin" && renderAdminSection()}
      </main>

      {/* Dynamic Contact Forms */}
      <DynamicContactForm
        isOpen={showQuoteDialog}
        onClose={() => {
          setShowQuoteDialog(false)
          setSelectedProduct(null)
        }}
        type={selectedProduct ? 'quote-product' : 'quote-general'}
        product={selectedProduct}
      />
      
      <DynamicContactForm
        isOpen={showServicesDialog}
        onClose={() => setShowServicesDialog(false)}
        type="services"
      />
    </div>
  )
}