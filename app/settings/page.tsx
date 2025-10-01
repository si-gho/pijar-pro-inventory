'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, User, Database, Bell, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Pengaturan Sistem
        </h1>
        <p className="text-muted-foreground">
          Fitur ini sedang dalam pengembangan
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <User className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">Profil Pengguna</CardTitle>
            <CardDescription>Kelola informasi akun</CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <Database className="w-8 h-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">Database</CardTitle>
            <CardDescription>Konfigurasi database</CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <Bell className="w-8 h-8 text-yellow-600 mb-2" />
            <CardTitle className="text-lg">Notifikasi</CardTitle>
            <CardDescription>Pengaturan pemberitahuan</CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <Shield className="w-8 h-8 text-red-600 mb-2" />
            <CardTitle className="text-lg">Keamanan</CardTitle>
            <CardDescription>Pengaturan keamanan</CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-50">
          <CardHeader className="pb-3">
            <Settings className="w-8 h-8 text-purple-600 mb-2" />
            <CardTitle className="text-lg">Sistem</CardTitle>
            <CardDescription>Konfigurasi umum</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}