# 📋 Operations Default States

Centralized default states untuk semua form dan halaman operations.

## 📁 Structure

```
lib/constants/operations/
├── index.ts                 # Central exports
├── default-states.ts        # Default state constants
└── README.md               # Dokumentasi ini
```

## 🎯 Recommended Placement Strategy

### 1. **Constants** (`lib/constants/operations/`)
- ✅ **Default form values**
- ✅ **Initial state objects**
- ✅ **Reset functions**
- ✅ **Static configuration**

### 2. **Hooks** (`lib/hooks/operations/`)
- ✅ **Form state management**
- ✅ **Custom state logic**
- ✅ **Reusable state patterns**

### 3. **Store** (`lib/store/operations-store.ts`)
- ✅ **Global state management**
- ✅ **Persistent state**
- ✅ **Cross-component state**

### 4. **Component Level**
- ✅ **Component-specific state**
- ✅ **Temporary UI state**
- ✅ **Local form state**

## 📝 Usage Examples

### Using Constants
```typescript
import { getDefaultInventoryForm, resetAllStates } from '@/lib/constants/operations'

// Initialize form
const [formData, setFormData] = useState(getDefaultInventoryForm())

// Reset form
const handleReset = () => {
  setFormData(getDefaultInventoryForm())
}
```

### Using Custom Hooks
```typescript
import { useInventoryFormState } from '@/lib/hooks/operations'

function InventoryForm() {
  const {
    formData,
    checkboxStates,
    modalStates,
    updateFormData,
    resetForm
  } = useInventoryFormState()
  
  // Use the state...
}
```

### Using Store
```typescript
import { useOperationsStore } from '@/lib/store/operations-store'

function SomeComponent() {
  const {
    inventoryForm,
    updateInventoryForm,
    resetInventoryForm
  } = useOperationsStore()
  
  // Use global state...
}
```

## 🎨 Benefits

### **Centralized Management**
- ✅ Single source of truth untuk default values
- ✅ Consistent initial states across components
- ✅ Easy to update default values globally

### **Type Safety**
- ✅ TypeScript support untuk semua states
- ✅ Compile-time validation
- ✅ IntelliSense support

### **Maintainability**
- ✅ Clear separation of concerns
- ✅ Easy to find and update defaults
- ✅ Reusable across components

### **Performance**
- ✅ Optimized state updates
- ✅ Minimal re-renders
- ✅ Efficient memory usage

## 🔧 Best Practices

### **When to Use Constants**
- Static default values
- Form initial states
- Configuration objects
- Reset functions

### **When to Use Hooks**
- Component-specific state logic
- Reusable state patterns
- Complex state interactions
- Local state management

### **When to Use Store**
- Global application state
- Cross-component communication
- Persistent state
- Complex state relationships

### **When to Use Component State**
- Temporary UI state
- Component-specific interactions
- Simple local state
- Performance-critical updates

## 📱 Mobile Considerations

- ✅ **Auto-focus states** untuk mobile keyboard
- ✅ **Touch-friendly defaults** untuk UI elements
- ✅ **Responsive state management**
- ✅ **Performance optimized** untuk mobile devices

## 🔄 Migration Guide

### From Component State to Constants
```typescript
// Before
const [formData, setFormData] = useState({
  date: new Date().toISOString().slice(0, 16),
  name: '',
  type: 'masuk',
  quantity: '',
  notes: '',
})

// After
import { getDefaultInventoryForm } from '@/lib/constants/operations'
const [formData, setFormData] = useState(getDefaultInventoryForm())
```

### From Multiple States to Hook
```typescript
// Before
const [formData, setFormData] = useState(...)
const [errors, setErrors] = useState({})
const [isSubmitting, setIsSubmitting] = useState(false)

// After
import { useInventoryFormState } from '@/lib/hooks/operations'
const { formData, errorStates, updateFormData, resetForm } = useInventoryFormState()
```