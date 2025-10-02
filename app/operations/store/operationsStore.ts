/**
 * Operations Store - Domain-specific state management
 * Combines inventory and operations state into one cohesive store
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Types
export interface InventoryItem {
  id: number
  date: string
  name: string
  type: 'masuk' | 'keluar'
  quantity: number
  notes: string
  project: string
  created_at: string
  updated_at: string
}

interface InventoryFormData {
  date: string
  name: string
  type: 'masuk' | 'keluar' | ''
  quantity: string | number
  unit: string
  notes: string
}

interface NewItemFormData {
  itemName: string
  description: string
}

interface FilterStates {
  search: string
  type: 'all' | 'masuk' | 'keluar'
  dateFrom: string
  dateTo: string
  project: string
}

interface OperationsState {
  // Data
  items: InventoryItem[]
  
  // UI States
  showForm: boolean
  showNewItemModal: boolean
  isLoading: boolean
  error: string | null
  
  // Form States
  inventoryForm: InventoryFormData
  newItemForm: NewItemFormData
  filterStates: FilterStates
  
  // Form validation
  formErrors: Record<string, string>
  isSubmitting: boolean

  // Data Actions
  setItems: (items: InventoryItem[]) => void
  addItem: (item: InventoryItem) => void
  updateItem: (id: number, item: Partial<InventoryItem>) => void
  deleteItem: (id: number) => void
  
  // UI Actions
  toggleForm: () => void
  setShowForm: (show: boolean) => void
  toggleNewItemModal: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Form Actions
  updateInventoryForm: (updates: Partial<InventoryFormData>) => void
  resetInventoryForm: () => void
  updateNewItemForm: (updates: Partial<NewItemFormData>) => void
  resetNewItemForm: () => void
  updateFilters: (updates: Partial<FilterStates>) => void
  resetFilters: () => void
  
  // Validation Actions
  setFormError: (field: string, message: string) => void
  clearFormError: (field: string) => void
  clearAllFormErrors: () => void
  setSubmitting: (submitting: boolean) => void
  
  // Computed values
  getTotalTransactions: () => number
  getTotalMasuk: () => number
  getTotalKeluar: () => number
  getActiveProjects: () => number
  getFilteredItems: () => InventoryItem[]
}

const defaultInventoryForm: InventoryFormData = {
  date: new Date().toISOString().split('T')[0],
  name: '',
  type: '',
  quantity: '',
  unit: '',
  notes: ''
}

const defaultNewItemForm: NewItemFormData = {
  itemName: '',
  description: ''
}

const defaultFilters: FilterStates = {
  search: '',
  type: 'all',
  dateFrom: '',
  dateTo: '',
  project: ''
}

export const useOperationsStore = create<OperationsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial States
        items: [],
        showForm: false,
        showNewItemModal: false,
        isLoading: false,
        error: null,
        inventoryForm: defaultInventoryForm,
        newItemForm: defaultNewItemForm,
        filterStates: defaultFilters,
        formErrors: {},
        isSubmitting: false,

        // Data Actions
        setItems: (items) => set({ items }),
        
        addItem: (item) => set((state) => ({
          items: [item, ...state.items]
        })),
        
        updateItem: (id, updatedItem) => set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, ...updatedItem } : item
          )
        })),
        
        deleteItem: (id) => set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),

        // UI Actions
        toggleForm: () => set((state) => ({ showForm: !state.showForm })),
        setShowForm: (show) => set({ showForm: show }),
        toggleNewItemModal: () => set((state) => ({ showNewItemModal: !state.showNewItemModal })),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        // Form Actions
        updateInventoryForm: (updates) =>
          set((state) => ({
            inventoryForm: { ...state.inventoryForm, ...updates }
          })),

        resetInventoryForm: () => set({ inventoryForm: defaultInventoryForm }),

        updateNewItemForm: (updates) =>
          set((state) => ({
            newItemForm: { ...state.newItemForm, ...updates }
          })),

        resetNewItemForm: () => set({ newItemForm: defaultNewItemForm }),

        updateFilters: (updates) =>
          set((state) => ({
            filterStates: { ...state.filterStates, ...updates }
          })),

        resetFilters: () => set({ filterStates: defaultFilters }),

        // Validation Actions
        setFormError: (field, message) =>
          set((state) => ({
            formErrors: { ...state.formErrors, [field]: message }
          })),

        clearFormError: (field) =>
          set((state) => {
            const { [field]: _, ...restErrors } = state.formErrors
            return { formErrors: restErrors }
          }),

        clearAllFormErrors: () => set({ formErrors: {} }),
        
        setSubmitting: (submitting) => set({ isSubmitting: submitting }),

        // Computed values
        getTotalTransactions: () => get().items.length,
        
        getTotalMasuk: () => get().items.filter(item => item.type === 'masuk').length,
        
        getTotalKeluar: () => get().items.filter(item => item.type === 'keluar').length,
        
        getActiveProjects: () => {
          const projects = new Set(get().items.map(item => item.project))
          return projects.size
        },

        getFilteredItems: () => {
          const { items, filterStates } = get()
          return items.filter(item => {
            const matchesSearch = !filterStates.search || 
              item.name.toLowerCase().includes(filterStates.search.toLowerCase()) ||
              item.notes.toLowerCase().includes(filterStates.search.toLowerCase())
            
            const matchesType = filterStates.type === 'all' || item.type === filterStates.type
            
            const matchesDateFrom = !filterStates.dateFrom || item.date >= filterStates.dateFrom
            const matchesDateTo = !filterStates.dateTo || item.date <= filterStates.dateTo
            
            const matchesProject = !filterStates.project || item.project === filterStates.project
            
            return matchesSearch && matchesType && matchesDateFrom && matchesDateTo && matchesProject
          })
        }
      }),
      {
        name: 'operations-store',
        partialize: (state) => ({
          filterStates: state.filterStates
        }),
      }
    ),
    { name: 'operations-store' }
  )
)