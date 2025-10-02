// Simple API test using curl commands
// This script generates curl commands to test your API endpoints

console.log('🧪 API Test Commands for Your Inventory System\n')
console.log('Copy and paste these commands in your terminal (make sure dev server is running on port 3000):\n')

console.log('1. Test GET Users:')
console.log('curl -X GET http://localhost:3000/api/users\n')

console.log('2. Test GET Inventory Items:')
console.log('curl -X GET http://localhost:3000/api/inventory/items\n')

console.log('3. Test GET Inventory Transactions:')
console.log('curl -X GET http://localhost:3000/api/inventory\n')

console.log('4. Test POST Seed Database:')
console.log('curl -X POST http://localhost:3000/api/seed\n')

console.log('5. Test POST Add New Inventory Item:')
console.log(`curl -X POST http://localhost:3000/api/inventory/items \\
  -H "Content-Type: application/json" \\
  -d '{"itemName": "Test Item", "description": "Test Description", "stockQty": 10}'\n`)

console.log('6. Test POST Add New Transaction:')
console.log(`curl -X POST http://localhost:3000/api/inventory \\
  -H "Content-Type: application/json" \\
  -d '{"date": "2025-10-02T10:00:00", "name": "Semen Tonasa 40kg", "type": "masuk", "quantity": 50, "notes": "Test transaction"}'\n`)

console.log('💡 Tips:')
console.log('- Make sure your development server is running: npm run dev')
console.log('- Run seed endpoint first to populate initial data')
console.log('- Use tools like Postman or Insomnia for easier API testing')