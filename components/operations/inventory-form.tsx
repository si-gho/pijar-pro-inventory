'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInventoryStore } from '@/lib/store/inventory-store'
import { useInventory } from '@/lib/hooks/use-inventory'
import { useInventoryItems } from '@/lib/hooks/use-inventory-items'
import { 
  inventoryFormSchema,
  handleOperationError,
  formatErrorForToast,
  formatSuccessForToast,
  parseZodErrors,
  type InventoryFormData as ValidatedInventoryFormData
} from '@/lib/validations/operations'
import { NewItemModal, StockWarningModal } from './new-item-modal'

// Custom interface untuk form data
interface FormData {
  date: string
  name: string
  type: 'masuk' | 'keluar'
  quantity: string | number
  notes: string
}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { X, Save, Loader2, Plus } from 'lucide-react'

export function InventoryForm() {
  const { showForm, setShowForm } = useInventoryStore()
  const { addItem, refetch } = useInventory()
  const { items: inventoryItems, loading: loadingItems, refetch: refetchItems } = useInventoryItems()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNewItemModal, setShowNewItemModal] = useState(false)
  const [showStockWarning, setShowStockWarning] = useState(false)
  const [maxStock, setMaxStock] = useState(0)
  const [pendingNewItem, setPendingNewItem] = useState<any>(null) // Barang baru yang belum disimpan

  // Refs for auto-focus
  const quantityInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().slice(0, 16),
    name: '',
    type: 'masuk',
    quantity: '',
    notes: '',
  })

  // State untuk checkbox
  const [statusMasuk, setStatusMasuk] = useState(false)
  const [statusKeluar, setStatusKeluar] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newValue = name === 'quantity' ? value : value

    // Validasi stok untuk transaksi keluar
    if (name === 'quantity' && (statusKeluar || formData.type === 'keluar') && formData.name) {
      const selectedItem = inventoryItems.find(item => item.itemName === formData.name)
      const quantity = parseInt(value) || 0
      const stock = selectedItem?.stockQty || 0

      if (selectedItem && quantity > stock) {
        setMaxStock(stock)
        setShowStockWarning(true)
        return // Jangan update formData jika melebihi stok
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleCheckboxChange = (type: 'masuk' | 'keluar', checked: boolean) => {
    if (type === 'masuk') {
      setStatusMasuk(checked)
      if (checked) {
        setStatusKeluar(false)
        setFormData(prev => ({ ...prev, type: 'masuk' }))
      }
    } else {
      setStatusKeluar(checked)
      if (checked) {
        setStatusMasuk(false)
        setFormData(prev => ({ ...prev, type: 'keluar' }))

        // Reset quantity jika ganti ke keluar dan quantity melebihi stok
        if (formData.name) {
          const selectedItem = inventoryItems.find(item => item.itemName === formData.name)
          const stock = selectedItem?.stockQty || 0
          const currentQty = typeof formData.quantity === 'number' ? formData.quantity : parseInt(formData.quantity) || 0
          if (selectedItem && currentQty > stock) {
            setFormData(prev => ({ ...prev, quantity: '' }))
          }
        }
      }
    }

    // Jika tidak ada yang checked, reset type
    if (!checked && ((type === 'masuk' && !statusKeluar) || (type === 'keluar' && !statusMasuk))) {
      setFormData(prev => ({ ...prev, type: 'masuk' })) // default ke masuk
    }
  }

  const handleItemSelect = (itemName: string) => {
    setFormData(prev => ({ ...prev, name: itemName }))

    // Auto focus ke quantity input setelah pilih barang
    setTimeout(() => {
      quantityInputRef.current?.focus()
    }, 100)
  }

  const handleStockAdjust = () => {
    setFormData(prev => ({ ...prev, quantity: maxStock.toString() }))
    setShowStockWarning(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validasi manual untuk checkbox
      if (!statusMasuk && !statusKeluar) {
        setErrors({ type: 'Pilih status barang (Masuk atau Keluar)' })
        return
      }

      // Jika ada barang baru yang pending, simpan ke database dulu
      if (pendingNewItem) {
        await fetch('/api/inventory-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemName: pendingNewItem.itemName,
            description: pendingNewItem.description || undefined,
            stockQty: 0,
          }),
        })
      }

      const formDataToValidate = {
        ...formData,
        quantity: parseInt(formData.quantity.toString()) || 0
      }

      const validatedData = inventoryFormSchema.parse(formDataToValidate)

      const itemData = {
        date: new Date(validatedData.date),
        name: validatedData.name,
        type: validatedData.type,
        quantity: validatedData.quantity,
        notes: validatedData.notes || null,
        project: 'Pembangunan Gedung Kantor',
        supervisor: 'Ir. Ahmad Fauzi',
      }

      await addItem(itemData)

      // Refresh data untuk update stok dan tabel
      await Promise.all([
        refetch(), // Refresh transactions
        refetchItems() // Refresh inventory items
      ])

      // Reset form
      setFormData({
        date: new Date().toISOString().slice(0, 16),
        name: '',
        type: 'masuk',
        quantity: '',
        notes: '',
      })

      // Reset checkbox state
      setStatusMasuk(false)
      setStatusKeluar(false)
      
      // Reset pending new item
      setPendingNewItem(null)

      setShowForm(false)

      toast(formatSuccessForToast('TRANSACTION_SAVED', `${validatedData.name} telah ditambahkan ke inventori`))
    } catch (error: any) {
      const operationError = handleOperationError(error)
      
      if (operationError.details) {
        setErrors(operationError.details as Record<string, string>)
      }
      
      toast(formatErrorForToast(operationError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            key="inventory-form-main"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">Tambah Data Baru</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 1. Tanggal/Waktu */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Tanggal/Waktu</Label>
                    <Input
                      id="date"
                      name="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={errors.date ? 'border-destructive' : ''}
                    />
                    {errors.date && (
                      <p className="text-sm text-destructive">{errors.date}</p>
                    )}
                  </div>

                  {/* 2. Nama Barang + Tombol Tambah Baru */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Barang</Label>
                    <div className="flex gap-2">
                      <Select
                        key={pendingNewItem ? `with-pending-${pendingNewItem.itemName}` : 'no-pending'}
                        value={formData.name}
                        onValueChange={handleItemSelect}
                      >
                        <SelectTrigger className={errors.name ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Pilih barang..." />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingItems ? (
                            <div className="flex items-center justify-center py-2 px-4">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              <span className="text-sm text-muted-foreground">Memuat...</span>
                            </div>
                          ) : (
                            <>
                              {/* Tampilkan barang pending jika ada */}
                              {pendingNewItem && (
                                <SelectItem key={`pending-${pendingNewItem.itemName}`} value={pendingNewItem.itemName}>
                                  <div className="flex flex-col">
                                    <span>{pendingNewItem.itemName}</span>
                                    <span className="text-xs text-blue-600 font-medium">
                                      Barang Baru (Belum Tersimpan)
                                    </span>
                                  </div>
                                </SelectItem>
                              )}
                              
                              {/* Tampilkan barang dari database */}
                              {inventoryItems.length === 0 && !pendingNewItem ? (
                                <div className="flex items-center justify-center py-2 px-4">
                                  <span className="text-sm text-muted-foreground">Tidak ada barang tersedia</span>
                                </div>
                              ) : (
                                inventoryItems.map((item, index) => (
                                  <SelectItem key={`${item.id}-${item.itemName}-${index}`} value={item.itemName}>
                                    <div className="flex flex-col">
                                      <span>{item.itemName}</span>
                                      <span className="text-xs text-muted-foreground">
                                        Stok: {item.stockQty}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowNewItemModal(true)}
                        title="Tambah barang baru"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* 3. Jumlah */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Jumlah</Label>
                    <Input
                      ref={quantityInputRef}
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity || ''}
                      onChange={handleInputChange}
                      placeholder="0"
                      className={errors.quantity ? 'border-destructive' : ''}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-destructive">{errors.quantity}</p>
                    )}
                  </div>

                  {/* 4. Status Barang */}
                  <div className="space-y-2">
                    <Label>Status Barang</Label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusMasuk}
                          onChange={(e) => handleCheckboxChange('masuk', e.target.checked)}
                          className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm">Masuk</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusKeluar}
                          onChange={(e) => handleCheckboxChange('keluar', e.target.checked)}
                          className="w-4 h-4 text-primary rounded"
                        />
                        <span className="text-sm">Keluar</span>
                      </label>
                    </div>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>

                  {/* 5. Catatan */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Tambahkan catatan..."
                      rows={2}
                      className={errors.notes ? 'border-destructive' : ''}
                    />
                    {errors.notes && (
                      <p className="text-sm text-destructive">{errors.notes}</p>
                    )}
                  </div>

                  {/* 6. Tombol Batal & Simpan */}
                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Tambah Barang Baru */}
      <NewItemModal
        open={showNewItemModal}
        onOpenChange={setShowNewItemModal}
        onSuccess={(newItem) => {
          // Simpan barang baru sebagai pending (belum ke database)
          setPendingNewItem(newItem)
          setFormData(prev => ({ ...prev, name: newItem.itemName }))
          setShowNewItemModal(false)
          // Auto focus ke quantity input setelah tambah barang
          setTimeout(() => {
            quantityInputRef.current?.focus()
          }, 100)
        }}
      />

      {/* Modal Peringatan Stok */}
      <StockWarningModal
        open={showStockWarning}
        onOpenChange={setShowStockWarning}
        maxStock={maxStock}
        itemName={formData.name}
        onAdjust={handleStockAdjust}
      />
    </>
  )
}

