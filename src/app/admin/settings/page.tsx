'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  Palette,
  Save,
  Loader2
} from 'lucide-react'

interface Category {
  id: string
  name: string
  description?: string
  code: string
  _count: {
    products: number
  }
}

interface PrintingTechnique {
  id: string
  name: string
  description?: string
  icon?: string
  _count: {
    products: number
  }
}

interface CategoryFormData {
  name: string
  description: string
  code: string
}

interface TechniqueFormData {
  name: string
  description: string
  icon: string
}

export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [techniques, setTechniques] = useState<PrintingTechnique[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("categories")

  // Category form state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    description: '',
    code: ''
  })
  const [savingCategory, setSavingCategory] = useState(false)

  // Technique form state
  const [techniqueDialogOpen, setTechniqueDialogOpen] = useState(false)
  const [editingTechnique, setEditingTechnique] = useState<PrintingTechnique | null>(null)
  const [techniqueForm, setTechniqueForm] = useState<TechniqueFormData>({
    name: '',
    description: '',
    icon: ''
  })
  const [savingTechnique, setSavingTechnique] = useState(false)

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: 'category' | 'technique'; id: string; name: string } | null>(null)

  useEffect(() => {
    fetchCategories()
    fetchTechniques()
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  // Category functions
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setCategoryForm({
        name: category.name,
        description: category.description || '',
        code: category.code
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({
        name: '',
        description: '',
        code: ''
      })
    }
    setCategoryDialogOpen(true)
  }

  const saveCategory = async () => {
    setSavingCategory(true)
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        await fetchCategories()
        setCategoryDialogOpen(false)
        setEditingCategory(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar la categoría')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error al guardar la categoría')
    } finally {
      setSavingCategory(false)
    }
  }

  const confirmDeleteCategory = (category: Category) => {
    setItemToDelete({
      type: 'category',
      id: category.id,
      name: category.name
    })
    setDeleteDialogOpen(true)
  }

  // Technique functions
  const openTechniqueDialog = (technique?: PrintingTechnique) => {
    if (technique) {
      setEditingTechnique(technique)
      setTechniqueForm({
        name: technique.name,
        description: technique.description || '',
        icon: technique.icon || ''
      })
    } else {
      setEditingTechnique(null)
      setTechniqueForm({
        name: '',
        description: '',
        icon: ''
      })
    }
    setTechniqueDialogOpen(true)
  }

  const saveTechnique = async () => {
    setSavingTechnique(true)
    try {
      const url = editingTechnique ? `/api/printing-techniques/${editingTechnique.id}` : '/api/printing-techniques'
      const method = editingTechnique ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(techniqueForm)
      })

      if (response.ok) {
        await fetchTechniques()
        setTechniqueDialogOpen(false)
        setEditingTechnique(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Error al guardar la técnica')
      }
    } catch (error) {
      console.error('Error saving technique:', error)
      alert('Error al guardar la técnica')
    } finally {
      setSavingTechnique(false)
    }
  }

  const confirmDeleteTechnique = (technique: PrintingTechnique) => {
    setItemToDelete({
      type: 'technique',
      id: technique.id,
      name: technique.name
    })
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      let url = ''
      if (itemToDelete.type === 'category') {
        url = `/api/categories/${itemToDelete.id}`
      } else {
        url = `/api/printing-techniques/${itemToDelete.id}`
      }

      const response = await fetch(url, {
        method: 'DELETE'
      })

      if (response.ok) {
        if (itemToDelete.type === 'category') {
          await fetchCategories()
        } else {
          await fetchTechniques()
        }
        setDeleteDialogOpen(false)
        setItemToDelete(null)
      } else {
        alert('Error al eliminar el elemento')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error al eliminar el elemento')
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Gestione las categorías y técnicas de impresión del sistema</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="techniques" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Técnicas de Impresión
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Categorías de Productos</CardTitle>
                  <CardDescription>
                    Gestione las categorías para organizar su catálogo de productos
                  </CardDescription>
                </div>
                <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openCategoryDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCategory ? 'Modifique los datos de la categoría' : 'Complete los datos para crear una nueva categoría'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="categoryName">Nombre *</Label>
                        <Input
                          id="categoryName"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Accesorios"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryCode">Código *</Label>
                        <Input
                          id="categoryCode"
                          value={categoryForm.code}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, code: e.target.value }))}
                          placeholder="Ej: ACC"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryDescription">Descripción</Label>
                        <Textarea
                          id="categoryDescription"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descripción de la categoría"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={saveCategory} disabled={savingCategory}>
                        {savingCategory ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {editingCategory ? 'Actualizar' : 'Guardar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay categorías registradas</p>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-500">Código: {category.code}</p>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">
                          {category._count.products} productos
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCategoryDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDeleteCategory(category)}
                            disabled={category._count.products > 0}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="techniques" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Técnicas de Impresión</CardTitle>
                  <CardDescription>
                    Gestione las técnicas de impresión disponibles para los productos
                  </CardDescription>
                </div>
                <Dialog open={techniqueDialogOpen} onOpenChange={setTechniqueDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openTechniqueDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Técnica
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTechnique ? 'Editar Técnica' : 'Nueva Técnica'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingTechnique ? 'Modifique los datos de la técnica' : 'Complete los datos para crear una nueva técnica'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="techniqueName">Nombre *</Label>
                        <Input
                          id="techniqueName"
                          value={techniqueForm.name}
                          onChange={(e) => setTechniqueForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ej: Serigrafía"
                        />
                      </div>
                      <div>
                        <Label htmlFor="techniqueIcon">Icono (emoji)</Label>
                        <Input
                          id="techniqueIcon"
                          value={techniqueForm.icon}
                          onChange={(e) => setTechniqueForm(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="Ej: 🎨"
                        />
                      </div>
                      <div>
                        <Label htmlFor="techniqueDescription">Descripción</Label>
                        <Textarea
                          id="techniqueDescription"
                          value={techniqueForm.description}
                          onChange={(e) => setTechniqueForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descripción de la técnica de impresión"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTechniqueDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={saveTechnique} disabled={savingTechnique}>
                        {savingTechnique ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {editingTechnique ? 'Actualizar' : 'Guardar'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {techniques.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay técnicas de impresión registradas</p>
                ) : (
                  techniques.map((technique) => (
                    <div key={technique.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{technique.icon || '🎨'}</div>
                        <div>
                          <h3 className="font-medium">{technique.name}</h3>
                          {technique.description && (
                            <p className="text-sm text-gray-600 mt-1">{technique.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">
                          {technique._count.products} productos
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openTechniqueDialog(technique)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDeleteTechnique(technique)}
                            disabled={technique._count.products > 0}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente "{itemToDelete?.name}".
              {itemToDelete?.type === 'category' && itemToDelete && (
                <span className="block mt-2 text-orange-600">
                  Esta categoría tiene {categories.find(c => c.id === itemToDelete.id)?._count.products || 0} productos asociados.
                </span>
              )}
              {itemToDelete?.type === 'technique' && itemToDelete && (
                <span className="block mt-2 text-orange-600">
                  Esta técnica tiene {techniques.find(t => t.id === itemToDelete.id)?._count.products || 0} productos asociados.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}