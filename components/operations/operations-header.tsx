'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Download, Plus, User } from 'lucide-react'

interface OperationsHeaderProps {
  onExport: () => void
  onToggleForm: () => void
  showForm: boolean
  itemsCount: number
}

export function OperationsHeader({ 
  onExport, 
  onToggleForm, 
  showForm, 
  itemsCount 
}: OperationsHeaderProps) {
  return (
    <motion.div 
      className="bg-white shadow-sm border-b mb-6"
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
              Operasi
            </h1>
            <p className="text-muted-foreground mt-1">
              Kelola data masuk dan keluar barang proyek
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
                onClick={onExport}
                className="flex items-center gap-2"
                disabled={itemsCount === 0}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              
              <Button
                onClick={onToggleForm}
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
    </motion.div>
  )
}