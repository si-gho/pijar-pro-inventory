'use client'

import { motion } from 'framer-motion'
import { useInventoryStore } from '@/lib/store/inventory-store'
import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User, TrendingUp, TrendingDown } from 'lucide-react'

export function InventoryTable() {
  const { items } = useInventoryStore()

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl">Riwayat Transaksi</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tanggal/Waktu
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nama Barang
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Proyek
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">
                  Pengawas
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 text-muted-foreground/50" />
                      <p>Belum ada data transaksi</p>
                      <p className="text-sm">Tambahkan data baru untuk memulai</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(item.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{item.name}</div>
                      {item.notes && (
                        <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        item.type === 'masuk' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {item.type === 'masuk' ? (
                          <>
                            <TrendingUp className="w-3 h-3" />
                            Masuk
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3" />
                            Keluar
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold">{item.quantity.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm max-w-xs truncate">{item.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {item.supervisor}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// Import Package icon
import { Package } from 'lucide-react'