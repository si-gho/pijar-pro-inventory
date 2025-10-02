/**
 * Default States untuk Operations
 * Centralized default values untuk semua form dan state operations
 */

// Default form data untuk inventory form
export const DEFAULT_INVENTORY_FORM = {
  date: () => new Date().toISOString().slice(0, 16), // Dynamic current datetime
  name: '',
  type: 'masuk' as const,
  quantity: '',
  notes: '',
} as const

// Default form data untuk new item modal
export const DEFAULT_NEW_ITEM_FORM = {
  itemName: '',
  description: '',
} as const

// Default checkbox states
export const DEFAULT_CHECKBOX_STATES = {
  statusMasuk: false,
  statusKeluar: false,
} as const

// Default modal states
export const DEFAULT_MODAL_STATES = {
  showNewItemModal: false,
  showStockWarning: false,
  showForm: false,
} as const

// Default error states
export const DEFAULT_ERROR_STATES = {
  errors: {} as Record<string, string>,
  isSubmitting: false,
  isLoading: false,
  error: null as string | null,
} as const

// Default stock states
export const DEFAULT_STOCK_STATES = {
  maxStock: 0,
  pendingNewItem: null as any,
} as const

// Default pagination states
export const DEFAULT_PAGINATION_STATES = {
  page: 1,
  limit: 10,
  total: 0,
  hasMore: false,
} as const

// Default filter states
export const DEFAULT_FILTER_STATES = {
  search: '',
  type: 'all' as 'all' | 'masuk' | 'keluar',
  dateFrom: '',
  dateTo: '',
  project: '',
} as const

// Default sort states
export const DEFAULT_SORT_STATES = {
  sortBy: 'date' as 'date' | 'name' | 'quantity' | 'type',
  sortOrder: 'desc' as 'asc' | 'desc',
} as const

// Composite default states untuk berbagai use cases
export const DEFAULT_OPERATIONS_STATES = {
  ...DEFAULT_INVENTORY_FORM,
  ...DEFAULT_NEW_ITEM_FORM,
  ...DEFAULT_CHECKBOX_STATES,
  ...DEFAULT_MODAL_STATES,
  ...DEFAULT_ERROR_STATES,
  ...DEFAULT_STOCK_STATES,
} as const

// Helper functions untuk reset states
export const getDefaultInventoryForm = () => ({
  date: new Date().toISOString().slice(0, 16),
  name: '',
  type: 'masuk' as const,
  quantity: '',
  notes: '',
})

export const getDefaultNewItemForm = () => ({
  itemName: '',
  description: '',
})

export const getDefaultCheckboxStates = () => ({
  statusMasuk: false,
  statusKeluar: false,
})

export const getDefaultModalStates = () => ({
  showNewItemModal: false,
  showStockWarning: false,
  showForm: false,
})

export const getDefaultErrorStates = () => ({
  errors: {} as Record<string, string>,
  isSubmitting: false,
  isLoading: false,
  error: null as string | null,
})

// Reset functions untuk form cleanup
export const resetInventoryForm = () => getDefaultInventoryForm()
export const resetNewItemForm = () => getDefaultNewItemForm()
export const resetAllStates = () => ({
  ...getDefaultInventoryForm(),
  ...getDefaultNewItemForm(),
  ...getDefaultCheckboxStates(),
  ...getDefaultModalStates(),
  ...getDefaultErrorStates(),
  maxStock: 0,
  pendingNewItem: null,
})