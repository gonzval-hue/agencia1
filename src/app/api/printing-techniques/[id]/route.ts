import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const technique = await db.printingTechnique.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!technique) {
      return NextResponse.json(
        { error: 'Printing technique not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(technique)
  } catch (error) {
    console.error('Error fetching printing technique:', error)
    return NextResponse.json(
      { error: 'Error fetching printing technique' },
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
    const { name, description, icon } = body

    // Check if technique name already exists (excluding current technique)
    if (name) {
      const existingTechnique = await db.printingTechnique.findFirst({
        where: {
          name,
          NOT: { id: params.id }
        }
      })

      if (existingTechnique) {
        return NextResponse.json(
          { error: 'Printing technique name already exists' },
          { status: 400 }
        )
      }
    }

    // Update technique
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (icon !== undefined) updateData.icon = icon

    const technique = await db.printingTechnique.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(technique)
  } catch (error) {
    console.error('Error updating printing technique:', error)
    return NextResponse.json(
      { error: 'Error updating printing technique' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if technique has products
    const techniqueWithProducts = await db.printingTechnique.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!techniqueWithProducts) {
      return NextResponse.json(
        { error: 'Printing technique not found' },
        { status: 404 }
      )
    }

    if (techniqueWithProducts._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete printing technique with associated products' },
        { status: 400 }
      )
    }

    await db.printingTechnique.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Printing technique deleted successfully' })
  } catch (error) {
    console.error('Error deleting printing technique:', error)
    return NextResponse.json(
      { error: 'Error deleting printing technique' },
      { status: 500 }
    )
  }
}