import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { inventory } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const items = await db
      .select()
      .from(inventory)
      .orderBy(desc(inventory.createdAt))

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching inventory items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newItem = await db
      .insert(inventory)
      .values({
        itemName: body.itemName,
        description: body.description || null,
        stockQty: body.stockQty || 0,
      })
      .returning()

    return NextResponse.json(newItem[0], { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}