# Lean VSME Implementation Plan

**Plan ID**: `vsme-lean-001`  
**Status**: In Progress  
**Created**: 2025-11-17  
**Objective**: Implement VSME Easy Report with focus on critical features

---

## Overview

This lean plan focuses on implementing only what's necessary to get a working VSME report generator. We skip over-specification and go straight to implementation where things are clear.

**Philosophy**: Spec only what's complex or unclear. Everything else: just code it.

---

## Phase 1: Foundation (3 Specs + Scripts)

### ✅ Task 1: Create Critical Specs (DONE)
**What**: 3 detailed specs for complex parts
- ✅ Backend Excel Integration (`backend/excel-integration.md`)
- ✅ State Management (`features/state-management.md`)
- ✅ Code Generation (`scripts/code-generation.md`)

**Commit**: `docs(spec): add 3 critical specifications for complex features`

---

### Task 2: Implement Zod Schema Generator
**What**: Script that generates validation schemas from data model

**Input**: `docs/data-model/vsme-data-model-spec.json`  
**Output**: `frontend/src/domains/report/schemas/{module}-schema.ts`

**Steps**:
1. Create `scripts/generate-zod-schemas.ts`
2. Implement data type mapping (text → z.string(), number → z.number(), etc.)
3. Handle table datapoints with item schemas
4. Generate for all modules (B1-B11, C1-C9)
5. Add npm script: `npm run generate:schemas`

**Acceptance**:
- [ ] Script runs without errors
- [ ] Generates valid TypeScript
- [ ] B1 schema includes all datapoints
- [ ] Table datapoints have item schemas

**Commit**: `feat(scripts): add Zod schema generator from data model`

---

### Task 3: Implement i18n Key Extractor
**What**: Script that extracts translation keys from data model

**Input**: `docs/data-model/vsme-data-model-spec.json`  
**Output**: `frontend/src/i18n/{lang}/modules/{module}.json`

**Steps**:
1. Create `scripts/generate-i18n-keys.ts`
2. Extract labels for de/en
3. Extract option labels for selects
4. Generate validation messages
5. Add npm script: `npm run generate:i18n`

**Acceptance**:
- [ ] Script generates de/en JSON files
- [ ] All module labels extracted
- [ ] Validation messages included
- [ ] JSON is valid

**Commit**: `feat(scripts): add i18n key extraction from data model`

---

### Task 4: Run Generators
**What**: Execute scripts to generate schemas and translations

**Steps**:
1. `npm run generate:schemas`
2. `npm run generate:i18n`
3. Verify generated files
4. Fix any errors

**Acceptance**:
- [ ] All schemas generated
- [ ] All i18n files generated
- [ ] No TypeScript errors
- [ ] Files committed

**Commit**: `chore: generate Zod schemas and i18n keys from data model`

---

## Phase 2: Frontend State & Forms

### Task 5: Implement Zustand Store
**What**: State management with persist

**File**: `frontend/src/stores/vsme-report-store.ts`

**Implementation** (follow spec):
1. Create store with immer middleware
2. Add persist middleware for LocalStorage
3. Implement actions:
   - `updateDatapoint(moduleCode, datapointId, value)`
   - `updateTableDatapoint(moduleCode, datapointId, items)`
   - `goToStep(step)`
   - `markStepComplete(step)`
4. Test persistence

**Acceptance**:
- [ ] Store compiles
- [ ] Persist works (test in browser)
- [ ] State hydrates on reload
- [ ] Actions work correctly

**Commit**: `feat(frontend): implement Zustand store with persist middleware`

---

### Task 6: Implement Auto-Save Hook
**What**: Hook for onBlur + debounced onChange

**File**: `frontend/src/hooks/useAutoSave.ts`

**Implementation** (follow spec):
1. Create `useAutoSave` hook
2. Debounced save on onChange (900ms)
3. Immediate save + validation on onBlur
4. Integrate with store

**Acceptance**:
- [ ] Hook compiles
- [ ] Debounce works (900ms delay)
- [ ] onBlur saves immediately
- [ ] Validation runs on blur

**Commit**: `feat(frontend): add auto-save hook with onBlur and debounced onChange`

---

### Task 7: Enhance Form Components
**What**: Add auto-save to existing components

**Files**:
- `frontend/src/components/ui/input-with-info.tsx`
- `frontend/src/components/ui/select-with-info.tsx`
- `frontend/src/components/ui/date-picker-with-info.tsx`

**Implementation**:
1. Import `useAutoSave` hook
2. Add onChange → `saveOnChange(value)`
3. Add onBlur → `saveOnBlur(value)`
4. Connect to store for value
5. Display validation errors

**Acceptance**:
- [ ] Components compile
- [ ] Auto-save works (test in browser)
- [ ] Validation errors show
- [ ] Values persist to LocalStorage

**Commit**: `feat(frontend): enhance form components with auto-save functionality`

---

### Task 8: Setup i18next
**What**: Configure internationalization

**Files**:
- `frontend/src/i18n/config.ts`
- Generated JSON files from Task 3

**Implementation**:
1. Initialize i18next
2. Configure de/en
3. Set default language: de
4. Add language switcher
5. Test translations

**Acceptance**:
- [ ] i18next initialized
- [ ] German loads by default
- [ ] Translations work
- [ ] Language switching works

**Commit**: `feat(frontend): setup i18next with de/en language support`

---

### Task 9: Setup TanStack Query
**What**: Configure API client

**Files**:
- `frontend/src/lib/query-client.ts`
- `frontend/src/services/export-service.ts`

**Implementation**:
1. Create QueryClient
2. Create `useExportReport` mutation
3. Handle success (download file)
4. Handle errors

**Acceptance**:
- [ ] QueryClient configured
- [ ] Mutation works
- [ ] Error handling works
- [ ] File download works

**Commit**: `feat(frontend): setup TanStack Query for API integration`

---

## Phase 3: Backend Excel Generation

### Task 10: Setup Backend Structure
**What**: Create hexagonal architecture folders

**Structure**:
```
backend/src/main/kotlin/org/example/backend/
├── domain/
│   ├── model/
│   ├── ports/inbound/
│   └── ports/outbound/
├── adapter/
│   ├── inbound/rest/
│   └── outbound/excel/
└── application/
```

**Acceptance**:
- [ ] Folders created
- [ ] Structure follows spec

**Commit**: `feat(backend): setup hexagonal architecture structure`

---

### Task 11: Implement Template Loader
**What**: Load Excel template as singleton

**File**: `adapter/outbound/excel/ExcelTemplateConfig.kt`

**Implementation** (follow spec):
1. Create `@Configuration` class
2. Load `VSME-Digital-Template-1.1.0.xlsx`
3. Return `Workbook` bean with `@Singleton`
4. Test at startup

**Acceptance**:
- [ ] Template loads at startup
- [ ] Bean is singleton
- [ ] No errors in logs

**Commit**: `feat(backend): implement Excel template loader as singleton`

---

### Task 12: Implement Named Range Mapping Loader
**What**: Load mapping from data model

**File**: `adapter/outbound/excel/NamedRangeMappingLoader.kt`

**Implementation** (follow spec):
1. Create `@Component`
2. Load `vsme-data-model-spec.json`
3. Parse to mapping config
4. Store in ConcurrentHashMap
5. Provide `getMapping(datapointId)` method

**Acceptance**:
- [ ] Mappings load at startup
- [ ] All 797 ranges mapped
- [ ] Fast lookup (HashMap)

**Commit**: `feat(backend): implement Named Range mapping loader`

---

### Task 13: Implement Datapoint Writer
**What**: Write values to Named Ranges

**File**: `adapter/outbound/excel/DatapointWriter.kt`

**Implementation** (follow spec):
1. Create service
2. Implement `writeDatapoint(workbook, datapointId, value)`
3. Resolve Named Range to cell
4. Write value based on dataType
5. Handle all types (text, number, date, boolean, select)

**Acceptance**:
- [ ] Simple datapoints write correctly
- [ ] All data types supported
- [ ] Named Ranges resolve correctly

**Commit**: `feat(backend): implement datapoint writer with Named Range resolution`

---

### Task 14: Implement Table Datapoint Writer
**What**: Handle repeating data (arrays)

**File**: `adapter/outbound/excel/TableDatapointWriter.kt`

**Implementation** (follow spec):
1. Load repeating data patterns
2. Implement `writeTableDatapoint(workbook, datapointId, items)`
3. Iterate rows (startRow + index)
4. Write columns
5. Validate maxRows

**Acceptance**:
- [ ] Arrays write to multiple rows
- [ ] Columns map correctly
- [ ] maxRows validation works

**Commit**: `feat(backend): implement table datapoint writer for repeating data`

---

### Task 15: Implement Excel Generation Service
**What**: Orchestrate everything

**File**: `application/ExcelGenerationService.kt`

**Implementation**:
1. Clone template per request
2. Write all modules
3. Write all datapoints (simple + table)
4. Convert to ByteArray
5. Encode to Base64
6. Return response

**Acceptance**:
- [ ] Complete flow works
- [ ] Excel generates correctly
- [ ] Base64 encoding works

**Commit**: `feat(backend): implement Excel generation service`

---

### Task 16: Implement REST Controller
**What**: API endpoint

**File**: `adapter/inbound/rest/VsmeExportController.kt`

**Implementation**:
1. Create `@RestController`
2. POST `/api/vsme/export`
3. Accept `ExcelExportRequest`
4. Call service
5. Return `ExcelExportResponse`

**Acceptance**:
- [ ] Endpoint responds
- [ ] Request/Response DTOs work
- [ ] CORS configured

**Commit**: `feat(backend): implement REST controller for Excel export`

---

## Phase 4: Integration & Testing

### Task 17: Implement B1 Module Forms
**What**: Complete B1 forms with generated schemas

**Files**:
- `frontend/src/domains/report/components/B1Form.tsx`

**Implementation**:
1. Use generated b1-schema
2. Use React Hook Form
3. Use auto-save hook
4. Use i18n translations
5. Test all fields

**Acceptance**:
- [ ] All B1 fields rendered
- [ ] Validation works
- [ ] Auto-save works
- [ ] i18n works

**Commit**: `feat(frontend): implement B1 Basis for Preparation forms`

---

### Task 18: End-to-End Test
**What**: Complete flow test

**Test**:
1. Open app
2. Fill B1 form
3. Data saves to LocalStorage
4. Reload page → data persists
5. Click Export
6. Excel downloads
7. Open Excel → validate B1 data written

**Acceptance**:
- [ ] Complete flow works
- [ ] Excel is valid
- [ ] Data matches input

**Commit**: `test: add end-to-end test for B1 module`

---

## Timeline

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| Phase 1: Foundation | 1-4 | 2-3 days |
| Phase 2: Frontend | 5-9 | 4-5 days |
| Phase 3: Backend | 10-16 | 5-6 days |
| Phase 4: Integration | 17-18 | 2-3 days |
| **Total** | **18 tasks** | **13-17 days** |

---

## Success Criteria

- [ ] All 3 specs created ✅
- [ ] Zod schemas generated
- [ ] i18n keys extracted
- [ ] Zustand store with persist works
- [ ] Auto-save works (onBlur + debounced)
- [ ] Excel template loads as singleton
- [ ] Named Range mapping works
- [ ] Excel generation works
- [ ] B1 module fully functional
- [ ] End-to-end test passes

---

## Next Steps

1. **Now**: Commit this plan
2. **Task 2**: Start implementing Zod generator
3. **One task at a time**: Focus, implement, test, commit
4. **Review after Phase 1**: Ensure scripts work before moving forward

---

**Plan Owner**: Development Team  
**Last Updated**: 2025-11-17

