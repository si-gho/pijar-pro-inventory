import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { BottomMenu } from '@/components/bottom-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pijar Pro - Sistem Kelola Barang',
  description: 'Aplikasi manajemen inventori untuk proyek pembangunan',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Pijar Pro
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sistem Kelola Barang
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Kab. Labuhanbatu Selatan
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pb-20">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2025 Sistem Kelola Barang Proyek - Kabupaten Labuhanbatu Selatan</p>
            </div>
          </div>
        </footer>

        {/* Bottom Navigation */}
        <BottomMenu />

        <Toaster />
      </body>
    </html>
  )
}