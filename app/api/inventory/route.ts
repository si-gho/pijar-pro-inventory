import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { transactions, users, inventory } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { validateInventoryItem, handleOperationError } from '@/lib/validations/operations'

export async function GET() {
  try {
    const items = await db
      .select({
        id: transactions.id,
        date: transactions.trxDate,
        name: inventory.itemName,
        type: transactions.trxType,
        quantity: transactions.qty,
        notes: inventory.description,
        project: users.fullName,
        supervisor: users.fullName,
        createdAt: transactions.createdAt,
        updatedAt: transactions.createdAt,
        stockQty: inventory.stockQty,
      })
      .from(transactions)
      .innerJoin(users, eq(transactions.userId, users.id))
      .innerJoin(inventory, eq(transactions.inventoryId, inventory.id))
      .orderBy(desc(transactions.trxDate))

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
    const validationResult = validateInventoryItem({
      ...body,
      project: body.project || 'Pembangunan Gedung Kantor',
      supervisor: body.supervisor || 'Ir. Ahmad Fauzi',
    })
    
    if (!validationResult.success) {
      const operationError = handleOperationError(validationResult.error)
      return NextResponse.json(
        { error: operationError.message, details: operationError.details },
        { status: 400 }
      )
    }
    
    const validatedData = validationResult.data
    
    // Default user ID (operator1) - in real app, get from session
    const defaultUser = await db
      .select()
      .from(users)
      .where(eq(users.username, 'operator1'))
      .limit(1)
    
    if (defaultUser.length === 0) {
      return NextResponse.json(
        { error: 'Default user not found' },
        { status: 400 }
      )
    }
    
    // Find or create inventory item
    let inventoryItem = await db
      .select()
      .from(inventory)
      .where(eq(inventory.itemName, validatedData.name))
      .limit(1)
    
    if (inventoryItem.length === 0) {
      // Create new inventory item
      const newInventoryItem = await db
        .insert(inventory)
        .values({
          itemName: validatedData.name,
          description: validatedData.notes || null,
          stockQty: 0,
        })
        .returning()
      
      inventoryItem = newInventoryItem
    }
    
    // Create transaction
    const newTransaction = await db
      .insert(transactions)
      .values({
        userId: defaultUser[0].id,
        inventoryId: inventoryItem[0].id,
        trxType: validatedData.type,
        qty: validatedData.quantity,
        trxDate: new Date(validatedData.date),
      })
      .returning()

    // Return formatted response
    const response = {
      id: newTransaction[0].id,
      date: newTransaction[0].trxDate,
      name: inventoryItem[0].itemName,
      type: newTransaction[0].trxType,
      quantity: newTransaction[0].qty,
      notes: inventoryItem[0].description,
      project: defaultUser[0].fullName,
      supervisor: defaultUser[0].fullName,
      createdAt: newTransaction[0].createdAt,
      updatedAt: newTransaction[0].createdAt,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    const operationError = handleOperationError(error)
    return NextResponse.json(
      { error: operationError.message },
      { status: 500 }
    )
  }
}