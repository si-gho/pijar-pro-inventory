/**
 * Validation schemas for inventory forms
 */

import { z } from 'zod'

export const inventoryFormSchema = z.object({
  date: z.string().min(1, 'Tanggal harus diisi'),
  name: z.string().min(1, 'Nama barang harus diisi'),
  type: z.enum(['masuk', 'keluar'], {
    required_error: 'Tipe transaksi harus dipilih'
  }),
  quantity: z.union([
    z.string().transform((val) => parseInt(val)),
    z.number()
  ]).refine((val) => val > 0, {
    message: 'Jumlah harus lebih dari 0'
  }),
  unit: z.string().min(1, 'Satuan harus diisi'),
  notes: z.string().optional()
})

export const newItemFormSchema = z.object({
  itemName: z.string().min(1, 'Nama barang harus diisi'),
  description: z.string().optional(),
  unit: z.string().default('pcs'),
  category: z.string().default('Umum'),
  min_stock: z.number().min(0).default(0),
  max_stock: z.number().min(0).default(100)
})

export type InventoryFormData = z.infer<typeof inventoryFormSchema>
export type NewItemFormData = z.infer<typeof newItemFormSchema>

// Validation functions
export function validateInventoryForm(data: any) {
  try {
    return {
      success: true,
      data: inventoryFormSchema.parse(data),
      errors: {}
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0]] = err.message
        }
      })
      return {
        success: false,
        data: null,
        errors
      }
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' }
    }
  }
}

export function validateNewItemForm(data: any) {
  try {
    return {
      success: true,
      data: newItemFormSchema.parse(data),
      errors: {}
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0]] = err.message
        }
      })
      return {
        success: false,
        data: null,
        errors
      }
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' }
    }
  }
}