'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X,
  Image as ImageIcon,
  Package,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  code: string
}

interface PrintingTechnique {
  id: string
  name: string
  description?: string
}

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
  categoryId: string
  printingTechniques: PrintingTechnique[]
}

interface FormData {
  name: string
  description: string
  code: string
  price: string
  image: string
  images: string[]
  featured: boolean
  minQuantity: string
  maxQuantity: string
  materials: string[]
  colors: string[]
  sizes: string[]
  customizationInfo: string
  categoryId: string
  printingTechniqueIds: string[]
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [techniques, setTechniques] = useState<PrintingTechnique[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    code: '',
    price: '',
    image: '',
    images: [],
    featured: false,
    minQuantity: '',
    maxQuantity: '',
    materials: [],
    colors: [],
    sizes: [],
    customizationInfo: '',
    categoryId: '',
    printingTechniqueIds: []
  })

  const [newMaterial, setNewMaterial] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    fetchProduct()
    fetchCategories()
    fetchTechniques()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        router.push('/admin/products')
        return
      }
      
      const product: Product = await response.json()
      
      setFormData({
        name: product.name,
        description: product.description || '',
        code: product.code,
        price: product.price?.toString() || '',
        image: product.image || '',
        images: product.images || [],
        featured: product.featured,
        minQuantity: product.minQuantity?.toString() || '',
        maxQuantity: product.maxQuantity?.toString() || '',
        materials: product.materials || [],
        colors: product.colors || [],
        sizes: product.sizes || [],
        customizationInfo: product.customizationInfo || '',
        categoryId: product.categoryId,
        printingTechniqueIds: product.printingTechniques.map(t => t.id)
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/admin/products')
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

  const fetchTechniques = async () => {
    try {
      const response = await fetch('/api/printing-techniques')
      const data = await response.json()
      setTechniques(data)
    } catch (error) {
      console.error('Error fetching techniques:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(error.error || 'Error al actualizar el producto')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error al actualizar el producto')
    } finally {
      setSaving(false)
    }
  }

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, newMaterial.trim()]
      }))
      setNewMaterial('')
    }
  }

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }))
  }

  const addColor = () => {
    if (newColor.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }))
      setNewColor('')
    }
  }

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const addSize = () => {
    if (newSize.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }))
      setNewSize('')
    }
  }

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }))
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const toggleTechnique = (techniqueId: string) => {
    setFormData(prev => ({
      ...prev,
      printingTechniqueIds: prev.printingTechniqueIds.includes(techniqueId)
        ? prev.printingTechniqueIds.filter(id => id !== techniqueId)
        : [...prev.printingTechniqueIds, techniqueId]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
          <p className="text-gray-600">Modifica la información del producto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Datos principales del producto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Código *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minQuantity">Cantidad Mínima</Label>
                    <Input
                      id="minQuantity"
                      type="number"
                      value={formData.minQuantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxQuantity">Cantidad Máxima</Label>
                    <Input
                      id="maxQuantity"
                      type="number"
                      value={formData.maxQuantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxQuantity: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customizationInfo">Información de Personalización</Label>
                  <Textarea
                    id="customizationInfo"
                    value={formData.customizationInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, customizationInfo: e.target.value }))}
                    rows={2}
                    placeholder="Información sobre áreas de personalización, restricciones, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Arrays */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Materiales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nuevo material"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                    />
                    <Button type="button" size="sm" onClick={addMaterial}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Colores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nuevo color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    />
                    <Button type="button" size="sm" onClick={addColor}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColor(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tallas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nueva talla"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                    />
                    <Button type="button" size="sm" onClick={addSize}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.sizes.map((size, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {size}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSize(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Imágenes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image">Imagen Principal</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="URL de la imagen principal"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                      <img 
                        src={formData.image} 
                        alt="Vista previa"
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-product.svg'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label>Imágenes Adicionales</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL de imagen"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                      />
                      <Button type="button" size="sm" onClick={addImage}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={imageUrl} readOnly className="text-sm" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Printing Techniques */}
            <Card>
              <CardHeader>
                <CardTitle>Técnicas de Impresión</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {techniques.map((technique) => (
                    <div key={technique.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={technique.id}
                        checked={formData.printingTechniqueIds.includes(technique.id)}
                        onCheckedChange={() => toggleTechnique(technique.id)}
                      />
                      <Label htmlFor={technique.id} className="text-sm">
                        {technique.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                  />
                  <Label htmlFor="featured">Producto destacado</Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saving ? 'Guardando...' : 'Actualizar Producto'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}