# State Management Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2025-11-17

---

## Overview

This specification defines how the frontend manages VSME report state using:
1. **Zustand** for reactive state management
2. **Zustand Persist** for LocalStorage persistence
3. **Auto-save** with onBlur + debounced onChange (900ms)
4. **Real-time validation** during input

---

## 1. Store Structure

### Complete State Shape

```typescript
interface VsmeReportState {
  // Report Data (from data model)
  reportData: {
    reportMetadata: {
      reportDate: string
      reportVersion: string
      basisForPreparation: 'Basic Module Only' | 'Basic & Comprehensive'
      language: 'en' | 'de'
    }
    basicModules: Record<string, ModuleData>  // Key: moduleCode (B1, B3, etc.)
    comprehensiveModules: Record<string, ModuleData>  // Key: moduleCode (C1, C3, etc.)
  }
  
  // UI State
  wizard: {
    currentStep: number
    totalSteps: number
    completedSteps: Set<number>
    validationErrors: Record<string, string[]>  // Key: datapointId
  }
  
  // Auto-save State
  autoSave: {
    lastSaved: Date | null
    isDirty: boolean
    isSaving: boolean
  }
  
  // Actions
  updateDatapoint: (moduleCode: string, datapointId: string, value: any) => void
  updateTableDatapoint: (moduleCode: string, datapointId: string, items: any[]) => void
  setValidationError: (datapointId: string, error: string | null) => void
  goToStep: (step: number) => void
  markStepComplete: (step: number) => void
  resetStore: () => void
}
```

### Module Data Structure
```typescript
interface ModuleData {
  moduleCode: string  // e.g., "B1", "B3"
  datapoints: Record<string, DatapointValue>  // Key: datapointId
  lastModified: Date
  isValid: boolean
}

interface DatapointValue {
  value: any
  isValid: boolean
  error: string | null
  lastModified: Date
}
```

---

## 2. Zustand Store Implementation

### Store Creation

```typescript
// frontend/src/stores/vsme-report-store.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export const useVsmeReportStore = create<VsmeReportState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      reportData: {
        reportMetadata: {
          reportDate: new Date().toISOString(),
          reportVersion: '1.0.0',
          basisForPreparation: 'Basic Module Only',
          language: 'de'
        },
        basicModules: initializeBasicModules(),
        comprehensiveModules: {}
      },
      
      wizard: {
        currentStep: 1,
        totalSteps: 6,
        completedSteps: new Set(),
        validationErrors: {}
      },
      
      autoSave: {
        lastSaved: null,
        isDirty: false,
        isSaving: false
      },
      
      // Actions
      updateDatapoint: (moduleCode, datapointId, value) => {
        set((state) => {
          const isBasic = moduleCode.startsWith('B')
          const modules = isBasic ? state.reportData.basicModules : state.reportData.comprehensiveModules
          
          if (!modules[moduleCode]) {
            modules[moduleCode] = {
              moduleCode,
              datapoints: {},
              lastModified: new Date(),
              isValid: false
            }
          }
          
          modules[moduleCode].datapoints[datapointId] = {
            value,
            isValid: true,  // Will be validated separately
            error: null,
            lastModified: new Date()
          }
          
          modules[moduleCode].lastModified = new Date()
          state.autoSave.isDirty = true
          state.autoSave.lastSaved = new Date()
        })
      },
      
      updateTableDatapoint: (moduleCode, datapointId, items) => {
        set((state) => {
          const isBasic = moduleCode.startsWith('B')
          const modules = isBasic ? state.reportData.basicModules : state.reportData.comprehensiveModules
          
          if (!modules[moduleCode]) {
            modules[moduleCode] = {
              moduleCode,
              datapoints: {},
              lastModified: new Date(),
              isValid: false
            }
          }
          
          modules[moduleCode].datapoints[datapointId] = {
            value: items,  // Array of objects
            isValid: true,
            error: null,
            lastModified: new Date()
          }
          
          state.autoSave.isDirty = true
          state.autoSave.lastSaved = new Date()
        })
      },
      
      setValidationError: (datapointId, error) => {
        set((state) => {
          if (error) {
            if (!state.wizard.validationErrors[datapointId]) {
              state.wizard.validationErrors[datapointId] = []
            }
            state.wizard.validationErrors[datapointId].push(error)
          } else {
            delete state.wizard.validationErrors[datapointId]
          }
        })
      },
      
      goToStep: (step) => {
        set((state) => {
          if (step >= 1 && step <= state.wizard.totalSteps) {
            state.wizard.currentStep = step
          }
        })
      },
      
      markStepComplete: (step) => {
        set((state) => {
          state.wizard.completedSteps.add(step)
        })
      },
      
      resetStore: () => {
        set({
          reportData: {
            reportMetadata: {
              reportDate: new Date().toISOString(),
              reportVersion: '1.0.0',
              basisForPreparation: 'Basic Module Only',
              language: 'de'
            },
            basicModules: initializeBasicModules(),
            comprehensiveModules: {}
          },
          wizard: {
            currentStep: 1,
            totalSteps: 6,
            completedSteps: new Set(),
            validationErrors: {}
          },
          autoSave: {
            lastSaved: null,
            isDirty: false,
            isSaving: false
          }
        })
      }
    })),
    {
      name: 'vsme-report-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        reportData: state.reportData,
        wizard: {
          currentStep: state.wizard.currentStep,
          completedSteps: Array.from(state.wizard.completedSteps)  // Set → Array for JSON
        }
      })
    }
  )
)

// Helper: Initialize all basic modules with empty state
function initializeBasicModules(): Record<string, ModuleData> {
  const basicModuleCodes = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11']
  
  return basicModuleCodes.reduce((acc, code) => {
    acc[code] = {
      moduleCode: code,
      datapoints: {},
      lastModified: new Date(),
      isValid: false
    }
    return acc
  }, {} as Record<string, ModuleData>)
}
```

---

## 3. Auto-Save Strategy

### Timing Rules

1. **onBlur**: Immediate save + validation when user leaves field
2. **onChange**: Debounced save (900ms) during typing
3. **No Loading Spinners**: Silent background save

### Implementation

```typescript
// frontend/src/hooks/useAutoSave.ts

import { useCallback, useEffect, useRef } from 'react'
import { useVsmeReportStore } from '@/stores/vsme-report-store'
import { debounce } from 'lodash'

export function useAutoSave(
  moduleCode: string,
  datapointId: string,
  validationSchema: ZodSchema
) {
  const updateDatapoint = useVsmeReportStore((state) => state.updateDatapoint)
  const setValidationError = useVsmeReportStore((state) => state.setValidationError)
  
  // Debounced save for onChange (900ms)
  const debouncedSave = useRef(
    debounce((value: any) => {
      updateDatapoint(moduleCode, datapointId, value)
    }, 900)
  ).current
  
  // Immediate save + validation for onBlur
  const saveOnBlur = useCallback(async (value: any) => {
    // Validate first
    const result = await validationSchema.safeParseAsync(value)
    
    if (!result.success) {
      const error = result.error.errors[0]?.message
      setValidationError(datapointId, error)
    } else {
      setValidationError(datapointId, null)
    }
    
    // Save regardless of validation (keep invalid data too)
    updateDatapoint(moduleCode, datapointId, value)
  }, [moduleCode, datapointId, validationSchema, updateDatapoint, setValidationError])
  
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])
  
  return {
    saveOnChange: debouncedSave,
    saveOnBlur
  }
}
```

### Usage in Form Component

```typescript
// Example: InputWithInfo component

import { useAutoSave } from '@/hooks/useAutoSave'
import { z } from 'zod'

interface InputWithInfoProps {
  moduleCode: string
  datapointId: string
  label: string
  validationSchema: z.ZodSchema
}

export function InputWithInfo({ 
  moduleCode, 
  datapointId, 
  label, 
  validationSchema 
}: InputWithInfoProps) {
  const value = useVsmeReportStore(
    (state) => state.reportData.basicModules[moduleCode]?.datapoints[datapointId]?.value || ''
  )
  
  const error = useVsmeReportStore(
    (state) => state.wizard.validationErrors[datapointId]?.[0]
  )
  
  const { saveOnChange, saveOnBlur } = useAutoSave(moduleCode, datapointId, validationSchema)
  
  return (
    <div>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => {
          // Update local state immediately (optimistic UI)
          saveOnChange(e.target.value)
        }}
        onBlur={(e) => {
          // Validate and save
          saveOnBlur(e.target.value)
        }}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
```

---

## 4. LocalStorage Persistence

### What Gets Persisted

✅ **Saved to LocalStorage:**
- All report data (reportData)
- Current wizard step
- Completed steps

❌ **Not Persisted:**
- Validation errors (recalculated on load)
- Auto-save metadata (lastSaved, isDirty)
- UI-only state

### Hydration on Page Load

```typescript
// frontend/src/App.tsx

import { useEffect } from 'react'
import { useVsmeReportStore } from '@/stores/vsme-report-store'

export function App() {
  const hasHydrated = useVsmeReportStore((state) => state._hasHydrated)
  
  useEffect(() => {
    // Zustand persist automatically hydrates from LocalStorage
    // We just need to wait for it
    if (hasHydrated) {
      console.log('✅ State hydrated from LocalStorage')
    }
  }, [hasHydrated])
  
  if (!hasHydrated) {
    return <div>Loading...</div>
  }
  
  return <Wizard />
}
```

### Clear Storage (User Action)

```typescript
// Clear all report data
const resetStore = useVsmeReportStore((state) => state.resetStore)

function handleClearReport() {
  if (confirm('Alle Daten löschen?')) {
    resetStore()
    localStorage.removeItem('vsme-report-state')
  }
}
```

---

## 5. Validation During Input

### Real-Time Validation

```typescript
// Validate while typing (debounced)
const debouncedValidate = useRef(
  debounce(async (value: any, schema: ZodSchema) => {
    const result = await schema.safeParseAsync(value)
    if (!result.success) {
      // Show error, but don't block typing
      setValidationError(datapointId, result.error.errors[0]?.message)
    } else {
      setValidationError(datapointId, null)
    }
  }, 500)  // Faster than save (900ms) for immediate feedback
).current

onChange={(e) => {
  const value = e.target.value
  saveOnChange(value)         // Debounced save (900ms)
  debouncedValidate(value, schema)  // Debounced validation (500ms)
}}
```

### Module-Level Validation (on Next)

```typescript
// frontend/src/hooks/useModuleValidation.ts

export function useModuleValidation(moduleCode: string) {
  const moduleData = useVsmeReportStore(
    (state) => state.reportData.basicModules[moduleCode]
  )
  
  const validateModule = async () => {
    const errors: string[] = []
    
    // Get module schema (generated from data model)
    const schema = getModuleSchema(moduleCode)
    
    // Validate all datapoints
    const result = await schema.safeParseAsync(moduleData.datapoints)
    
    if (!result.success) {
      result.error.errors.forEach((err) => {
        errors.push(`${err.path.join('.')}: ${err.message}`)
      })
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  return { validateModule }
}
```

---

## 6. Stepper State Management

### Navigation Between Steps

```typescript
const wizard = useVsmeReportStore((state) => state.wizard)
const goToStep = useVsmeReportStore((state) => state.goToStep)
const markStepComplete = useVsmeReportStore((state) => state.markStepComplete)

// Next button handler
async function handleNext() {
  const { isValid, errors } = await validateModule(currentModuleCode)
  
  if (!isValid) {
    // Show errors, block navigation
    showValidationErrors(errors)
    return
  }
  
  // Mark current step as complete
  markStepComplete(wizard.currentStep)
  
  // Go to next step
  goToStep(wizard.currentStep + 1)
}

// Back button handler (no validation)
function handleBack() {
  goToStep(wizard.currentStep - 1)
}

// Direct step navigation
function handleGoToStep(step: number) {
  // Only allow if step is completed or adjacent
  if (wizard.completedSteps.has(step) || Math.abs(step - wizard.currentStep) === 1) {
    goToStep(step)
  }
}
```

---

## 7. Performance Optimization

### Selectors

Use granular selectors to avoid unnecessary re-renders:

```typescript
// ❌ Bad: Re-renders on any state change
const state = useVsmeReportStore()

// ✅ Good: Only re-renders when this specific value changes
const entityName = useVsmeReportStore(
  (state) => state.reportData.basicModules.B1?.datapoints.entityName?.value
)
```

### Computed Values

```typescript
// Memoized selector for form dirty state
const isFormDirty = useVsmeReportStore(
  (state) => state.autoSave.isDirty
)

// Memoized selector for validation status
const hasValidationErrors = useVsmeReportStore(
  (state) => Object.keys(state.wizard.validationErrors).length > 0
)
```

---

## 8. Testing Strategy

### Unit Tests

```typescript
describe('VsmeReportStore', () => {
  test('should update datapoint and mark as dirty', () => {
    const { result } = renderHook(() => useVsmeReportStore())
    
    act(() => {
      result.current.updateDatapoint('B1', 'entityName', 'Test GmbH')
    })
    
    expect(result.current.reportData.basicModules.B1.datapoints.entityName.value).toBe('Test GmbH')
    expect(result.current.autoSave.isDirty).toBe(true)
  })
  
  test('should persist to localStorage', () => {
    const { result } = renderHook(() => useVsmeReportStore())
    
    act(() => {
      result.current.updateDatapoint('B1', 'entityName', 'Test GmbH')
    })
    
    const stored = JSON.parse(localStorage.getItem('vsme-report-state')!)
    expect(stored.state.reportData.basicModules.B1.datapoints.entityName.value).toBe('Test GmbH')
  })
})
```

---

## 9. Implementation Checklist

- [ ] Create Zustand store with persist middleware
- [ ] Implement updateDatapoint action
- [ ] Implement updateTableDatapoint action
- [ ] Create useAutoSave hook
- [ ] Implement debounced onChange (900ms)
- [ ] Implement immediate onBlur with validation
- [ ] Add real-time validation (500ms debounce)
- [ ] Implement stepper navigation
- [ ] Add module-level validation
- [ ] Test LocalStorage persistence
- [ ] Test hydration on page reload
- [ ] Add unit tests
- [ ] Performance test with large forms

---

**Next Steps**: Implement store, test auto-save, verify LocalStorage persistence.

