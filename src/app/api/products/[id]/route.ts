import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        printingTechniques: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Process product to parse JSON fields
    const processedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      materials: product.materials ? JSON.parse(product.materials) : [],
      colors: product.colors ? JSON.parse(product.colors) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : []
    }

    return NextResponse.json(processedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error fetching product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      code,
      price,
      image,
      images,
      featured,
      minQuantity,
      maxQuantity,
      materials,
      colors,
      sizes,
      customizationInfo,
      categoryId,
      printingTechniqueIds
    } = body

    // Check if product code already exists (excluding current product)
    if (code) {
      const existingProduct = await db.product.findFirst({
        where: {
          code,
          NOT: { id: params.id }
        }
      })

      if (existingProduct) {
        return NextResponse.json(
          { error: 'Product code already exists' },
          { status: 400 }
        )
      }
    }

    // Update product
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (code !== undefined) updateData.code = code
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null
    if (image !== undefined) updateData.image = image
    if (images !== undefined) updateData.images = images ? JSON.stringify(images) : null
    if (featured !== undefined) updateData.featured = featured
    if (minQuantity !== undefined) updateData.minQuantity = minQuantity ? parseInt(minQuantity) : null
    if (maxQuantity !== undefined) updateData.maxQuantity = maxQuantity ? parseInt(maxQuantity) : null
    if (materials !== undefined) updateData.materials = materials ? JSON.stringify(materials) : null
    if (colors !== undefined) updateData.colors = colors ? JSON.stringify(colors) : null
    if (sizes !== undefined) updateData.sizes = sizes ? JSON.stringify(sizes) : null
    if (customizationInfo !== undefined) updateData.customizationInfo = customizationInfo
    if (categoryId !== undefined) updateData.categoryId = categoryId

    const product = await db.product.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
        printingTechniques: true
      }
    })

    // Update printing techniques if provided
    if (printingTechniqueIds !== undefined) {
      await db.product.update({
        where: { id: params.id },
        data: {
          printingTechniques: {
            set: printingTechniqueIds.map((id: string) => ({ id }))
          }
        }
      })
    }

    // Fetch updated product with relations
    const updatedProduct = await db.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        printingTechniques: true
      }
    })

    // Process product to parse JSON fields
    const processedProduct = {
      ...updatedProduct,
      images: updatedProduct?.images ? JSON.parse(updatedProduct.images) : [],
      materials: updatedProduct?.materials ? JSON.parse(updatedProduct.materials) : [],
      colors: updatedProduct?.colors ? JSON.parse(updatedProduct.colors) : [],
      sizes: updatedProduct?.sizes ? JSON.parse(updatedProduct.sizes) : []
    }

    return NextResponse.json(processedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Error updating product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error deleting product' },
      { status: 500 }
    )
  }
}