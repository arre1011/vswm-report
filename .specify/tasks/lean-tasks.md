# Lean VSME Tasks

**Plan**: `vsme-lean-001`  
**Status**: In Progress  
**Total Tasks**: 18 (reduced from 27)

---

## Phase 1: Foundation

### ✅ Task 1: Create Critical Specs
**Status**: Done  
**Time**: 2h  
**Files**:
- `.specify/specs/backend/excel-integration.md`
- `.specify/specs/features/state-management.md`
- `.specify/specs/scripts/code-generation.md`

---

### ☐ Task 2: Implement Zod Schema Generator
**Status**: Todo  
**Time**: 4h  
**Dependencies**: Task 1  
**File**: `scripts/generate-zod-schemas.ts`

---

### ☐ Task 3: Implement i18n Key Extractor
**Status**: Todo  
**Time**: 3h  
**Dependencies**: Task 1  
**File**: `scripts/generate-i18n-keys.ts`

---

### ☐ Task 4: Run Generators
**Status**: Todo  
**Time**: 1h  
**Dependencies**: Tasks 2-3  
**Command**: `npm run generate:all`

---

## Phase 2: Frontend State & Forms

### ☐ Task 5: Implement Zustand Store
**Status**: Todo  
**Time**: 4h  
**Dependencies**: Task 4  
**File**: `frontend/src/stores/vsme-report-store.ts`

---

### ☐ Task 6: Implement Auto-Save Hook
**Status**: Todo  
**Time**: 2h  
**Dependencies**: Task 5  
**File**: `frontend/src/hooks/useAutoSave.ts`

---

### ☐ Task 7: Enhance Form Components
**Status**: Todo  
**Time**: 3h  
**Dependencies**: Task 6  
**Files**: Existing form components in `components/ui/`

---

### ☐ Task 8: Setup i18next
**Status**: Todo  
**Time**: 2h  
**Dependencies**: Task 4  
**File**: `frontend/src/i18n/config.ts`

---

### ☐ Task 9: Setup TanStack Query
**Status**: Todo  
**Time**: 2h  
**Dependencies**: Task 5  
**Files**: `lib/query-client.ts`, `services/export-service.ts`

---

## Phase 3: Backend Excel Generation

### ☐ Task 10: Setup Backend Structure
**Status**: Todo  
**Time**: 1h  
**Dependencies**: Task 1  
**Action**: Create hexagonal folder structure

---

### ☐ Task 11: Implement Template Loader
**Status**: Todo  
**Time**: 3h  
**Dependencies**: Task 10  
**File**: `adapter/outbound/excel/ExcelTemplateConfig.kt`

---

### ☐ Task 12: Implement Named Range Mapping Loader
**Status**: Todo  
**Time**: 4h  
**Dependencies**: Task 11  
**File**: `adapter/outbound/excel/NamedRangeMappingLoader.kt`

---

### ☐ Task 13: Implement Datapoint Writer
**Status**: Todo  
**Time**: 4h  
**Dependencies**: Task 12  
**File**: `adapter/outbound/excel/DatapointWriter.kt`

---

### ☐ Task 14: Implement Table Datapoint Writer
**Status**: Todo  
**Time**: 4h  
**Dependencies**: Task 13  
**File**: `adapter/outbound/excel/TableDatapointWriter.kt`

---

### ☐ Task 15: Implement Excel Generation Service
**Status**: Todo  
**Time**: 3h  
**Dependencies**: Tasks 13-14  
**File**: `application/ExcelGenerationService.kt`

---

### ☐ Task 16: Implement REST Controller
**Status**: Todo  
**Time**: 2h  
**Dependencies**: Task 15  
**File**: `adapter/inbound/rest/VsmeExportController.kt`

---

## Phase 4: Integration & Testing

### ☐ Task 17: Implement B1 Module Forms
**Status**: Todo  
**Time**: 6h  
**Dependencies**: Tasks 5-9  
**File**: `frontend/src/domains/report/components/B1Form.tsx`

---

### ☐ Task 18: End-to-End Test
**Status**: Todo  
**Time**: 4h  
**Dependencies**: Tasks 16-17  
**Test**: Complete user flow from form to Excel download

---

## Progress Summary

- **Total Tasks**: 18
- **Completed**: 1
- **In Progress**: 0
- **Todo**: 17
- **Blocked**: 0

**Progress**: 5.6%

**Estimated Total Time**: 52 hours (~7 days full-time, 13-17 days part-time)

---

## Current Focus

**Current Task**: Task 2 - Implement Zod Schema Generator

**Blockers**: None

**Notes**: 
- Phase 1 must complete before Phase 2
- Generators (Tasks 2-4) are critical for rest of implementation
- Each task = one commit

---

**Last Updated**: 2025-11-17

