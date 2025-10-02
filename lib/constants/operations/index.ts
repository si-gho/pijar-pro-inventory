/**
 * Operations Constants Index
 * Centralized exports untuk semua constants operations
 */

// Default States
export {
  DEFAULT_INVENTORY_FORM,
  DEFAULT_NEW_ITEM_FORM,
  DEFAULT_CHECKBOX_STATES,
  DEFAULT_MODAL_STATES,
  DEFAULT_ERROR_STATES,
  DEFAULT_STOCK_STATES,
  DEFAULT_PAGINATION_STATES,
  DEFAULT_FILTER_STATES,
  DEFAULT_SORT_STATES,
  DEFAULT_OPERATIONS_STATES,
  getDefaultInventoryForm,
  getDefaultNewItemForm,
  getDefaultCheckboxStates,
  getDefaultModalStates,
  getDefaultErrorStates,
  resetInventoryForm,
  resetNewItemForm,
  resetAllStates,
} from './default-states'

// Re-export types if needed
export type {
  DEFAULT_INVENTORY_FORM as DefaultInventoryFormType,
  DEFAULT_NEW_ITEM_FORM as DefaultNewItemFormType,
  DEFAULT_CHECKBOX_STATES as DefaultCheckboxStatesType,
  DEFAULT_MODAL_STATES as DefaultModalStatesType,
  DEFAULT_ERROR_STATES as DefaultErrorStatesType,
} from './default-states'