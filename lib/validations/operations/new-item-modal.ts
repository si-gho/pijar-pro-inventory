import { z } from 'zod'

/**
 * Schema validasi untuk form tambah barang baru
 * Digunakan di new-item-modal.tsx
 */
export const newItemFormSchema = z.object({
  itemName: z.string()
    .min(1, 'Nama barang harus diisi')
    .max(255, 'Nama barang terlalu panjang')
    .regex(/^[a-zA-Z0-9\s\-_.,()]+$/, 'Nama barang mengandung karakter tidak valid'),
  description: z.string()
    .max(500, 'Deskripsi terlalu panjang')
    .optional()
    .or(z.literal('')),
})

/**
 * Schema validasi untuk data inventory item baru
 * Digunakan untuk API inventory-items
 */
export const newInventoryItemSchema = z.object({
  itemName: z.string()
    .min(1, 'Nama barang harus diisi')
    .max(255, 'Nama barang terlalu panjang'),
  description: z.string()
    .max(500, 'Deskripsi terlalu panjang')
    .optional(),
  stockQty: z.number()
    .min(0, 'Stok tidak boleh negatif')
    .default(0),
})

// Type exports
export type NewItemFormData = z.infer<typeof newItemFormSchema>
export type NewInventoryItemData = z.infer<typeof newInventoryItemSchema>

// Validation helper functions
export const validateNewItemForm = (data: unknown) => {
  return newItemFormSchema.safeParse(data)
}

export const validateNewInventoryItem = (data: unknown) => {
  return newInventoryItemSchema.safeParse(data)
}

// Custom validation messages
export const NEW_ITEM_VALIDATION_MESSAGES = {
  ITEM_NAME_REQUIRED: 'Nama barang harus diisi',
  ITEM_NAME_TOO_LONG: 'Nama barang terlalu panjang (maksimal 255 karakter)',
  ITEM_NAME_INVALID_CHARS: 'Nama barang mengandung karakter tidak valid',
  DESCRIPTION_TOO_LONG: 'Deskripsi terlalu panjang (maksimal 500 karakter)',
  STOCK_NEGATIVE: 'Stok tidak boleh negatif',
} as const