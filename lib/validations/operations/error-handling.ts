import { ZodError } from 'zod'

/**
 * Error types untuk operations
 */
export enum OperationErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STOCK_INSUFFICIENT = 'STOCK_INSUFFICIENT',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Interface untuk operation errors
 */
export interface OperationError {
  type: OperationErrorType
  message: string
  field?: string
  details?: Record<string, any>
}

/**
 * Interface untuk validation errors
 */
export interface ValidationErrors {
  [field: string]: string
}

/**
 * Parse Zod validation errors ke format yang user-friendly
 */
export const parseZodErrors = (error: ZodError): ValidationErrors => {
  const errors: ValidationErrors = {}
  
  error.errors.forEach((err) => {
    const field = err.path.join('.')
    errors[field] = err.message
  })
  
  return errors
}

/**
 * Handle operation errors dan convert ke user-friendly message
 */
export const handleOperationError = (error: unknown): OperationError => {
  // Zod validation errors
  if (error instanceof ZodError) {
    return {
      type: OperationErrorType.VALIDATION_ERROR,
      message: 'Data yang dimasukkan tidak valid',
      details: parseZodErrors(error)
    }
  }

  // Network/Fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      type: OperationErrorType.NETWORK_ERROR,
      message: 'Gagal terhubung ke server. Periksa koneksi internet Anda.'
    }
  }

  // Custom operation errors
  if (error instanceof Error) {
    // Stock insufficient error
    if (error.message.includes('stok') || error.message.includes('stock')) {
      return {
        type: OperationErrorType.STOCK_INSUFFICIENT,
        message: error.message
      }
    }

    // Item not found error
    if (error.message.includes('not found') || error.message.includes('tidak ditemukan')) {
      return {
        type: OperationErrorType.ITEM_NOT_FOUND,
        message: error.message
      }
    }

    // Database errors
    if (error.message.includes('database') || error.message.includes('SQL')) {
      return {
        type: OperationErrorType.DATABASE_ERROR,
        message: 'Terjadi kesalahan pada database. Silakan coba lagi.'
      }
    }

    // Generic error
    return {
      type: OperationErrorType.UNKNOWN_ERROR,
      message: error.message
    }
  }

  // Unknown error
  return {
    type: OperationErrorType.UNKNOWN_ERROR,
    message: 'Terjadi kesalahan yang tidak diketahui'
  }
}

/**
 * Format error message untuk toast notifications
 */
export const formatErrorForToast = (error: OperationError) => {
  const titles: Record<OperationErrorType, string> = {
    [OperationErrorType.VALIDATION_ERROR]: 'Data Tidak Valid',
    [OperationErrorType.STOCK_INSUFFICIENT]: 'Stok Tidak Mencukupi',
    [OperationErrorType.ITEM_NOT_FOUND]: 'Barang Tidak Ditemukan',
    [OperationErrorType.DATABASE_ERROR]: 'Kesalahan Database',
    [OperationErrorType.NETWORK_ERROR]: 'Kesalahan Jaringan',
    [OperationErrorType.UNKNOWN_ERROR]: 'Kesalahan Sistem',
  }

  return {
    title: titles[error.type],
    description: error.message,
    variant: 'destructive' as const
  }
}

/**
 * Success messages untuk operations
 */
export const SUCCESS_MESSAGES = {
  ITEM_ADDED: 'Barang berhasil ditambahkan',
  TRANSACTION_SAVED: 'Transaksi berhasil disimpan',
  STOCK_UPDATED: 'Stok berhasil diperbarui',
  DATA_EXPORTED: 'Data berhasil diekspor',
  FORM_RESET: 'Form berhasil direset',
} as const

/**
 * Format success message untuk toast notifications
 */
export const formatSuccessForToast = (
  type: keyof typeof SUCCESS_MESSAGES,
  details?: string
) => {
  return {
    title: SUCCESS_MESSAGES[type],
    description: details,
  }
}