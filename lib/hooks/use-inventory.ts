'use client'

import { useState, useEffect } from 'react'

// Type untuk response API inventory (transactions dengan join)
export interface InventoryItem {
  id: number
  date: Date | string
  name: string
  type: 'masuk' | 'keluar'
  quantity: number
  notes: string | null
  project: string
  supervisor: string
  createdAt: Date | string
  updatedAt: Date | string
  stockQty?: number
}

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/inventory')
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory items')
      }
      
      const data = await response.json()
      setItems(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching inventory:', err)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })

      if (!response.ok) {
        throw new Error('Failed to add inventory item')
      }

      const newItem = await response.json()
      setItems(prev => [newItem, ...prev])
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item')
      throw err
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
    addItem,
  }
}