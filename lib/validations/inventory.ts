import { z } from 'zod'

export const inventoryItemSchema = z.object({
  date: z.string().min(1, 'Tanggal harus diisi'),
  name: z.string().min(1, 'Nama barang harus diisi').max(255, 'Nama barang terlalu panjang'),
  type: z.enum(['masuk', 'keluar'], {
    required_error: 'Tipe barang harus dipilih',
  }),
  quantity: z.number().min(1, 'Jumlah harus lebih dari 0'),
  notes: z.string().max(500, 'Catatan terlalu panjang').optional(),
  project: z.string().min(1, 'Proyek harus diisi').max(255, 'Nama proyek terlalu panjang'),
  supervisor: z.string().min(1, 'Pengawas harus diisi').max(255, 'Nama pengawas terlalu panjang'),
})

export const inventoryFormSchema = z.object({
  date: z.string().min(1, 'Tanggal harus diisi'),
  name: z.string().min(1, 'Nama barang harus diisi').max(255, 'Nama barang terlalu panjang'),
  type: z.enum(['masuk', 'keluar'], {
    required_error: 'Tipe barang harus dipilih',
  }),
  quantity: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === 'string' ? parseInt(val) : val
    if (isNaN(num) || num < 1) {
      throw new Error('Jumlah harus lebih dari 0')
    }
    return num
  }),
  notes: z.string().max(500, 'Catatan terlalu panjang').optional(),
})

export type InventoryFormData = z.infer<typeof inventoryFormSchema>
export type InventoryItemData = z.infer<typeof inventoryItemSchema>