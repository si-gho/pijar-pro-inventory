'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOperationsStore } from '../store/operationsStore'
import { useInventoryFormState } from '../hooks/useFormState'
import { useCreateInventoryItem } from '../hooks/useInventory'
import { validateInventoryForm } from '../validations/inventoryForm'
import { validateStockAvailability } from '../validations/stockValidation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Save, Loader2 } from 'lucide-react'

export function OutgoingInventoryForm() {
  const { toggleForm } = useOperationsStore()
  const {
    formData,
    errors,
    isSubmitting,
    masterItems,
    updateForm,
    resetForm,
    clearAllErrors,
    validateForm,
    validateQuantity,
    validateType,
    validateUnit,
    validateItemName
  } = useInventoryFormState()

  const createMutation = useCreateInventoryItem()
  const { toast } = useToast()
  const quantityInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string | number) => {
    updateForm({ [field]: value })

    // Real-time validation
    if (field === 'name') {
      validateItemName(value as string)
    } else if (field === 'type') {
      validateType(value as string)
    } else if (field === 'unit') {
      validateUnit(value as string)
    } else if (field === 'quantity') {
      const qty = typeof value === 'string' ? parseInt(value) : value
      if (formData.type === 'keluar' && formData.name && qty > 0) {
        const validation = validateStockAvailability(formData.name, qty, masterItems)
        if (!validation.isValid) {
          toast({
            title: 'Peringatan Stok',
            description: validation.message,
            variant: 'destructive'
          })
        }
      }
      validateQuantity(qty, 'keluar', formData.name)
    }
  }

  const handleItemSelect = (itemName: string) => {
    updateForm({ name: itemName })
    // Auto focus to quantity after selecting item
    setTimeout(() => quantityInputRef.current?.focus(), 100)
  }

  // Check if form is valid for submit button
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.unit?.trim() !== '' &&
      (typeof formData.quantity === 'string' ? parseInt(formData.quantity) : formData.quantity) > 0 &&
      Object.keys(errors).length === 0
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const validation = validateInventoryForm(formData)
    if (!validation.success) {
      toast({
        title: 'Validasi Gagal',
        description: 'Periksa kembali data yang dimasukkan',
        variant: 'destructive'
      })
      return
    }

    // Additional stock validation for 'keluar' type
    const stockValidation = validateStockAvailability(
      formData.name,
      typeof formData.quantity === 'string' ? parseInt(formData.quantity) : formData.quantity,
      masterItems
    )

    if (!stockValidation.isValid) {
      toast({
        title: 'Stok Tidak Mencukupi',
        description: stockValidation.message,
        variant: 'destructive'
      })
      return
    }

    try {
      await createMutation.mutateAsync({
        date: formData.date,
        name: formData.name,
        type: 'keluar',
        quantity: typeof formData.quantity === 'string' ? parseInt(formData.quantity) : formData.quantity,
        notes: formData.notes || '',
        project: 'Pembangunan Gedung Kantor' // Default project
      })

      resetForm()
      clearAllErrors()

      toast({
        title: 'Berhasil',
        description: `${formData.name} telah ditambahkan ke inventori`
      })
    } catch (error) {
      toast({
        title: 'Gagal Menyimpan',
        description: 'Terjadi kesalahan saat menyimpan data',
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Barang Keluar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className={errors.date ? 'border-destructive' : ''}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive">{errors.date}</p>
                    )}
                  </div>

                  {/* Item Name with Searchable Combobox */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Barang</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.name}
                        onValueChange={handleItemSelect}
                      >
                        <SelectTrigger className={errors.name ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Pilih atau cari barang..." />
                        </SelectTrigger>
                        <SelectContent>
                          {masterItems.length === 0 ? (
                            <div className="flex items-center justify-center py-2 px-4">
                              <span className="text-sm text-muted-foreground">Tidak ada barang tersedia</span>
                            </div>
                          ) : (
                            masterItems.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
                                <div className="flex flex-col">
                                  <span>{item.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    Stok: {item.current_stock} | Min: {item.min_stock}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Quantity and Unit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Jumlah</Label>
                      <Input
                        ref={quantityInputRef}
                        id="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange('quantity', e.target.value)}
                        placeholder="0"
                        className={errors.quantity ? 'border-destructive' : ''}
                      />
                      {errors.quantity && (
                        <p className="text-sm text-destructive">{errors.quantity}</p>
                      )}
                      {/* Show available stock for 'keluar' type */}
                      {formData.type === 'keluar' && formData.name && (
                        <p className="text-xs text-muted-foreground">
                          Stok tersedia: {masterItems.find(item => item.name === formData.name)?.current_stock || 0}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Satuan</Label>
                      <Input
                        id="unit"
                        value={formData.unit || ''}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                        placeholder="pcs, kg, liter, dll"
                        className={errors.unit ? 'border-destructive' : ''}
                      />
                      {errors.unit && (
                        <p className="text-sm text-destructive">{errors.unit}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Tambahkan catatan..."
                      rows={2}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting || !isFormValid()}>
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
              </CardContent>
            </Card>
    </>
  )
}