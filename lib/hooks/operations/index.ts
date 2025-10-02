/**
 * Operations Hooks Index
 * Centralized exports untuk semua hooks operations
 */

// Form State Hooks
export {
  useInventoryFormState,
  useNewItemFormState,
  useTableState,
  type InventoryFormData,
  type NewItemFormData,
} from './use-form-state'

// Re-export existing hooks
export { useInventory } from '../use-inventory'
export { useInventoryItems } from '../use-inventory-items'
export { useUsers } from '../use-users'