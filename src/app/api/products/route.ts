import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { code: { contains: search } }
      ]
    }

    if (category !== 'all') {
      // First, find the category by name
      const categoryRecord = await db.category.findFirst({
        where: { name: { contains: category } }
      })
      
      if (categoryRecord) {
        where.categoryId = categoryRecord.id
      } else {
        // If category not found, return empty results
        return NextResponse.json({
          products: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        })
      }
    }

    if (featured === 'true') {
      where.featured = true
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          printingTechniques: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.product.count({ where })
    ])

    // Process products to parse JSON fields
    const processedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      materials: product.materials ? JSON.parse(product.materials) : [],
      colors: product.colors ? JSON.parse(product.colors) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : []
    }))

    return NextResponse.json({
      products: processedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Check if product code already exists
    const existingProduct = await db.product.findUnique({
      where: { code }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product code already exists' },
        { status: 400 }
      )
    }

    // Create product
    const product = await db.product.create({
      data: {
        name,
        description,
        code,
        price: price ? parseFloat(price) : null,
        image,
        images: images ? JSON.stringify(images) : null,
        featured: featured || false,
        minQuantity: minQuantity ? parseInt(minQuantity) : null,
        maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
        materials: materials ? JSON.stringify(materials) : null,
        colors: colors ? JSON.stringify(colors) : null,
        sizes: sizes ? JSON.stringify(sizes) : null,
        customizationInfo,
        categoryId,
        printingTechniques: printingTechniqueIds ? {
          connect: printingTechniqueIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        category: true,
        printingTechniques: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    )
  }
}