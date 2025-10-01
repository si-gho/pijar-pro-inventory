import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const userList = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))

    return NextResponse.json(userList)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newUser = await db
      .insert(users)
      .values({
        username: body.username,
        fullName: body.fullName,
        role: body.role || 'operator',
      })
      .returning()

    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}