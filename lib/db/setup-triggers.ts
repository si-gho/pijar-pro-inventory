import { db } from './index'
import { sql } from 'drizzle-orm'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function setupTriggers() {
  try {
    console.log('🔧 Setting up database triggers...')
    
    // Read the trigger SQL file
    const triggerSQL = readFileSync(join(process.cwd(), 'lib/db/triggers.sql'), 'utf-8')
    
    // Execute the trigger SQL
    await db.execute(sql.raw(triggerSQL))
    
    console.log('✅ Database triggers setup successfully!')
  } catch (error) {
    console.error('❌ Error setting up triggers:', error)
    throw error
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupTriggers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}