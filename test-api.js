// Simple API test script
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000'

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n')

  try {
    // Test 1: GET /api/users
    console.log('1. Testing GET /api/users')
    const usersResponse = await fetch(`${BASE_URL}/api/users`)
    if (usersResponse.ok) {
      const users = await usersResponse.json()
      console.log('✅ Users API working:', users.length, 'users found')
    } else {
      console.log('❌ Users API failed:', usersResponse.status)
    }

    // Test 2: GET /api/inventory-items
    console.log('\n2. Testing GET /api/inventory-items')
    const itemsResponse = await fetch(`${BASE_URL}/api/inventory-items`)
    if (itemsResponse.ok) {
      const items = await itemsResponse.json()
      console.log('✅ Inventory Items API working:', items.length, 'items found')
    } else {
      console.log('❌ Inventory Items API failed:', itemsResponse.status)
    }

    // Test 3: GET /api/inventory (transactions)
    console.log('\n3. Testing GET /api/inventory')
    const inventoryResponse = await fetch(`${BASE_URL}/api/inventory`)
    if (inventoryResponse.ok) {
      const inventory = await inventoryResponse.json()
      console.log('✅ Inventory API working:', inventory.length, 'transactions found')
    } else {
      console.log('❌ Inventory API failed:', inventoryResponse.status)
    }

    // Test 4: POST /api/seed (setup database)
    console.log('\n4. Testing POST /api/seed')
    const seedResponse = await fetch(`${BASE_URL}/api/seed`, {
      method: 'POST'
    })
    if (seedResponse.ok) {
      const result = await seedResponse.json()
      console.log('✅ Seed API working:', result.message)
    } else {
      console.log('❌ Seed API failed:', seedResponse.status)
    }

  } catch (error) {
    console.log('❌ Network error:', error.message)
    console.log('\n💡 Make sure your development server is running:')
    console.log('   npm run dev')
    console.log('   or')
    console.log('   yarn dev')
  }
}

testAPI()