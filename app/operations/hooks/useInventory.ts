/**
 * Operations domain hooks for inventory management
 */

import { useEffect, useState } from 'react'
import { useOperationsStore } from '../store/operationsStore'
import type { InventoryItem } from '../store/operationsStore'

// API functions
async function fetchInventoryItems(): Promise<InventoryItem[]> {
  const response = await fetch('/api/inventory')
  if (!response.ok) {
    throw new Error('Failed to fetch inventory items')
  }
  return response.json()
}

async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
  const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
  if (!response.ok) {
    throw new Error('Failed to create inventory item')
  }
  return response.json()
}

// Custom hooks
export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchInventoryItems()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    items,
    isLoading,
    error,
    refetch: fetchData
  }
}

export function useCreateInventoryItem() {
  const { addItem, setSubmitting, setError } = useOperationsStore()

  const mutateAsync = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSubmitting(true)
      setError(null)
      const newItem = await createInventoryItem(item)
      addItem(newItem)
      return newItem
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create item'
      setError(errorMessage)
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  return { mutateAsync }
}