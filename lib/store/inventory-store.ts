import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { InventoryItem } from '@/lib/db/schema'

interface InventoryState {
  items: InventoryItem[]
  isLoading: boolean
  error: string | null
  showForm: boolean
  
  // Actions
  setItems: (items: InventoryItem[]) => void
  addItem: (item: InventoryItem) => void
  updateItem: (id: number, item: Partial<InventoryItem>) => void
  deleteItem: (id: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleForm: () => void
  setShowForm: (show: boolean) => void
  
  // Computed values
  getTotalTransactions: () => number
  getTotalMasuk: () => number
  getTotalKeluar: () => number
  getActiveProjects: () => number
}

export const useInventoryStore = create<InventoryState>()(
  devtools(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      showForm: false,
      
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
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      toggleForm: () => set((state) => ({ showForm: !state.showForm })),
      
      setShowForm: (show) => set({ showForm: show }),
      
      getTotalTransactions: () => get().items.length,
      
      getTotalMasuk: () => get().items.filter(item => item.type === 'masuk').length,
      
      getTotalKeluar: () => get().items.filter(item => item.type === 'keluar').length,
      
      getActiveProjects: () => {
        const projects = new Set(get().items.map(item => item.project))
        return projects.size
      }
    }),
    { name: 'inventory-store' }
  )
)