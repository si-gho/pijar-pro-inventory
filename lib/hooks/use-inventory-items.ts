'use client'

import { useState, useEffect } from 'react'
import { Inventory } from '@/lib/db/schema'

export function useInventoryItems() {
  const [items, setItems] = useState<Inventory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/inventory-items')
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory items')
      }
      
      const data = await response.json()
      setItems(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching inventory items:', err)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (itemData: { itemName: string; description?: string; stockQty?: number }) => {
    try {
      const response = await fetch('/api/inventory-items', {
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