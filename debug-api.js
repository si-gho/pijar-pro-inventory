// Debug API script to check what's causing the internal server error
const BASE_URL = 'http://localhost:3000'

async function debugAPI() {
  console.log('🔍 Debugging API Endpoints...\n')
  
  const endpoints = [
    { name: 'Seed Database', url: '/api/seed', method: 'POST' },
    { name: 'Get Users', url: '/api/users', method: 'GET' },
    { name: 'Get Inventory Items', url: '/api/inventory-items', method: 'GET' },
    { name: 'Get Inventory Transactions', url: '/api/inventory', method: 'GET' }
  ]
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`)
      
      const response = await fetch(`${BASE_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log(`Status: ${response.status} ${response.statusText}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Success:`, typeof data === 'object' ? `${Object.keys(data).length} keys` : data)
      } else {
        const errorText = await response.text()
        console.log(`❌ Error Response:`, errorText)
      }
      
    } catch (error) {
      console.log(`❌ Network Error:`, error.message)
    }
    
    console.log('---')
  }
  
  console.log('\n💡 If you see errors above, check:')
  console.log('1. Database connection (DATABASE_URL in .env.local)')
  console.log('2. Database tables exist (run seed endpoint first)')
  console.log('3. Server logs in terminal where you run "npm run dev"')
}

debugAPI()