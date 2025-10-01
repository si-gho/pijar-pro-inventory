'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

interface StockWarningModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  maxStock: number
  itemName: string
  onAdjust: () => void
}

export function StockWarningModal({
  open,
  onOpenChange,
  maxStock,
  itemName,
  onAdjust
}: StockWarningModalProps) {
  const handleAdjust = () => {
    onAdjust()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Peringatan: Stok Tidak Mencukupi!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-red-800 font-medium">
                ⚠️ Jumlah yang dimasukkan melebihi stok tersedia!
              </p>
            </div>
            <p className="text-gray-700">
              Barang <span className="font-bold text-red-600">{itemName}</span> hanya memiliki stok sebanyak{' '}
              <span className="font-bold text-red-600 text-lg">{maxStock}</span> unit.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Sistem akan menyesuaikan jumlah secara otomatis ke stok maksimal yang tersedia.
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleAdjust}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
            >
              Sesuaikan ke {maxStock} Unit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}