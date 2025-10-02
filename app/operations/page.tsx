'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOperationsStore } from './store/operationsStore'
import { useInventory } from './hooks/useInventory'
import { OperationsHeader } from './components/OperationsHeader'
import { StatsCards } from './components/StatsCards'
import { InventoryTable } from './components/InventoryTable'
import { IncomingInventoryForm } from './components/IncomingInventoryForm'
import { OutgoingInventoryForm } from './components/OutgoingInventoryForm'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
        {/* Form Tabs */}
        <Tabs defaultValue="barang-masuk" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
            <TabsTrigger value="barang-masuk" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md">Barang Masuk</TabsTrigger>
            <TabsTrigger value="barang-keluar" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md">Barang Keluar</TabsTrigger>
          </TabsList>

          <TabsContent value="barang-masuk">
            <IncomingInventoryForm />
          </TabsContent>

          <TabsContent value="barang-keluar">
            <OutgoingInventoryForm />
          </TabsContent>
        </Tabs>
        
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