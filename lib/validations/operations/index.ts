/**
 * Operations Validations Index
 * Centralized exports untuk semua validation dan error handling operations
 */

// Inventory Form Validations
export {
  inventoryFormSchema,
  inventoryItemSchema,
  validateInventoryForm,
  validateInventoryItem,
  type InventoryFormData,
  type InventoryItemData,
} from './inventory-form'

// New Item Modal Validations
export {
  newItemFormSchema,
  newInventoryItemSchema,
  validateNewItemForm,
  validateNewInventoryItem,
  NEW_ITEM_VALIDATION_MESSAGES,
  type NewItemFormData,
  type NewInventoryItemData,
} from './new-item-modal'

// Stock Validations
export {
  stockValidationSchema,
  stockAdjustmentSchema,
  validateStockAvailability,
  validateStockAdjustment,
  validateStockData,
  generateStockWarningMessage,
  STOCK_VALIDATION_MESSAGES,
  type StockValidationData,
  type StockAdjustmentData,
} from './stock-validation'

// Error Handling
export {
  OperationErrorType,
  parseZodErrors,
  handleOperationError,
  formatErrorForToast,
  formatSuccessForToast,
  SUCCESS_MESSAGES,
  type OperationError,
  type ValidationErrors,
} from './error-handling'

// Re-export common validation utilities
export { z } from 'zod'