'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInventoryStore } from '@/lib/store/inventory-store'
import { exportToCsv } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InventoryForm } from '@/components/inventory-form'
import { StatsCards } from '@/components/stats-cards'
import { InventoryTable } from '@/components/inventory-table'
import { Download, Plus, User } from 'lucide-react'

// Sample data for initial load
const sampleData = [
  {
    id: 1,
    date: new Date('2025-09-28T08:30:00'),
    name: 'Semen Tonasa 40kg',
    type: 'masuk' as const,
    quantity: 500,
    notes: 'Kiriman dari supplier PT. Maju Jaya',
    project: 'Pembangunan Gedung Kantor',
    supervisor: 'Ir. Ahmad Fauzi',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    date: new Date('2025-09-28T10:15:00'),
    name: 'Besi Beton 10mm',
    type: 'keluar' as const,
    quantity: 200,
    notes: 'Untuk pengecoran lantai 2',
    project: 'Pembangunan Gedung Kantor',
    supervisor: 'Ir. Ahmad Fauzi',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    date: new Date('2025-09-29T09:00:00'),
    name: 'Pasir Cor',
    type: 'masuk' as const,
    quantity: 15,
    notes: 'Dalam satuan truk (m³)',
    project: 'Renovasi Jembatan Aek Tapa',
    supervisor: 'Drs. Budi Santoso',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    date: new Date('2025-09-29T14:30:00'),
    name: 'Cat Tembok Nippon',
    type: 'keluar' as const,
    quantity: 30,
    notes: 'Untuk finishing area ruang pertemuan',
    project: 'Pembangunan Gedung Kantor',
    supervisor: 'Ir. Ahmad Fauzi',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    date: new Date('2025-09-30T07:45:00'),
    name: 'Keramik 40x40',
    type: 'masuk' as const,
    quantity: 800,
    notes: 'Model Roman Granit warna abu-abu',
    project: 'Renovasi Jembatan Aek Tapa',
    supervisor: 'Drs. Budi Santoso',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export default function HomePage() {
  const { items, setItems, toggleForm, showForm } = useInventoryStore()

  useEffect(() => {
    // Load sample data on initial render
    if (items.length === 0) {
      setItems(sampleData)
    }
  }, [items.length, setItems])

  const handleExport = () => {
    exportToCsv(items, 'laporan-barang')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold text-slate-900">
                Dashboard Kelola Barang
              </h1>
              <p className="text-muted-foreground mt-1">
                Proyek Pembangunan - Kab. Labuhanbatu Selatan
              </p>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Ir. Ahmad Fauzi</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center gap-2"
                  disabled={items.length === 0}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                
                <Button
                  onClick={toggleForm}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {showForm ? 'Tutup Form' : 'Tambah Data'}
                  </span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        {/* Footer */}
        <motion.footer 
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <p>© 2025 Sistem Kelola Barang Proyek - Kabupaten Labuhanbatu Selatan</p>
        </motion.footer>
      </main>
    </div>
  )
}