'use client'

import { useOperationsStore } from '../store/operationsStore'
import { useNewItemFormState } from '../hooks/useFormState'
import { useCreateInventoryMasterItem } from '../hooks/useInventoryItems'
import { validateNewItemForm } from '../validations/inventoryForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Save } from 'lucide-react'

export function NewItemModal() {
  const { showNewItemModal, toggleNewItemModal } = useOperationsStore()
  const {
    formData,
    errors,
    isSubmitting,
    updateForm,
    resetForm,
    validateForm
  } = useNewItemFormState()
  
  const createMasterItemMutation = useCreateInventoryMasterItem()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    updateForm({ [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const validation = validateNewItemForm({
      ...formData,
      unit: 'pcs', // default unit
      category: 'Umum', // default category
      min_stock: 0,
      max_stock: 100
    })

    if (!validation.success) {
      toast({
        title: 'Validasi Gagal',
        description: 'Periksa kembali data yang dimasukkan',
        variant: 'destructive'
      })
      return
    }

    try {
      const newItem = await createMasterItemMutation.mutateAsync({
        name: formData.itemName,
        description: formData.description || '',
        unit: 'pcs',
        category: 'Umum',
        min_stock: 0,
        max_stock: 100
      })

      // Auto-populate the inventory form with the new item
      const { updateInventoryForm } = useOperationsStore.getState()
      updateInventoryForm({ name: formData.itemName })

      resetForm()
      
      toast({
        title: 'Berhasil',
        description: `Barang "${formData.itemName}" berhasil ditambahkan dan siap untuk transaksi`
      })
    } catch (error) {
      toast({
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan barang baru',
        variant: 'destructive'
      })
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm()
    }
    toggleNewItemModal()
  }

  return (
    <Dialog open={showNewItemModal} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Barang Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="itemName">Nama Barang</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              placeholder="Masukkan nama barang..."
              className={errors.itemName ? 'border-destructive' : ''}
              autoFocus
            />
            {errors.itemName && (
              <p className="text-sm text-destructive">{errors.itemName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi barang..."
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}