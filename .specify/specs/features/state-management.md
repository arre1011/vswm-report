# State Management Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2025-11-17  
**Type**: Requirements Specification

---

## Overview

This specification defines the **requirements** for frontend state management in VSME Easy Report. It describes **WHAT** state must be managed and **HOW** it should behave from a user perspective, not implementation details.

---

## 1. Requirements

### R1: Report Data Persistence
**What**: All user-entered report data must survive browser sessions.

**Why**: Users may take days/weeks to complete a VSME report. Data loss would be catastrophic for user trust.

**Functional Requirements**:
- All form inputs persist to browser storage
- Data survives page reload (F5, Ctrl+R)
- Data survives browser close/reopen
- Data survives tab close/reopen
- Clear/Reset function to start fresh

**Storage Constraints**:
- Maximum 5 MB total data size
- Use browser LocalStorage (not SessionStorage)
- Store as JSON format
- Include timestamp of last save

**Data to Persist**:
- All module data (basicModules, comprehensiveModules)
- All datapoint values
- Wizard progress (current step, completed steps)
- Report metadata (entity name, reporting period, etc.)

**Data NOT to Persist**:
- UI state (modals open/closed, tooltips)
- Validation errors (recalculated on load)
- Temporary input values (before blur)

**Acceptance Criteria**:
- [ ] Enter data in B1 module → Reload page → Data still there
- [ ] Fill 5 modules → Close browser → Reopen → All data present
- [ ] LocalStorage key is unique per browser (no conflicts)
- [ ] Storage size < 5 MB even with all modules filled
- [ ] Clear button removes all persisted data
- [ ] Timestamp shows when data was last modified

---

### R2: Auto-Save Behavior
**What**: Form inputs automatically save without explicit user action.

**Why**: Reduce cognitive load (no "Save" button), prevent accidental data loss, modern UX expectation.

**Timing Requirements**:

| Trigger | Timing | Behavior |
|---------|--------|----------|
| **onBlur** | Immediate | Save when field loses focus + validate |
| **onChange** | Debounced 900ms | Save while typing (after pause) |
| **Wizard Step Change** | Immediate | Save current step before navigation |

**User Feedback**:
- **Auto-save**: Silent (no loading spinner, no "Saved!" message)
- **Validation Error**: Show immediately on blur
- **Network Error**: N/A (LocalStorage only, no network)

**Edge Cases**:
- **Rapid typing**: Only save after 900ms pause (debounce)
- **Field to field**: onBlur saves each field individually
- **Multiple tabs**: Last save wins (no conflict resolution needed)

**Acceptance Criteria**:
- [ ] Type in field → Wait 900ms → Data saved to LocalStorage
- [ ] Type in field → Tab to next field (blur) → Data saved immediately
- [ ] Type fast without pause → Only 1 save after 900ms pause
- [ ] Navigate to next step → Current step data saved
- [ ] No visible "Saving..." indicators (silent save)
- [ ] Validation runs on blur (before save)
- [ ] Invalid data does NOT save (validation blocks save)

---

### R3: Wizard State Management
**What**: Track user's progress through the wizard steps.

**Why**: Allow jumping between steps, show completion status, prevent navigation to invalid steps.

**Wizard State Data**:
- **currentStep**: number (0-based index)
- **completedSteps**: array of step numbers
- **visitedSteps**: array of step numbers
- **totalSteps**: number (constant, based on report mode)

**Navigation Rules**:
| Action | Validation Required? | Allowed When? |
|--------|---------------------|---------------|
| **Next** | ✅ Yes | Current step valid |
| **Back** | ❌ No | Any previous step |
| **Jump to Completed** | ❌ No | Step is in completedSteps |
| **Jump to Incomplete** | ✅ Yes | Current step valid |

**Step Completion Logic**:
- Step becomes "completed" when:
  - User clicks "Next" AND validation passes
  - All required fields in that step have values
  - All validations pass

**Step Visual Indicators**:
- **Current**: Highlighted, editable
- **Completed**: Checkmark, clickable
- **Incomplete**: Number only, not clickable (unless current)
- **Future**: Grayed out, not clickable

**Acceptance Criteria**:
- [ ] Start wizard → currentStep = 0
- [ ] Complete step 0 → Click Next → currentStep = 1, completedSteps = [0]
- [ ] Jump back to step 0 → No validation required
- [ ] Try to jump to step 3 (incomplete) → Blocked (must complete 0,1,2 first)
- [ ] Progress indicator shows 3/10 steps completed
- [ ] Stepper UI reflects completed/incomplete status

---

### R4: Validation State Integration
**What**: Track validation errors per field and per module.

**Why**: Block navigation to next step if current step invalid, show user what needs fixing.

**Validation Triggers**:
- **onBlur**: Validate single field
- **Next button**: Validate entire current step/module
- **onLoad**: Validate all loaded data (show errors if data is incomplete)

**Validation State Data**:
```
validationErrors: {
  "B1": {
    "entityName": ["Required field"],
    "reportingPeriodStart": ["Invalid date format"]
  },
  "B3": {
    "totalEmployees": ["Must be a positive number"]
  }
}
```

**Error Display**:
- Show error message below field (red text)
- Show error icon next to field
- Show error count in step indicator (e.g., "B1 (2 errors)")

**Acceptance Criteria**:
- [ ] Leave required field empty → Blur → Error message appears
- [ ] Fix error → Blur → Error message disappears
- [ ] Click Next with errors → Blocked, errors highlighted
- [ ] Step indicator shows error count
- [ ] Validation errors do NOT persist to LocalStorage

---

### R5: Module Data Structure
**What**: Store all VSME module data in a structured format matching the data model.

**Why**: Align frontend state with data model spec, simplify backend integration.

**Data Structure** (conceptual):
```typescript
{
  reportMetadata: {
    entityName: string
    reportingPeriodStart: string
    reportingPeriodEnd: string
    // ...
  },
  basicModules: [
    {
      moduleCode: "B1",
      disclosures: [
        {
          disclosureId: "B1-1",
          datapoints: [
            { datapointId: "entityName", value: "Test GmbH" },
            { datapointId: "legalForm", value: "GmbH" }
          ]
        }
      ]
    }
  ],
  comprehensiveModules: [
    // Same structure as basicModules
  ]
}
```

**Alignment with Data Model**:
- Structure MUST match `docs/data-model/vsme-data-model-spec.json`
- datapointIds MUST match data model exactly
- Array datapoints MUST be arrays of objects
- Optional fields CAN be null/undefined

**Acceptance Criteria**:
- [ ] State structure matches data model JSON schema
- [ ] Can serialize state to JSON for API call (no transformation needed)
- [ ] Can deserialize data model into state (no transformation needed)
- [ ] Array datapoints are typed correctly (not string)

---

### R6: Report Mode Selection
**What**: User selects Basic or Comprehensive mode, which determines which modules to show.

**Why**: Comprehensive mode has additional modules (C1-C9) that Basic mode doesn't need.

**Mode Options**:
- **Basic**: Only B1-B11 modules
- **Comprehensive**: B1-B11 + C1-C9 modules

**State Data**:
- **reportMode**: "basic" | "comprehensive"
- Set at wizard start (step 0: "Select Mode")
- Can be changed later (resets wizard progress)

**Behavior**:
- Mode selection happens in first step (before module inputs)
- Changing mode shows confirmation dialog: "This will reset your progress. Continue?"
- After mode change: clear comprehensiveModules data (if switching to basic)

**Acceptance Criteria**:
- [ ] Select Basic → Only B1-B11 steps shown
- [ ] Select Comprehensive → B1-B11 + C1-C9 steps shown
- [ ] Switch mode mid-wizard → Confirmation dialog
- [ ] Confirm switch → Progress reset, data cleared (for removed modules)
- [ ] Mode persists in LocalStorage

---

## 2. Technical Constraints

### C1: State Management Library
**Must Use**: Zustand

**Reasoning**:
- Already in project (`package.json`)
- Lightweight (~1 KB)
- Excellent TypeScript support
- Simple API (no boilerplate)
- Good React 18 support

**Must Not Use**:
- Redux (too much boilerplate)
- Context API alone (performance issues with large state)
- Jotai/Recoil (not in project)

### C2: Persistence Strategy
**Must Use**: Zustand Persist Middleware + LocalStorage

**Reasoning**:
- Built-in Zustand feature
- Automatic sync between store and LocalStorage
- No manual serialization needed
- Handles version migrations

**Configuration**:
- Storage key: `vsme-report-state`
- Version: 1 (for future migrations)
- Partialize: Only persist reportData, wizard, reportMode (not UI state)

### C3: Immutability
**Must Use**: Immer middleware

**Reasoning**:
- Simplifies immutable updates
- Prevents accidental mutations
- Reduces bugs
- Better developer experience

**Example Benefit**:
```typescript
// Without Immer (error-prone):
set(state => ({
  ...state,
  basicModules: state.basicModules.map(m => 
    m.moduleCode === 'B1' ? { ...m, datapoints: [...] } : m
  )
}))

// With Immer (simple):
set(draft => {
  draft.basicModules[0].datapoints[0].value = "New Value"
})
```

### C4: Performance
**Constraints**:
- State updates MUST NOT block UI rendering
- Debounce onChange to 900ms (avoid excessive updates)
- LocalStorage writes MUST NOT block UI
- Selectors MUST use shallow equality checks

---

## 3. Architecture Guidance

### Recommended Patterns

#### Pattern 1: Single Store
**Why**: Simpler, all data in one place, easier debugging

**Structure**:
```typescript
interface VsmeReportState {
  // Data
  reportData: { ... }
  
  // Wizard
  wizard: { currentStep, completedSteps, ... }
  
  // Validation
  validationErrors: { ... }
  
  // Actions
  updateDatapoint: (moduleCode, datapointId, value) => void
  goToStep: (step) => void
  validateStep: (step) => boolean
  // ...
}
```

#### Pattern 2: Custom Hooks for Business Logic
**Why**: Separate presentation from business logic

**Examples**:
- `useAutoSave()`: Handles onBlur + debounced onChange
- `useWizardNavigation()`: Handles step navigation + validation
- `useValidation()`: Zod schema validation

#### Pattern 3: Selectors for Performance
**Why**: Avoid unnecessary re-renders

**Example**:
```typescript
// Bad: Component re-renders on ANY state change
const state = useVsmeReportStore()

// Good: Only re-renders when entityName changes
const entityName = useVsmeReportStore(state => state.reportData.basicModules[0]...)
```

### Alternative Approaches (Not Recommended but Allowed)
- Multiple smaller stores (one per module)
  - **Pro**: Better performance isolation
  - **Con**: More complex, harder to maintain
- Context + useReducer instead of Zustand
  - **Pro**: No external dependency
  - **Con**: More boilerplate, worse performance

---

## 4. Integration Points

### I1: Data Model
**Source**: `docs/data-model/vsme-data-model-spec.json`

**What to Extract**:
- Module structure (codes, names)
- Disclosure structure
- Datapoint IDs, types, validations

**When**: At build time (code generation) or runtime (dynamic forms)

### I2: Zod Validation Schemas
**Source**: Auto-generated from data model (Task 4)

**Usage**:
```typescript
import { b1ModuleSchema } from '@/schemas/vsme-zod-schemas'

const validateModule = (data) => b1ModuleSchema.safeParse(data)
```

### I3: Form Components
**Components**: `input-with-info.tsx`, `select-with-info.tsx`, `date-picker-with-info.tsx`

**Required Props**:
- `value`: from Zustand store
- `onChange`: calls store action (debounced)
- `onBlur`: calls store action + validation
- `error`: from validation state

### I4: Backend API (TanStack Query)
**Export Request**:
```typescript
const exportMutation = useMutation({
  mutationFn: (data: VsmeReportState) => 
    fetch('/api/vsme/export', { body: JSON.stringify(data) })
})

// Trigger on "Export" button
exportMutation.mutate(useVsmeReportStore.getState().reportData)
```

**State Usage**: Read entire reportData from store, send to backend

---

## 5. Non-Requirements

**Explicitly NOT part of this specification**:
- ❌ Undo/Redo functionality (future enhancement)
- ❌ Multi-device sync (LocalStorage is per-device)
- ❌ Conflict resolution (only one user per report)
- ❌ Version history or audit log
- ❌ Real-time collaboration (multiple users editing same report)
- ❌ Offline-first sync (no backend sync, only on export)
- ❌ Import from previous report (future enhancement)
- ❌ Auto-save to backend (only LocalStorage, backend only on export)

---

## 6. User Experience Requirements

### UX1: Performance
**Requirements**:
- Form inputs feel instant (no lag)
- Auto-save is silent (no spinners, no notifications)
- Validation feedback appears within 100ms of blur
- Step navigation within 200ms

### UX2: Feedback
**Requirements**:
- **No feedback for auto-save** (silent is best)
- **Clear feedback for validation errors** (red text, icon)
- **Clear feedback for step completion** (checkmark in stepper)
- **Clear feedback for mode switch** (confirmation dialog)

### UX3: Accessibility
**Requirements**:
- Validation errors announced to screen readers
- Focus management on step navigation
- Keyboard navigation works correctly

---

## 7. Testing Requirements

### Unit Tests (Recommended)
- Store actions update state correctly
- Validation runs on blur
- Debounce works (900ms delay)
- LocalStorage persistence works

### Integration Tests (Recommended)
- Fill form → Reload → Data persists
- Navigate steps → Wizard state correct
- Validation blocks navigation

### E2E Tests (Required)
- Complete wizard flow from start to export
- Data persistence across page reload
- Mode switching with data reset

---

## 8. Data Model Reference

**Primary Source**: `docs/data-model/vsme-data-model-spec.json`

**Schema Definitions**: `frontend/src/types/vsme-api-types.ts`

**Zod Schemas**: Generated by Task 4 (Code Generator)

---

## 9. Success Metrics

**Definition of Done**:
- [ ] Enter data in B1 → Reload → Data persists
- [ ] Type in field → Blur → Saves + validates immediately
- [ ] Type fast → Only saves after 900ms pause
- [ ] Complete B1 → Click Next → Navigate to B2 (no errors)
- [ ] Incomplete B1 → Click Next → Blocked (errors shown)
- [ ] Switch mode → Confirmation → Progress reset
- [ ] Export → State serialized correctly for API
- [ ] Performance: No input lag, instant feedback

---

**Implementation Freedom**: Choose store structure, hook patterns, and selector strategies that work best, as long as all requirements are met.

**Questions?** Clarify with team before implementation if any requirement is ambiguous.
