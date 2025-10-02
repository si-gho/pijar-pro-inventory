'use client'

import { motion } from 'framer-motion'
import { useOperationsStore } from '../store/operationsStore'
import { Card, CardContent } from '@/components/ui/card'
import { Package, TrendingUp, TrendingDown, FileText } from 'lucide-react'

const statsConfig = [
  {
    title: 'Total Transaksi',
    key: 'getTotalTransactions' as const,
    icon: Package,
    color: 'blue',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-slate-900'
  },
  {
    title: 'Barang Masuk',
    key: 'getTotalMasuk' as const,
    icon: TrendingUp,
    color: 'green',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600'
  },
  {
    title: 'Barang Keluar',
    key: 'getTotalKeluar' as const,
    icon: TrendingDown,
    color: 'orange',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600',
    textColor: 'text-orange-600'
  },
  {
    title: 'Proyek Aktif',
    key: 'getActiveProjects' as const,
    icon: FileText,
    color: 'purple',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-600'
  }
]

export function StatsCards() {
  const { 
    getTotalTransactions, 
    getTotalMasuk, 
    getTotalKeluar, 
    getActiveProjects,
    isLoading 
  } = useOperationsStore()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon
        let value = 0
        
        if (!isLoading) {
          switch (stat.key) {
            case 'getTotalTransactions':
              value = getTotalTransactions()
              break
            case 'getTotalMasuk':
              value = getTotalMasuk()
              break
            case 'getTotalKeluar':
              value = getTotalKeluar()
              break
            case 'getActiveProjects':
              value = getActiveProjects()
              break
          }
        }
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      {stat.title}
                    </p>
                    <motion.p 
                      className={`text-3xl font-bold mt-2 ${stat.textColor}`}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                    >
                      {isLoading ? '-' : value}
                    </motion.p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}