# 📋 Operations Validations

Centralized validation dan error handling untuk semua operations dalam aplikasi inventory.

## 📁 Structure

```
lib/validations/operations/
├── index.ts                 # Central exports
├── inventory-form.ts        # Validasi form inventory/transaksi
├── new-item-modal.ts        # Validasi form tambah barang baru
├── stock-validation.ts      # Validasi stok dan stock warning
├── error-handling.ts        # Error handling utilities
└── README.md               # Dokumentasi ini
```

## 🎯 Usage

### Import dari Index (Recommended)
```typescript
import {
  inventoryFormSchema,
  validateInventoryForm,
  handleOperationError,
  formatErrorForToast,
  type InventoryFormData
} from '@/lib/validations/operations'
```

### Import Spesifik
```typescript
import { validateNewItemForm } from '@/lib/validations/operations/new-item-modal'
import { validateStockAvailability } from '@/lib/validations/operations/stock-validation'
```

## 📝 Validation Schemas

### 1. Inventory Form (`inventory-form.ts`)
- `inventoryFormSchema` - Validasi form transaksi
- `inventoryItemSchema` - Validasi data inventory lengkap
- Helper functions: `validateInventoryForm()`, `validateInventoryItem()`

### 2. New Item Modal (`new-item-modal.ts`)
- `newItemFormSchema` - Validasi form tambah barang
- `newInventoryItemSchema` - Validasi data inventory item baru
- Helper functions: `validateNewItemForm()`, `validateNewInventoryItem()`

### 3. Stock Validation (`stock-validation.ts`)
- `stockValidationSchema` - Validasi data stok
- `stockAdjustmentSchema` - Validasi adjustment stok
- Helper functions: `validateStockAvailability()`, `generateStockWarningMessage()`

## 🚨 Error Handling

### Error Types
```typescript
enum OperationErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STOCK_INSUFFICIENT = 'STOCK_INSUFFICIENT',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}
```

### Usage Example
```typescript
try {
  const result = await someOperation()
} catch (error) {
  const operationError = handleOperationError(error)
  toast(formatErrorForToast(operationError))
}
```

## ✅ Success Messages

```typescript
const SUCCESS_MESSAGES = {
  ITEM_ADDED: 'Barang berhasil ditambahkan',
  TRANSACTION_SAVED: 'Transaksi berhasil disimpan',
  STOCK_UPDATED: 'Stok berhasil diperbarui',
  DATA_EXPORTED: 'Data berhasil diekspor',
  FORM_RESET: 'Form berhasil direset',
}

// Usage
toast(formatSuccessForToast('TRANSACTION_SAVED', 'Detail message'))
```

## 🔧 Validation Helpers

### Form Validation
```typescript
const validationResult = validateInventoryForm(formData)
if (!validationResult.success) {
  const operationError = handleOperationError(validationResult.error)
  setErrors(operationError.details)
  return
}
const validatedData = validationResult.data
```

### Stock Validation
```typescript
const stockCheck = validateStockAvailability(
  requestedQuantity,
  availableStock,
  'keluar'
)

if (!stockCheck.isValid) {
  showStockWarning(stockCheck.message)
}
```

## 📱 Toast Integration

### Error Toast
```typescript
const operationError = handleOperationError(error)
toast(formatErrorForToast(operationError))
// Result: { title: "Data Tidak Valid", description: "...", variant: "destructive" }
```

### Success Toast
```typescript
toast(formatSuccessForToast('ITEM_ADDED', 'Paku 5cm berhasil ditambahkan'))
// Result: { title: "Barang berhasil ditambahkan", description: "Paku 5cm berhasil ditambahkan" }
```

## 🎨 Benefits

- ✅ **Centralized**: Semua validation dalam satu folder
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Consistent**: Uniform error handling
- ✅ **Reusable**: Helper functions untuk common operations
- ✅ **User Friendly**: Indonesian error messages
- ✅ **Maintainable**: Clear separation of concerns

## 🔄 Migration Notes

File lama yang dipindahkan:
- `lib/validations/inventory.ts` → `lib/validations/operations/inventory-form.ts`

Components yang diupdate:
- `components/operations/inventory-form.tsx`
- `components/operations/new-item-modal.tsx`
- `app/api/inventory/route.ts`
- `app/api/inventory-items/route.ts`