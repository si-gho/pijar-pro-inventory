import { db } from './index'
import { users, inventory, transactions } from './schema'

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...')
    
    // Insert sample users
    const sampleUsers = await db.insert(users).values([
      {
        username: 'ahmad_fauzi',
        fullName: 'Ir. Ahmad Fauzi',
        role: 'supervisor',
      },
      {
        username: 'budi_santoso',
        fullName: 'Drs. Budi Santoso',
        role: 'supervisor',
      },
      {
        username: 'operator1',
        fullName: 'Operator Gudang 1',
        role: 'operator',
      }
    ]).returning()
    
    console.log('✅ Users seeded')
    
    // Insert sample inventory items
    const sampleInventory = await db.insert(inventory).values([
      {
        itemName: 'Semen Tonasa 40kg',
        description: 'Semen berkualitas tinggi untuk konstruksi',
        stockQty: 0,
      },
      {
        itemName: 'Besi Beton 10mm',
        description: 'Besi beton diameter 10mm untuk struktur',
        stockQty: 0,
      },
      {
        itemName: 'Pasir Cor',
        description: 'Pasir halus untuk campuran beton',
        stockQty: 0,
      },
      {
        itemName: 'Cat Tembok Nippon',
        description: 'Cat tembok interior berkualitas',
        stockQty: 0,
      },
      {
        itemName: 'Keramik 40x40',
        description: 'Keramik lantai Roman Granit warna abu-abu',
        stockQty: 0,
      }
    ]).returning()
    
    console.log('✅ Inventory items seeded')
    
    // Insert sample transactions
    const sampleTransactions = [
      {
        userId: sampleUsers[0].id, // Ahmad Fauzi
        inventoryId: sampleInventory[0].id, // Semen
        trxType: 'masuk' as const,
        qty: 500,
        trxDate: new Date('2025-09-28T08:30:00'),
      },
      {
        userId: sampleUsers[0].id, // Ahmad Fauzi
        inventoryId: sampleInventory[1].id, // Besi Beton
        trxType: 'keluar' as const,
        qty: 200,
        trxDate: new Date('2025-09-28T10:15:00'),
      },
      {
        userId: sampleUsers[1].id, // Budi Santoso
        inventoryId: sampleInventory[2].id, // Pasir Cor
        trxType: 'masuk' as const,
        qty: 15,
        trxDate: new Date('2025-09-29T09:00:00'),
      },
      {
        userId: sampleUsers[0].id, // Ahmad Fauzi
        inventoryId: sampleInventory[3].id, // Cat Tembok
        trxType: 'keluar' as const,
        qty: 30,
        trxDate: new Date('2025-09-29T14:30:00'),
      },
      {
        userId: sampleUsers[1].id, // Budi Santoso
        inventoryId: sampleInventory[4].id, // Keramik
        trxType: 'masuk' as const,
        qty: 800,
        trxDate: new Date('2025-09-30T07:45:00'),
      }
    ]
    
    await db.insert(transactions).values(sampleTransactions)
    
    console.log('✅ Transactions seeded')
    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}