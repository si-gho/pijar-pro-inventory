/**
 * Custom hooks untuk form state management operations
 */

import { useState } from 'react'
import {
  getDefaultInventoryForm,
  getDefaultNewItemForm,
  getDefaultCheckboxStates,
  getDefaultModalStates,
  getDefaultErrorStates,
  type DEFAULT_INVENTORY_FORM,
  type DEFAULT_NEW_ITEM_FORM,
  type DEFAULT_CHECKBOX_STATES,
  type DEFAULT_MODAL_STATES,
  type DEFAULT_ERROR_STATES,
} from '@/lib/constants/operations/default-states'

// Type untuk inventory form data
export type InventoryFormData = {
  date: string
  name: string
  type: 'masuk' | 'keluar'
  quantity: string | number
  notes: string
}

// Type untuk new item form data
export type NewItemFormData = {
  itemName: string
  description: string
}

/**
 * Hook untuk inventory form state
 */
export function useInventoryFormState() {
  const [formData, setFormData] = useState<InventoryFormData>(getDefaultInventoryForm())
  const [checkboxStates, setCheckboxStates] = useState(getDefaultCheckboxStates())
  const [modalStates, setModalStates] = useState(getDefaultModalStates())
  const [errorStates, setErrorStates] = useState(getDefaultErrorStates())
  const [stockStates, setStockStates] = useState({
    maxStock: 0,
    pendingNewItem: null as any,
  })

  const resetForm = () => {
    setFormData(getDefaultInventoryForm())
    setCheckboxStates(getDefaultCheckboxStates())
    setModalStates(getDefaultModalStates())
    setErrorStates(getDefaultErrorStates())
    setStockStates({ maxStock: 0, pendingNewItem: null })
  }

  const updateFormData = (updates: Partial<InventoryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateCheckboxStates = (updates: Partial<typeof checkboxStates>) => {
    setCheckboxStates(prev => ({ ...prev, ...updates }))
  }

  const updateModalStates = (updates: Partial<typeof modalStates>) => {
    setModalStates(prev => ({ ...prev, ...updates }))
  }

  const updateErrorStates = (updates: Partial<typeof errorStates>) => {
    setErrorStates(prev => ({ ...prev, ...updates }))
  }

  const updateStockStates = (updates: Partial<typeof stockStates>) => {
    setStockStates(prev => ({ ...prev, ...updates }))
  }

  return {
    // States
    formData,
    checkboxStates,
    modalStates,
    errorStates,
    stockStates,
    
    // Setters
    setFormData,
    setCheckboxStates,
    setModalStates,
    setErrorStates,
    setStockStates,
    
    // Update functions
    updateFormData,
    updateCheckboxStates,
    updateModalStates,
    updateErrorStates,
    updateStockStates,
    
    // Reset function
    resetForm,
  }
}

/**
 * Hook untuk new item modal state
 */
export function useNewItemFormState() {
  const [formData, setFormData] = useState<NewItemFormData>(getDefaultNewItemForm())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setFormData(getDefaultNewItemForm())
    setIsSubmitting(false)
    setErrors({})
  }

  const updateFormData = (updates: Partial<NewItemFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  return {
    formData,
    isSubmitting,
    errors,
    setFormData,
    setIsSubmitting,
    setErrors,
    updateFormData,
    resetForm,
  }
}

/**
 * Hook untuk table/list state
 */
export function useTableState() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  })

  const [filters, setFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'masuk' | 'keluar',
    dateFrom: '',
    dateTo: '',
    project: '',
  })

  const [sort, setSort] = useState({
    sortBy: 'date' as 'date' | 'name' | 'quantity' | 'type',
    sortOrder: 'desc' as 'asc' | 'desc',
  })

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      dateFrom: '',
      dateTo: '',
      project: '',
    })
  }

  const resetPagination = () => {
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false,
    })
  }

  const resetSort = () => {
    setSort({
      sortBy: 'date',
      sortOrder: 'desc',
    })
  }

  const resetAll = () => {
    resetFilters()
    resetPagination()
    resetSort()
  }

  return {
    pagination,
    filters,
    sort,
    setPagination,
    setFilters,
    setSort,
    resetFilters,
    resetPagination,
    resetSort,
    resetAll,
  }
}