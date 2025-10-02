import { z } from 'zod'

/**
 * Schema validasi untuk stock warning
 * Digunakan di stock-warning-modal.tsx dan inventory-form.tsx
 */
export const stockValidationSchema = z.object({
  itemName: z.string().min(1, 'Nama barang harus diisi'),
  requestedQuantity: z.number().min(1, 'Jumlah harus lebih dari 0'),
  availableStock: z.number().min(0, 'Stok tidak boleh negatif'),
  transactionType: z.enum(['masuk', 'keluar']),
})

/**
 * Schema untuk stock adjustment
 */
export const stockAdjustmentSchema = z.object({
  itemName: z.string().min(1, 'Nama barang harus diisi'),
  adjustedQuantity: z.number().min(1, 'Jumlah yang disesuaikan harus lebih dari 0'),
  maxStock: z.number().min(0, 'Stok maksimal tidak boleh negatif'),
})

// Type exports
export type StockValidationData = z.infer<typeof stockValidationSchema>
export type StockAdjustmentData = z.infer<typeof stockAdjustmentSchema>

// Stock validation functions
export const validateStockAvailability = (
  requestedQuantity: number,
  availableStock: number,
  transactionType: 'masuk' | 'keluar'
): { isValid: boolean; message?: string } => {
  // Untuk transaksi masuk, selalu valid
  if (transactionType === 'masuk') {
    return { isValid: true }
  }

  // Untuk transaksi keluar, cek apakah stok mencukupi
  if (transactionType === 'keluar' && requestedQuantity > availableStock) {
    return {
      isValid: false,
      message: `Stok tidak mencukupi. Tersedia: ${availableStock}, diminta: ${requestedQuantity}`
    }
  }

  return { isValid: true }
}

export const validateStockAdjustment = (data: unknown) => {
  return stockAdjustmentSchema.safeParse(data)
}

export const validateStockData = (data: unknown) => {
  return stockValidationSchema.safeParse(data)
}

// Stock validation messages
export const STOCK_VALIDATION_MESSAGES = {
  INSUFFICIENT_STOCK: 'Stok tidak mencukupi untuk transaksi keluar',
  INVALID_QUANTITY: 'Jumlah yang diminta tidak valid',
  STOCK_ADJUSTED: 'Jumlah telah disesuaikan dengan stok yang tersedia',
  STOCK_WARNING_TITLE: 'Peringatan: Stok Tidak Mencukupi!',
  STOCK_WARNING_MESSAGE: 'Jumlah yang dimasukkan melebihi stok tersedia!',
} as const

// Helper function untuk generate stock warning message
export const generateStockWarningMessage = (
  itemName: string,
  requestedQuantity: number,
  availableStock: number
): string => {
  return `Barang "${itemName}" hanya memiliki stok sebanyak ${availableStock} unit. Anda meminta ${requestedQuantity} unit.`
}