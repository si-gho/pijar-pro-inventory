'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, BarChart3, Settings, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Selamat Datang di Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Kelola inventori proyek pembangunan dengan mudah dan efisien
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Operasional</CardTitle>
                <CardDescription>Kelola barang masuk & keluar</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/operations">
              <Button className="w-full">
                Buka Operasional
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Laporan</CardTitle>
                <CardDescription>Analisis & statistik data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Segera Hadir
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Pengaturan</CardTitle>
                <CardDescription>Konfigurasi sistem</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Segera Hadir
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Section */}
      <motion.div
        className="bg-white rounded-lg p-6 shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Tentang Sistem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-slate-900 mb-2">Fitur Utama</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>• Pencatatan barang masuk dan keluar</li>
              <li>• Dashboard statistik real-time</li>
              <li>• Export data ke CSV</li>
              <li>• Interface mobile-friendly</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 mb-2">Teknologi</h3>
            <ul className="text-muted-foreground space-y-1">
              <li>• Next.js 15 dengan App Router</li>
              <li>• React 19 & TypeScript</li>
              <li>• Tailwind CSS & Shadcn/ui</li>
              <li>• Framer Motion untuk animasi</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}