'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, FileText, Calendar } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Laporan & Analisis
        </h1>
        <p className="text-muted-foreground">
          Fitur ini sedang dalam pengembangan
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">Statistik Bulanan</CardTitle>
            <CardDescription>Analisis data per bulan</CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">Trend Penggunaan</CardTitle>
            <CardDescription>Pola penggunaan barang</CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <CardTitle className="text-lg">Laporan PDF</CardTitle>
            <CardDescription>Export laporan lengkap</CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <Calendar className="w-8 h-8 text-orange-600 mb-2" />
            <CardTitle className="text-lg">Jadwal Laporan</CardTitle>
            <CardDescription>Laporan otomatis berkala</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}