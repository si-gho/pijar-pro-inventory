import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { inventory } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { validateNewInventoryItem, handleOperationError } from '@/lib/validations/operations'

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
    
    // Validate request body
    const validationResult = validateNewInventoryItem(body)
    
    if (!validationResult.success) {
      const operationError = handleOperationError(validationResult.error)
      return NextResponse.json(
        { error: operationError.message, details: operationError.details },
        { status: 400 }
      )
    }
    
    const validatedData = validationResult.data
    
    const newItem = await db
      .insert(inventory)
      .values({
        itemName: validatedData.itemName,
        description: validatedData.description || null,
        stockQty: validatedData.stockQty,
      })
      .returning()

    return NextResponse.json(newItem[0], { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    const operationError = handleOperationError(error)
    return NextResponse.json(
      { error: operationError.message },
      { status: 500 }
    )
  }
}