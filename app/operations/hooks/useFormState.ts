/**
 * Form state management hooks for operations domain
 */

import { useOperationsStore } from '../store/operationsStore'
import { useInventoryItems } from './useInventoryItems'

export function useInventoryFormState() {
  const {
    inventoryForm,
    formErrors,
    isSubmitting,
    updateInventoryForm,
    resetInventoryForm,
    setFormError,
    clearFormError,
    clearAllFormErrors,
    setSubmitting
  } = useOperationsStore()

  const { items: masterItems } = useInventoryItems()

  // Validation functions
  const validateQuantity = (quantity: string | number, type: 'masuk' | 'keluar', itemName: string) => {
    const qty = typeof quantity === 'string' ? parseInt(quantity) : quantity
    
    if (!qty || qty <= 0) {
      setFormError('quantity', 'Jumlah harus lebih dari 0')
      return false
    }

    if (type === 'keluar') {
      const masterItem = masterItems.find(item => item.name === itemName)
      if (masterItem && qty > masterItem.current_stock) {
        setFormError('quantity', `Stok tidak mencukupi. Stok tersedia: ${masterItem.current_stock}`)
        return false
      }
    }

    clearFormError('quantity')
    return true
  }

  const validateItemName = (name: string) => {
    if (!name.trim()) {
      setFormError('name', 'Nama barang harus diisi')
      return false
    }
    clearFormError('name')
    return true
  }

  const validateType = (type: string) => {
    if (!type || type === '') {
      setFormError('type', 'Tipe transaksi harus dipilih')
      return false
    }
    clearFormError('type')
    return true
  }

  const validateUnit = (unit: string) => {
    if (!unit.trim()) {
      setFormError('unit', 'Satuan harus diisi')
      return false
    }
    clearFormError('unit')
    return true
  }

  const validateForm = () => {
    const isQuantityValid = validateQuantity(inventoryForm.quantity, inventoryForm.type as 'masuk' | 'keluar', inventoryForm.name)
    const isNameValid = validateItemName(inventoryForm.name)
    const isTypeValid = validateType(inventoryForm.type)
    const isUnitValid = validateUnit(inventoryForm.unit || '')
    
    return isQuantityValid && isNameValid && isTypeValid && isUnitValid
  }

  return {
    formData: inventoryForm,
    errors: formErrors,
    isSubmitting,
    masterItems,
    updateForm: updateInventoryForm,
    resetForm: resetInventoryForm,
    setError: setFormError,
    clearError: clearFormError,
    clearAllErrors: clearAllFormErrors,
    setSubmitting,
    validateQuantity,
    validateItemName,
    validateType,
    validateUnit,
    validateForm
  }
}

export function useNewItemFormState() {
  const {
    newItemForm,
    formErrors,
    isSubmitting,
    updateNewItemForm,
    resetNewItemForm,
    setFormError,
    clearFormError,
    setSubmitting
  } = useOperationsStore()

  const validateItemName = (name: string) => {
    if (!name.trim()) {
      setFormError('itemName', 'Nama barang harus diisi')
      return false
    }
    clearFormError('itemName')
    return true
  }

  const validateForm = () => {
    return validateItemName(newItemForm.itemName)
  }

  return {
    formData: newItemForm,
    errors: formErrors,
    isSubmitting,
    updateForm: updateNewItemForm,
    resetForm: resetNewItemForm,
    setError: setFormError,
    clearError: clearFormError,
    setSubmitting,
    validateItemName,
    validateForm
  }
}