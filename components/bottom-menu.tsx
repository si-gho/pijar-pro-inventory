'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Package, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    href: '/',
    icon: Home,
    label: 'Dashboard',
  },
  {
    href: '/operations',
    icon: Package,
    label: 'Operasional',
  },
  {
    href: '/reports',
    icon: BarChart3,
    label: 'Laporan',
  },

  {
    href: '/settings',
    icon: Settings,
    label: 'Pengaturan',
  },
]

export function BottomMenu() {
  const pathname = usePathname()

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors relative",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-blue-50 rounded-lg"
                    layoutId="activeTab"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 mb-1 relative z-10")} />
                <span className="text-xs font-medium relative z-10">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </motion.nav>
  )
}