'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  Filter,
  Gift,
  ArrowRight,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import DynamicContactForm from '@/components/DynamicContactForm'

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

interface Category {
  id: string
  name: string
  code: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showQuoteDialog, setShowQuoteDialog] = useState(false)
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchTerm, selectedCategory, featuredFilter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (featuredFilter !== 'all') {
        params.append('featured', featuredFilter)
      }
      
      params.append('limit', '50')
      
      const response = await fetch(`/api/products?${params}`)
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
      toast.error('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleQuoteSubmit = async (formData: FormData) => {
    setIsSubmittingQuote(true)
    
    try {
      const quoteData = {
        clientName: formData.get('clientName'),
        clientEmail: formData.get('clientEmail'),
        clientPhone: formData.get('clientPhone'),
        company: formData.get('company'),
        items: selectedProduct ? [{
          productId: selectedProduct.id,
          quantity: parseInt(formData.get('quantity') as string) || 1,
          unitPrice: selectedProduct.price,
          totalPrice: selectedProduct.price * (parseInt(formData.get('quantity') as string) || 1),
          notes: formData.get('message')
        }] : [],
        notes: formData.get('message')
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData),
      })

      if (response.ok) {
        toast.success('¡Cotización enviada exitosamente! Nos pondremos en contacto pronto.')
        setShowQuoteDialog(false)
        setSelectedProduct(null)
        // Reset form
        const form = document.getElementById('quoteForm') as HTMLFormElement
        if (form) form.reset()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al enviar la cotización')
      }
    } catch (error) {
      console.error('Error submitting quote:', error)
      toast.error('Error de conexión. Por favor intente nuevamente.')
    } finally {
      setIsSubmittingQuote(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setFeaturedFilter('all')
  }

  const filteredProducts = products

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Catálogo de Productos Nacionales
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Descubra nuestra amplia selección de productos promocionales y merchandising corporativo
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              onClick={() => window.open('https://generalcatalogue2025.eu/bbd0681110827a486ee6b02cf1f16fdb/', '_blank')}
            >
              Catálogo Europeo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Destacado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Destacados</SelectItem>
                <SelectItem value="false">No destacados</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-6">
                Intente ajustar sus filtros o términos de búsqueda
              </p>
              <Button onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
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
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                          {product.featured && (
                            <Badge variant="default">Destacado</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowQuoteDialog(true)
                          }}
                        >
                          Solicitar Cotización
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Cotización</DialogTitle>
            <DialogDescription>
              Complete el formulario para recibir una cotización personalizada
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedProduct.description}</p>
              <p className="font-bold text-blue-600">${selectedProduct.price.toFixed(2)} por unidad</p>
            </div>
          )}
          
          <form id="quoteForm" onSubmit={(e) => {
            e.preventDefault()
            handleQuoteSubmit(new FormData(e.currentTarget))
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium mb-1">
                  Nombre completo *
                </label>
                <Input
                  id="clientName"
                  name="clientName"
                  required
                  placeholder="Juan Pérez"
                />
              </div>
              
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  required
                  placeholder="juan@ejemplo.com"
                />
              </div>
              
              <div>
                <label htmlFor="clientPhone" className="block text-sm font-medium mb-1">
                  Teléfono *
                </label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  required
                  placeholder="+56 9 1234 5678"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-1">
                  Empresa
                </label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Mi Empresa S.A."
                />
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                  Cantidad
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  placeholder="1"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Mensaje adicional
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Indique cualquier requisito especial o consulta..."
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuoteDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingQuote}
                className="flex-1"
              >
                {isSubmittingQuote ? 'Enviando...' : 'Enviar Cotización'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}