'use client'

import { useState, useRef, useEffect } from 'react'
import { useInventoryItems } from '@/lib/hooks/use-inventory-items'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, AlertTriangle } from 'lucide-react'
import {
  validateNewItemForm,
  handleOperationError,
  formatErrorForToast,
  formatSuccessForToast,
  generateStockWarningMessage,
  type NewItemFormData
} from '@/lib/validations/operations'

// Interface untuk NewItemModal
interface NewItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (item: any) => void
}

// Interface untuk StockWarningModal
interface StockWarningModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  maxStock: number
  itemName: string
  onAdjust: () => void
}

// Modal untuk tambah barang baru
export function NewItemModal({
  open,
  onOpenChange,
  onSuccess
}: NewItemModalProps) {
  const { addItem, refetch } = useInventoryItems()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
  })

  // Ref untuk auto-focus
  const itemNameInputRef = useRef<HTMLInputElement>(null)

  // Auto focus saat modal terbuka
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        itemNameInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      // Validasi form data
      const validationResult = validateNewItemForm(formData)
      
      if (!validationResult.success) {
        const operationError = handleOperationError(validationResult.error)
        toast(formatErrorForToast(operationError))
        return
      }

      const validatedData = validationResult.data

      // Buat item baru tanpa menyimpan ke database dulu
      const newItem = {
        id: Date.now(), // temporary ID
        itemName: validatedData.itemName,
        description: validatedData.description || '',
        stockQty: 0,
        createdAt: new Date(),
      }

      toast(formatSuccessForToast('ITEM_ADDED', `${newItem.itemName} akan ditambahkan setelah transaksi disimpan`))

      // Reset form
      setFormData({ itemName: '', description: '' })
      onSuccess(newItem)
    } catch (error) {
      const operationError = handleOperationError(error)
      toast(formatErrorForToast(operationError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Barang Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Nama Barang</Label>
            <Input
              ref={itemNameInputRef}
              id="itemName"
              value={formData.itemName}
              onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
              placeholder="Masukkan nama barang baru"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi barang..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Lanjutkan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Modal peringatan stok tidak cukup
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
              {generateStockWarningMessage(itemName, maxStock + 1, maxStock)}
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