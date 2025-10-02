/**
 * Hook for managing inventory items (master data)
 */

import { useEffect, useState } from 'react'
import { useOperationsStore } from '../store/operationsStore'

export interface InventoryMasterItem {
  id: number
  name: string
  description: string
  unit: string
  category: string
  current_stock: number
  min_stock: number
  max_stock: number
  created_at: string
  updated_at: string
}

// API functions
async function fetchInventoryMasterItems(): Promise<InventoryMasterItem[]> {
  const response = await fetch('/api/inventory-items')
  if (!response.ok) {
    throw new Error('Failed to fetch inventory master items')
  }
  return response.json()
}

async function createInventoryMasterItem(item: Omit<InventoryMasterItem, 'id' | 'created_at' | 'updated_at' | 'current_stock'>): Promise<InventoryMasterItem> {
  const response = await fetch('/api/inventory-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
  if (!response.ok) {
    throw new Error('Failed to create inventory master item')
  }
  return response.json()
}

// Custom hooks
export function useInventoryItems() {
  const [items, setItems] = useState<InventoryMasterItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchInventoryMasterItems()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Listen for refresh events
    const handleRefresh = () => fetchData()
    window.addEventListener('refreshInventoryItems', handleRefresh)
    
    return () => {
      window.removeEventListener('refreshInventoryItems', handleRefresh)
    }
  }, [])

  return {
    items,
    isLoading,
    error,
    refetch: fetchData
  }
}

export function useCreateInventoryMasterItem() {
  const { setSubmitting, setError, toggleNewItemModal, resetNewItemForm } = useOperationsStore()

  const mutateAsync = async (item: Omit<InventoryMasterItem, 'id' | 'created_at' | 'updated_at' | 'current_stock'>) => {
    try {
      setSubmitting(true)
      setError(null)
      const newItem = await createInventoryMasterItem(item)
      
      // Refresh the inventory items list
      window.dispatchEvent(new CustomEvent('refreshInventoryItems'))
      
      toggleNewItemModal()
      resetNewItemForm()
      return newItem
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create master item'
      setError(errorMessage)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  return { mutateAsync }
}