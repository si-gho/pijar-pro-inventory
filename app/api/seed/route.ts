import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/db/seed'
import { setupTriggers } from '@/lib/db/setup-triggers'

export async function POST() {
  try {
    // Setup triggers first
    await setupTriggers()
    
    // Then seed database
    await seedDatabase()
    
    return NextResponse.json({ 
      message: 'Database setup completed successfully',
      details: 'Triggers created and sample data inserted'
    })
  } catch (error) {
    console.error('Error setting up database:', error)
    return NextResponse.json(
      { 
        error: 'Failed to setup database', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}