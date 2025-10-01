'use client'

import { useState, useRef, useEffect } from 'react'
import { useInventoryItems } from '@/lib/hooks/use-inventory-items'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus } from 'lucide-react'

interface NewItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (item: any) => void
}

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
    if (!formData.itemName.trim()) return

    setIsSubmitting(true)
    try {
      const newItem = await addItem({
        itemName: formData.itemName,
        description: formData.description || undefined,
        stockQty: 0,
      })

      // Refresh inventory items
      await refetch()

      toast({
        title: "Barang baru ditambahkan",
        description: `${newItem.itemName} berhasil ditambahkan ke master barang.`,
      })

      // Reset form
      setFormData({ itemName: '', description: '' })
      onSuccess(newItem)
    } catch (error) {
      toast({
        title: "Gagal menambahkan barang",
        description: "Terjadi kesalahan saat menambahkan barang baru.",
        variant: "destructive",
      })
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
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}