'use client'

import { motion } from 'framer-motion'
import { useInventoryStore } from '@/lib/store/inventory-store'
import { useInventory } from '@/lib/hooks/use-inventory'
import { exportToCsv } from '@/lib/utils'
import { OperationsHeader } from '@/components/operations/operations-header'
import { InventoryForm } from '@/components/operations/inventory-form'
import { StatsCards } from '@/components/operations/stats-cards'
import { InventoryTable } from '@/components/operations/inventory-table'

export default function OperationsPage() {
  const { toggleForm, showForm } = useInventoryStore()
  const { items } = useInventory()

  const handleExport = () => {
    exportToCsv(items, 'laporan-barang')
  }

  return (
    <div>
      <OperationsHeader
        onExport={handleExport}
        onToggleForm={toggleForm}
        showForm={showForm}
        itemsCount={items.length}
      />
      
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