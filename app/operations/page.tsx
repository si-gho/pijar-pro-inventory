'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOperationsStore } from './store/operationsStore'
import { useInventory } from './hooks/useInventory'
import { OperationsHeader } from './components/OperationsHeader'
import { InventoryForm } from './components/InventoryForm'
import { StatsCards } from './components/StatsCards'
import { InventoryTable } from './components/InventoryTable'

export default function OperationsPage() {
  const { setItems, setLoading, setError } = useOperationsStore()
  const { items, isLoading, error } = useInventory()

  // Sync data with store
  useEffect(() => {
    if (items) {
      setItems(items)
    }
    setLoading(isLoading)
    if (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }, [items, isLoading, error, setItems, setLoading, setError])

  return (
    <div>
      <OperationsHeader />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Form */}
        <InventoryForm />
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <InventoryTable />
        </motion.div>
      </main>
    </div>
  )
}