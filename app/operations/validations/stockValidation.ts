/**
 * Stock validation utilities
 */

import type { InventoryMasterItem } from '../hooks/useInventoryItems'

export interface StockValidationResult {
  isValid: boolean
  message?: string
  availableStock?: number
}

export function validateStockAvailability(
  itemName: string,
  requestedQuantity: number,
  masterItems: InventoryMasterItem[]
): StockValidationResult {
  const masterItem = masterItems.find(item => item.name === itemName)
  
  if (!masterItem) {
    return {
      isValid: false,
      message: 'Barang tidak ditemukan dalam master data'
    }
  }

  if (requestedQuantity > masterItem.current_stock) {
    return {
      isValid: false,
      message: `Stok tidak mencukupi. Stok tersedia: ${masterItem.current_stock}`,
      availableStock: masterItem.current_stock
    }
  }

  return {
    isValid: true,
    availableStock: masterItem.current_stock
  }
}

export function validateMinMaxStock(
  itemName: string,
  newStock: number,
  masterItems: InventoryMasterItem[]
): StockValidationResult {
  const masterItem = masterItems.find(item => item.name === itemName)
  
  if (!masterItem) {
    return {
      isValid: false,
      message: 'Barang tidak ditemukan dalam master data'
    }
  }

  if (newStock < masterItem.min_stock) {
    return {
      isValid: false,
      message: `Stok akan di bawah minimum (${masterItem.min_stock})`
    }
  }

  if (newStock > masterItem.max_stock) {
    return {
      isValid: false,
      message: `Stok akan melebihi maksimum (${masterItem.max_stock})`
    }
  }

  return {
    isValid: true
  }
}

export function getStockStatus(
  itemName: string,
  masterItems: InventoryMasterItem[]
): 'normal' | 'low' | 'critical' | 'overstocked' {
  const masterItem = masterItems.find(item => item.name === itemName)
  
  if (!masterItem) return 'normal'

  const { current_stock, min_stock, max_stock } = masterItem
  const lowThreshold = min_stock + (max_stock - min_stock) * 0.2 // 20% above minimum
  
  if (current_stock <= min_stock) return 'critical'
  if (current_stock <= lowThreshold) return 'low'
  if (current_stock >= max_stock) return 'overstocked'
  
  return 'normal'
}