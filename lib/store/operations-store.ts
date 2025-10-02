/**
 * Operations Store - Centralized state management untuk operations
 * Menggunakan Zustand untuk state management yang lebih terstruktur
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  getDefaultInventoryForm,
  getDefaultNewItemForm,
  getDefaultCheckboxStates,
  getDefaultModalStates,
  getDefaultErrorStates,
  resetAllStates,
} from '@/lib/constants/operations/default-states'

// Types
interface InventoryFormData {
  date: string
  name: string
  type: 'masuk' | 'keluar'
  quantity: string | number
  notes: string
}

interface NewItemFormData {
  itemName: string
  description: string
}

interface CheckboxStates {
  statusMasuk: boolean
  statusKeluar: boolean
}

interface ModalStates {
  showNewItemModal: boolean
  showStockWarning: boolean
  showForm: boolean
}

interface ErrorStates {
  errors: Record<string, string>
  isSubmitting: boolean
  isLoading: boolean
  error: string | null
}

interface StockStates {
  maxStock: number
  pendingNewItem: any
}

interface FilterStates {
  search: string
  type: 'all' | 'masuk' | 'keluar'
  dateFrom: string
  dateTo: string
  project: string
}

interface OperationsState {
  // Form States
  inventoryForm: InventoryFormData
  newItemForm: NewItemFormData
  checkboxStates: CheckboxStates
  modalStates: ModalStates
  errorStates: ErrorStates
  stockStates: StockStates
  filterStates: FilterStates

  // Actions - Inventory Form
  updateInventoryForm: (updates: Partial<InventoryFormData>) => void
  resetInventoryForm: () => void
  
  // Actions - New Item Form
  updateNewItemForm: (updates: Partial<NewItemFormData>) => void
  resetNewItemForm: () => void
  
  // Actions - Checkbox States
  updateCheckboxStates: (updates: Partial<CheckboxStates>) => void
  resetCheckboxStates: () => void
  
  // Actions - Modal States
  updateModalStates: (updates: Partial<ModalStates>) => void
  toggleModal: (modalName: keyof ModalStates) => void
  resetModalStates: () => void
  
  // Actions - Error States
  updateErrorStates: (updates: Partial<ErrorStates>) => void
  setError: (field: string, message: string) => void
  clearError: (field: string) => void
  clearAllErrors: () => void
  resetErrorStates: () => void
  
  // Actions - Stock States
  updateStockStates: (updates: Partial<StockStates>) => void
  resetStockStates: () => void
  
  // Actions - Filter States
  updateFilterStates: (updates: Partial<FilterStates>) => void
  resetFilterStates: () => void
  
  // Global Actions
  resetAllStates: () => void
}

export const useOperationsStore = create<OperationsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial States
        inventoryForm: getDefaultInventoryForm(),
        newItemForm: getDefaultNewItemForm(),
        checkboxStates: getDefaultCheckboxStates(),
        modalStates: getDefaultModalStates(),
        errorStates: getDefaultErrorStates(),
        stockStates: { maxStock: 0, pendingNewItem: null },
        filterStates: {
          search: '',
          type: 'all',
          dateFrom: '',
          dateTo: '',
          project: '',
        },

        // Inventory Form Actions
        updateInventoryForm: (updates) =>
          set((state) => ({
            inventoryForm: { ...state.inventoryForm, ...updates }
          })),

        resetInventoryForm: () =>
          set({ inventoryForm: getDefaultInventoryForm() }),

        // New Item Form Actions
        updateNewItemForm: (updates) =>
          set((state) => ({
            newItemForm: { ...state.newItemForm, ...updates }
          })),

        resetNewItemForm: () =>
          set({ newItemForm: getDefaultNewItemForm() }),

        // Checkbox Actions
        updateCheckboxStates: (updates) =>
          set((state) => ({
            checkboxStates: { ...state.checkboxStates, ...updates }
          })),

        resetCheckboxStates: () =>
          set({ checkboxStates: getDefaultCheckboxStates() }),

        // Modal Actions
        updateModalStates: (updates) =>
          set((state) => ({
            modalStates: { ...state.modalStates, ...updates }
          })),

        toggleModal: (modalName) =>
          set((state) => ({
            modalStates: {
              ...state.modalStates,
              [modalName]: !state.modalStates[modalName]
            }
          })),

        resetModalStates: () =>
          set({ modalStates: getDefaultModalStates() }),

        // Error Actions
        updateErrorStates: (updates) =>
          set((state) => ({
            errorStates: { ...state.errorStates, ...updates }
          })),

        setError: (field, message) =>
          set((state) => ({
            errorStates: {
              ...state.errorStates,
              errors: { ...state.errorStates.errors, [field]: message }
            }
          })),

        clearError: (field) =>
          set((state) => {
            const { [field]: _, ...restErrors } = state.errorStates.errors
            return {
              errorStates: {
                ...state.errorStates,
                errors: restErrors
              }
            }
          }),

        clearAllErrors: () =>
          set((state) => ({
            errorStates: { ...state.errorStates, errors: {} }
          })),

        resetErrorStates: () =>
          set({ errorStates: getDefaultErrorStates() }),

        // Stock Actions
        updateStockStates: (updates) =>
          set((state) => ({
            stockStates: { ...state.stockStates, ...updates }
          })),

        resetStockStates: () =>
          set({ stockStates: { maxStock: 0, pendingNewItem: null } }),

        // Filter Actions
        updateFilterStates: (updates) =>
          set((state) => ({
            filterStates: { ...state.filterStates, ...updates }
          })),

        resetFilterStates: () =>
          set({
            filterStates: {
              search: '',
              type: 'all',
              dateFrom: '',
              dateTo: '',
              project: '',
            }
          }),

        // Global Reset
        resetAllStates: () =>
          set({
            inventoryForm: getDefaultInventoryForm(),
            newItemForm: getDefaultNewItemForm(),
            checkboxStates: getDefaultCheckboxStates(),
            modalStates: getDefaultModalStates(),
            errorStates: getDefaultErrorStates(),
            stockStates: { maxStock: 0, pendingNewItem: null },
            filterStates: {
              search: '',
              type: 'all',
              dateFrom: '',
              dateTo: '',
              project: '',
            },
          }),
      }),
      {
        name: 'operations-store',
        // Only persist certain states, not temporary ones like errors or modals
        partialize: (state) => ({
          filterStates: state.filterStates,
          // Don't persist form data, errors, or modal states
        }),
      }
    ),
    { name: 'operations-store' }
  )
)