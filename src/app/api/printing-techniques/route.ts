import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const techniques = await db.printingTechnique.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json(techniques)
  } catch (error) {
    console.error('Error fetching printing techniques:', error)
    return NextResponse.json(
      { error: 'Error fetching printing techniques' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon } = body

    // Check if technique name already exists
    const existingTechnique = await db.printingTechnique.findUnique({
      where: { name }
    })

    if (existingTechnique) {
      return NextResponse.json(
        { error: 'Printing technique name already exists' },
        { status: 400 }
      )
    }

    const technique = await db.printingTechnique.create({
      data: {
        name,
        description,
        icon
      }
    })

    return NextResponse.json(technique, { status: 201 })
  } catch (error) {
    console.error('Error creating printing technique:', error)
    return NextResponse.json(
      { error: 'Error creating printing technique' },
      { status: 500 }
    )
  }
}