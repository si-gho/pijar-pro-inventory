import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { inventory } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET() {
  try {
    const items = await db
      .select({
        id: inventory.id,
        name: inventory.itemName,
        description: inventory.description,
        unit: sql<string>`'pcs'`, // default unit since not in schema
        category: sql<string>`'Umum'`, // default category since not in schema
        current_stock: inventory.stockQty,
        min_stock: sql<number>`0`, // default min_stock since not in schema
        max_stock: sql<number>`100`, // default max_stock since not in schema
        created_at: inventory.createdAt,
        updated_at: inventory.createdAt, // use createdAt since updatedAt doesn't exist
      })
      .from(inventory)
      .orderBy(inventory.itemName)

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching inventory master items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simple validation
    if (!body.name) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      )
    }

    // Check if item already exists
    const existingItem = await db
      .select()
      .from(inventory)
      .where(eq(inventory.itemName, body.name))
      .limit(1)

    if (existingItem.length > 0) {
      return NextResponse.json(
        { error: 'Item already exists' },
        { status: 400 }
      )
    }

    const newItem = await db
      .insert(inventory)
      .values({
        itemName: body.name,
        description: body.description || null,
        stockQty: 0,
      })
      .returning()

    const response = {
      id: newItem[0].id,
      name: newItem[0].itemName,
      description: newItem[0].description,
      unit: 'pcs',
      category: 'Umum',
      current_stock: newItem[0].stockQty,
      min_stock: 0,
      max_stock: 100,
      created_at: newItem[0].createdAt,
      updated_at: newItem[0].createdAt,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory master item:', error)
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}