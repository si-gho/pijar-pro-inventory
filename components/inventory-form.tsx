'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInventoryStore } from '@/lib/store/inventory-store'
import { inventoryFormSchema, type InventoryFormData } from '@/lib/validations/inventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { X, Save, Loader2 } from 'lucide-react'

export function InventoryForm() {
  const { showForm, setShowForm, addItem } = useInventoryStore()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<InventoryFormData>({
    date: new Date().toISOString().slice(0, 16),
    name: '',
    type: 'masuk',
    quantity: 0,
    notes: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleTypeChange = (type: 'masuk' | 'keluar') => {
    setFormData(prev => ({ ...prev, type }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const validatedData = inventoryFormSchema.parse(formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newItem = {
        id: Date.now(), // In real app, this would come from the database
        ...validatedData,
        date: new Date(validatedData.date),
        notes: validatedData.notes || null,
        project: 'Pembangunan Gedung Kantor',
        supervisor: 'Ir. Ahmad Fauzi',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      addItem(newItem)
      
      // Reset form
      setFormData({
        date: new Date().toISOString().slice(0, 16),
        name: '',
        type: 'masuk',
        quantity: 0,
        notes: '',
      })
      
      setShowForm(false)
      
      toast({
        title: "Data berhasil ditambahkan",
        description: `${newItem.name} telah ditambahkan ke inventori.`,
      })
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Barang</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama barang"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status Barang</Label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="masuk"
                          checked={formData.type === 'masuk'}
                          onChange={() => handleTypeChange('masuk')}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">Masuk</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="keluar"
                          checked={formData.type === 'keluar'}
                          onChange={() => handleTypeChange('keluar')}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">Keluar</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Jumlah</Label>
                    <Input
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
                </div>
                
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
  )
}