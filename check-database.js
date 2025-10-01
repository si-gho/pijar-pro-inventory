// Simple database check script
// Run this to verify your database connection and setup

async function checkDatabase() {
  console.log('🔍 Checking Database Connection...\n')
  
  const BASE_URL = 'http://localhost:3000'
  
  try {
    // First, try to seed the database
    console.log('1. Setting up database (seed)...')
    const seedResponse = await fetch(`${BASE_URL}/api/seed`, {
      method: 'POST'
    })
    
    if (seedResponse.ok) {
      const seedResult = await seedResponse.json()
      console.log('✅ Database setup successful:', seedResult.message)
    } else {
      console.log('⚠️  Database setup response:', seedResponse.status)
      const errorText = await seedResponse.text()
      console.log('Error details:', errorText)
    }
    
    // Check users
    console.log('\n2. Checking users...')
    const usersResponse = await fetch(`${BASE_URL}/api/users`)
    if (usersResponse.ok) {
      const users = await usersResponse.json()
      console.log(`✅ Found ${users.length} users`)
      users.forEach(user => console.log(`   - ${user.fullName} (${user.role})`))
    } else {
      console.log('❌ Failed to fetch users:', usersResponse.status)
    }
    
    // Check inventory items
    console.log('\n3. Checking inventory items...')
    const itemsResponse = await fetch(`${BASE_URL}/api/inventory-items`)
    if (itemsResponse.ok) {
      const items = await itemsResponse.json()
      console.log(`✅ Found ${items.length} inventory items`)
      items.forEach(item => console.log(`   - ${item.itemName} (Stock: ${item.stockQty})`))
    } else {
      console.log('❌ Failed to fetch inventory items:', itemsResponse.status)
    }
    
    // Check transactions
    console.log('\n4. Checking transactions...')
    const transactionsResponse = await fetch(`${BASE_URL}/api/inventory`)
    if (transactionsResponse.ok) {
      const transactions = await transactionsResponse.json()
      console.log(`✅ Found ${transactions.length} transactions`)
      transactions.slice(0, 3).forEach(tx => {
        console.log(`   - ${tx.name}: ${tx.type} ${tx.quantity} (${new Date(tx.date).toLocaleDateString()})`)
      })
    } else {
      console.log('❌ Failed to fetch transactions:', transactionsResponse.status)
    }
    
    console.log('\n🎉 Database check completed!')
    
  } catch (error) {
    console.log('❌ Network error:', error.message)
    console.log('\n💡 Make sure your development server is running:')
    console.log('   npm run dev')
    console.log('   or')
    console.log('   yarn dev')
  }
}

// Run the check
checkDatabase()