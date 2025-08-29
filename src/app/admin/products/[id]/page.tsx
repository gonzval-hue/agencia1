'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package,
  DollarSign,
  Hash,
  Calendar,
  Image as ImageIcon,
  Settings,
  Palette,
  Ruler,
  Layers,
  Star,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Product {
  id: string
  name: string
  description?: string
  code: string
  price?: number
  image?: string
  images: string[]
  featured: boolean
  minQuantity?: number
  maxQuantity?: number
  materials: string[]
  colors: string[]
  sizes: string[]
  customizationInfo?: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    code: string
  }
  printingTechniques: Array<{
    id: string
    name: string
    description?: string
  }>
}

export default function ProductViewPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        router.push('/admin/products')
        return
      }
      
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        alert('Error al eliminar el producto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Producto no encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Detalles del producto</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Nombre</div>
                  <div className="font-medium">{product.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Código</div>
                  <div className="font-medium font-mono">{product.code}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Precio</div>
                  <div className="font-medium">
                    {product.price ? `$${product.price.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <Badge variant={product.featured ? "default" : "secondary"}>
                    {product.featured ? "Destacado" : "Normal"}
                  </Badge>
                </div>
              </div>

              {product.description && (
                <div>
                  <div className="text-sm text-gray-500">Descripción</div>
                  <div className="mt-1">{product.description}</div>
                </div>
              )}

              {product.customizationInfo && (
                <div>
                  <div className="text-sm text-gray-500">Información de Personalización</div>
                  <div className="mt-1">{product.customizationInfo}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Arrays */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.materials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Materiales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {product.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {product.colors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Colores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {product.colors.map((color, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {product.sizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Tallas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {product.sizes.map((size, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Images */}
          {(product.image || product.images.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Imágenes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {product.image && (
                    <div className="aspect-square rounded-lg overflow-hidden border">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {product.images.map((imageUrl, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                      <img 
                        src={imageUrl} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{product.category.name}</Badge>
            </CardContent>
          </Card>

          {/* Printing Techniques */}
          <Card>
            <CardHeader>
              <CardTitle>Técnicas de Impresión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {product.printingTechniques.map((technique) => (
                  <Badge key={technique.id} variant="outline" className="text-xs">
                    {technique.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quantities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Cantidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.minQuantity && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Mínima:</span>
                  <span className="font-medium">{product.minQuantity}</span>
                </div>
              )}
              {product.maxQuantity && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Máxima:</span>
                  <span className="font-medium">{product.maxQuantity}</span>
                </div>
              )}
              {!product.minQuantity && !product.maxQuantity && (
                <div className="text-sm text-gray-500">Sin restricciones</div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Creado:</span>
                <span className="text-sm">
                  {format(new Date(product.createdAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Actualizado:</span>
                <span className="text-sm">
                  {format(new Date(product.updatedAt), 'dd/MM/yyyy', { locale: es })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro?</h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto "{product.name}".
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}