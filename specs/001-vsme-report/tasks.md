# VSME Easy Report - Task List

**Version**: 1.0.0  
**Status**: Active  
**Created**: 2025-11-17  
**Based on**: Implementation Plan v1.0.0

---

## Overview

This task list breaks down the VSME Easy Report implementation into **20 actionable tasks** across **4 phases**. Each task includes:
- **User Story**: Why this task matters
- **Spec Reference**: Link to detailed requirements
- **Acceptance Criteria**: How to verify completion
- **Dependencies**: What must be done first
- **Status**: Progress tracking

**Commit Strategy**: ✅ One task = one commit

---

## Legend

| Status | Meaning |
|--------|---------|
| ❌ Not Started | Task hasn't begun |
| 🟡 In Progress | Currently working on this task |
| ✅ Done | Task completed and committed |
| 🚫 Blocked | Waiting on dependencies |

---

## Phase 1: Foundation & Code Generation

**Goal**: Analyze current implementation, generate schemas/i18n, setup project structure

---

### Task 1: Zod Schema Generator

**Status**: ❌ Not Started

**User Story**:
> As a **frontend developer**  
> I want **validation schemas auto-generated from the VSME data model**  
> So that **I don't manually maintain 797 field validations and they stay in sync with the data model**

**Spec Reference**: [Code Generation Spec](../specs/scripts/code-generation.md)

**Acceptance Criteria**:
- [ ] Script `scripts/generate-zod-schemas.ts` created
- [ ] Reads `docs/data-model/vsme-data-model-spec.json`
- [ ] Generates `frontend/src/schemas/vsme-zod-schemas.ts`
- [ ] All dataTypes mapped correctly:
  - `text` → `z.string()`
  - `number` → `z.coerce.number()`
  - `date` → `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`
  - `boolean` → `z.boolean()`
  - `select` → `z.enum([...])`
  - `url` → `z.string().url()`
  - `email` → `z.string().email()`
- [ ] Validation rules applied (min, max, pattern, required)
- [ ] Array datapoints generate array schemas with maxItems
- [ ] npm script `npm run generate:schemas` works
- [ ] Generated file has no TypeScript errors
- [ ] All 797 datapoints have schemas

**Technical Notes**:
- Input: `docs/data-model/vsme-data-model-spec.json`
- Output: `frontend/src/schemas/vsme-zod-schemas.ts`
- Required field handling: `required: true` → `.min(1, "Required")`
- Optional fields: `required: false` → `.optional()`

**Dependencies**: None

**Time Estimate**: 4-6 hours

---

### Task 2: i18n Key Extraction

**Status**: ❌ Not Started

**User Story**:
> As a **product manager**  
> I want **translation keys automatically extracted from the data model**  
> So that **all labels/descriptions are available in English and German without manual work**

**Spec Reference**: [Code Generation Spec](../specs/scripts/code-generation.md)

**Acceptance Criteria**:
- [ ] Script `scripts/generate-i18n-keys.ts` created
- [ ] Reads `docs/data-model/vsme-data-model-spec.json`
- [ ] Generates `frontend/src/i18n/en/vsme.json` (English)
- [ ] Generates `frontend/src/i18n/de/vsme.json` (German structure, values empty)
- [ ] Module names extracted (B1-B11, C1-C9)
- [ ] Disclosure names extracted
- [ ] Datapoint labels, descriptions, placeholders, helpText extracted
- [ ] Validation messages included
- [ ] Select options translated
- [ ] npm script `npm run generate:i18n` works
- [ ] Can import and use with react-i18next

**Technical Notes**:
- Input: `docs/data-model/vsme-data-model-spec.json`
- Output: 
  - `frontend/src/i18n/en/vsme.json` (English, values filled)
  - `frontend/src/i18n/de/vsme.json` (German, structure only)
- Structure: Nested JSON (`modules.B1.name`, `datapoints.entityName.label`)

**Dependencies**: None

**Time Estimate**: 3-4 hours

---

### Task 3: Frontend Project Structure (DDD)

**Status**: ❌ Not Started

**User Story**:
> As a **frontend developer**  
> I want **a clean Domain-Driven Design folder structure**  
> So that **code is organized, maintainable, and follows the constitution**

**Spec Reference**: [Constitution - Frontend Architecture](../memory/constitution.md)

**Acceptance Criteria**:
- [ ] Folder structure created as per Constitution:
```
frontend/src/
├── domains/
│   └── report/              # Single "report" domain
│       ├── components/      # Report-specific components
│       │   ├── modules/     # Module form components (20 modules)
│       │   └── ...
│       ├── hooks/           # useAutoSave, useWizardNavigation
│       └── types.ts         # Domain types
├── shared/
│   ├── components/
│   │   ├── form/            # input-with-info, select-with-info, date-picker-with-info
│   │   ├── ui/              # shadcn/ui components
│   │   └── layout/          # Layout components
│   ├── services/            # API client (TanStack Query)
│   └── utils/               # Utility functions
├── stores/                  # Zustand stores
├── i18n/                    # Translations (generated)
├── schemas/                 # Zod schemas (generated)
└── App.tsx
```
- [ ] All directories exist
- [ ] README.md in key directories explaining purpose
- [ ] TypeScript compiles successfully
- [ ] Existing form components moved to `shared/components/form/`

**Technical Notes**:
- Follow Constitution DDD structure
- Single "report" domain (not per module)
- Existing components: `input-with-info.tsx`, `select-with-info.tsx`, `date-picker-with-info.tsx`

**Dependencies**: None

**Time Estimate**: 2 hours

---

### Task 4: Backend Project Structure (Hexagonal)

**Status**: ❌ Not Started

**User Story**:
> As a **backend developer**  
> I want **a clean Hexagonal Architecture structure**  
> So that **domain logic is separated from infrastructure and code is testable**

**Spec Reference**: [Constitution - Backend Architecture](../memory/constitution.md)

**Acceptance Criteria**:
- [ ] Folder structure created as per Constitution:
```
backend/src/main/kotlin/org/example/backend/
├── domain/
│   ├── model/               # Domain entities
│   ├── ports/
│   │   ├── inbound/         # ExportReportUseCase, ValidateReportUseCase
│   │   └── outbound/        # ExcelGenerationPort, TemplateLoaderPort
│   └── service/             # Domain logic
├── adapter/
│   ├── inbound/
│   │   └── rest/            # REST controllers
│   └── outbound/
│       ├── excel/           # Apache POI implementation
│       └── template/        # Template loading
├── application/             # Orchestration
└── dto/                     # VsmeReportDto
```
- [ ] All directories exist
- [ ] Port interfaces defined (ExportReportUseCase, ExcelGenerationPort, etc.)
- [ ] Kotlin code compiles successfully
- [ ] Gradle build works
- [ ] Spring Boot application starts

**Technical Notes**:
- Hexagonal Architecture (Ports & Adapters)
- Domain layer has no external dependencies
- Adapters implement ports

**Dependencies**: None

**Time Estimate**: 2 hours

---

## Phase 2: Frontend Implementation

**Goal**: Build complete wizard UI with all 20 modules, state management, and auto-save

---

### Task 5: Zustand Store Setup

**Status**: ❌ Not Started

**User Story**:
> As a **frontend developer**  
> I want **a Zustand store that manages all VSME report data**  
> So that **state is centralized, persists to LocalStorage, and supports the entire wizard**

**Spec Reference**: [State Management Spec](../specs/features/state-management.md)

**Acceptance Criteria**:
- [ ] Store created: `frontend/src/stores/vsme-report-store.ts`
- [ ] Store structure matches data model:
  - `reportMetadata` (entityName, reportingPeriod, etc.)
  - `reportMode` ("basic" | "comprehensive")
  - `basicModules` (B1-B11 array)
  - `comprehensiveModules` (C1-C9 array, optional)
  - `wizard` (currentStep, completedSteps, visitedSteps)
  - `validationErrors` (per module/datapoint)
- [ ] Persist middleware configured:
  - Storage key: `vsme-report-state`
  - Version: 1
  - Partialize: Only persist data, not UI state
- [ ] Immer middleware for immutability
- [ ] Actions implemented:
  - `updateDatapoint(moduleCode, datapointId, value)`
  - `goToStep(step)`
  - `validateModule(moduleCode)`
  - `setReportMode(mode)`
  - `clearReport()`
- [ ] Store hydrates from LocalStorage on page load
- [ ] TypeScript types correct

**Technical Notes**:
- Use Zustand + Persist + Immer middleware
- LocalStorage key: `vsme-report-state`
- Structure must align with `vsme-data-model-spec.json`

**Dependencies**: Task 1 (Zod schemas), Task 3 (Project structure)

**Time Estimate**: 4-5 hours

---

### Task 6: Auto-Save Implementation

**Status**: ❌ Not Started

**User Story**:
> As a **user filling out the report**  
> I want **my data to save automatically without clicking a Save button**  
> So that **I never lose my work, even if I close the browser**

**Spec Reference**: [State Management Spec](../specs/features/state-management.md)

**Acceptance Criteria**:
- [ ] Custom hook created: `frontend/src/domains/report/hooks/useAutoSave.ts`
- [ ] onBlur behavior:
  - Triggers immediate save to store
  - Triggers field validation
  - Shows validation error (if any)
- [ ] onChange behavior:
  - Debounced 900ms
  - Saves to store after typing pauses
  - Silent (no loading indicators)
- [ ] Hook returns:
  - `handleBlur(datapointId, value)`
  - `handleChange(datapointId, value)`
- [ ] Integration with Zustand store works
- [ ] No performance issues with many fields
- [ ] Data persists to LocalStorage via Zustand Persist

**Technical Notes**:
- Use `lodash.debounce` or custom debounce for onChange
- onBlur: immediate
- onChange: debounced 900ms
- Silent operation (Constitution Principle III)

**Dependencies**: Task 5 (Zustand store)

**Time Estimate**: 3 hours

---

### Task 7: Wizard Navigation & Stepper

**Status**: ❌ Not Started

**User Story**:
> As a **user**  
> I want **a step-by-step wizard guiding me through the 6 stepper sections**  
> So that **I can easily navigate the report without feeling overwhelmed**

**Spec Reference**: [State Management Spec](../specs/features/state-management.md), `vsme-stepper-config.json`

**Acceptance Criteria**:
- [ ] Wizard component created: `frontend/src/domains/report/components/ReportWizard.tsx`
- [ ] 6 steppers implemented based on `vsme-stepper-config.json`:
  1. Introduction (informational)
  2. General Information (B1-B2, C1-C2 conditional)
  3. Environmental (B3-B7, C3-C4 conditional)
  4. Social (B8-B10, C5-C7 conditional)
  5. Governance (B11, C8-C9 conditional)
  6. Review & Export (validation)
- [ ] Navigation rules:
  - **Next**: Validates current step, proceeds if valid
  - **Back**: No validation, always allowed
  - **Jump to completed**: Allowed
  - **Jump to incomplete**: Blocked (must complete current first)
- [ ] Progress indicator shows:
  - Current step highlighted
  - Completed steps with checkmark
  - Incomplete steps grayed out
  - Total progress (e.g., "3/6 steps completed")
- [ ] Comprehensive modules only shown if mode = "comprehensive"
- [ ] Wizard state persists in Zustand store
- [ ] i18n labels from generated translations

**Technical Notes**:
- Read `vsme-stepper-config.json` for structure
- Use shadcn/ui Stepper or build custom
- Conditional rendering for Comprehensive modules

**Dependencies**: Task 5 (Zustand store), Task 2 (i18n)

**Time Estimate**: 5 hours

---

### Task 8: Form Component Integration

**Status**: ❌ Not Started

**User Story**:
> As a **developer**  
> I want **existing form components integrated with the Zustand store**  
> So that **they support auto-save, validation, and i18n out of the box**

**Spec Reference**: [Constitution - Reusable Components](../memory/constitution.md)

**Acceptance Criteria**:
- [ ] Enhanced `input-with-info.tsx`:
  - Connects to Zustand store
  - Calls `useAutoSave` hook
  - Displays validation errors
  - Supports i18n labels/tooltips
- [ ] Enhanced `select-with-info.tsx`:
  - Connects to Zustand store
  - Calls `useAutoSave` hook
  - Displays validation errors
  - Supports i18n labels/options
- [ ] Enhanced `date-picker-with-info.tsx`:
  - Connects to Zustand store
  - Calls `useAutoSave` hook
  - Displays validation errors
  - Supports i18n labels
- [ ] All components accept props:
  - `datapointId`: string
  - `moduleCode`: string
  - `label`: string (from i18n)
  - `helpText`: string (from i18n, optional)
  - `required`: boolean
  - `disabled`: boolean
- [ ] Components work with React Hook Form
- [ ] TypeScript types correct

**Technical Notes**:
- Existing components in `frontend/src/components/ui/`
- Move to `frontend/src/shared/components/form/`
- Integrate with `useAutoSave` hook

**Dependencies**: Task 6 (Auto-save), Task 5 (Zustand store), Task 2 (i18n)

**Time Estimate**: 3-4 hours

---

### Task 9: All Module Forms Implementation

**Status**: ❌ Not Started

**User Story**:
> As a **user**  
> I want **forms for all 20 VSME modules (B1-B11 + C1-C9)**  
> So that **I can fill in my complete sustainability report**

**Spec Reference**: [State Management Spec](../specs/features/state-management.md), Data Model

**Acceptance Criteria**:
- [ ] **11 Basic Module forms created** (`frontend/src/domains/report/components/modules/`):
  - `B1_GeneralInformation.tsx`
  - `B2_RevenueEmployees.tsx`
  - `B3_EnergyGHG.tsx`
  - `B4_Pollution.tsx`
  - `B5_BiodiversityEcosystems.tsx`
  - `B6_CircularEconomy.tsx`
  - `B7_Water.tsx`
  - `B8_OwnWorkforce.tsx`
  - `B9_WorkersValueChain.tsx`
  - `B10_Communities.tsx`
  - `B11_BusinessConduct.tsx`

- [ ] **9 Comprehensive Module forms created**:
  - `C1_BasisForPreparation.tsx`
  - `C2_Governance.tsx`
  - `C3_ClimateChange.tsx`
  - `C4_ResourceUse.tsx`
  - `C5_OwnWorkforce.tsx`
  - `C6_WorkersValueChain.tsx`
  - `C7_AffectedCommunities.tsx`
  - `C8_BusinessConduct.tsx`
  - `C9_Governance.tsx`

- [ ] All 797 datapoints implemented as form fields
- [ ] Each module uses:
  - Enhanced form components (input-with-info, select-with-info, date-picker-with-info)
  - Generated Zod schemas for validation
  - React Hook Form for form state
  - i18n labels from generated translations
- [ ] Array datapoints handled (e.g., listOfSites):
  - Dynamic add/remove buttons
  - Validation per item
  - Max items limit enforced
- [ ] Disclosure-level grouping:
  - Each disclosure rendered as a Card
  - Card header with disclosure name (i18n)
  - Card body with datapoint inputs
- [ ] Comprehensive modules conditionally rendered
- [ ] All forms connected to Zustand store
- [ ] Auto-save works on all fields

**Technical Notes**:
- 20 module components total
- ~797 datapoints across all modules
- Read `vsme-data-model-spec.json` for structure
- Each module: Disclosures → Card, Datapoints → Input
- Array patterns from `vsme-repeating-data-patterns.json`

**Dependencies**: Task 8 (Form components), Task 1 (Zod schemas), Task 2 (i18n)

**Time Estimate**: 20-30 hours (largest task!)

---

### Task 10: Report Mode Selection

**Status**: ❌ Not Started

**User Story**:
> As a **user**  
> I want **to choose between Basic and Comprehensive report modes**  
> So that **I only see the modules relevant to my reporting requirement**

**Spec Reference**: [State Management Spec](../specs/features/state-management.md)

**Acceptance Criteria**:
- [ ] Mode selection component created: `frontend/src/domains/report/components/ModeSelection.tsx`
- [ ] Radio button options:
  - "Basic Module Only" (B1-B11)
  - "Basic & Comprehensive" (B1-B11 + C1-C9)
- [ ] Each option has:
  - Clear label (i18n)
  - Description explaining difference (i18n)
  - Tooltip with help text
- [ ] Selection saves to Zustand store (`reportMode`)
- [ ] Changing mode mid-report shows confirmation dialog:
  - "Switching mode will reset your Comprehensive module data. Continue?"
  - If confirmed: clear comprehensiveModules, switch mode
  - If cancelled: keep current mode
- [ ] Mode persists to LocalStorage
- [ ] Wizard steppers adjust based on mode:
  - Basic: Hide Comprehensive modules (C1-C9)
  - Comprehensive: Show all modules
- [ ] Mode displayed in wizard progress
- [ ] Can change mode from settings (future: settings page)

**Technical Notes**:
- Rendered in Introduction stepper or as step 0
- Uses shadcn/ui RadioGroup
- Confirmation dialog with shadcn/ui AlertDialog

**Dependencies**: Task 5 (Zustand store), Task 7 (Wizard navigation)

**Time Estimate**: 2-3 hours

---

## Phase 3: Backend Implementation

**Goal**: Excel template loading, Named Range resolution, complete report generation

---

### Task 11: Excel Template Singleton

**Status**: ❌ Not Started

**User Story**:
> As a **backend system**  
> I want **the VSME Excel template loaded once at startup**  
> So that **report generation is fast and doesn't reload the 8MB file per request**

**Spec Reference**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Acceptance Criteria**:
- [ ] Component created: `backend/.../adapter/outbound/template/ExcelTemplateLoader.kt`
- [ ] Singleton bean annotated with `@Bean`
- [ ] Loads `VSME-Digital-Template-1.1.0.xlsx` from root directory
- [ ] Returns `Workbook` instance (Apache POI)
- [ ] Logs on successful load:
  - "VSME Excel template loaded successfully"
  - Number of sheets
  - Number of Named Ranges
- [ ] Fails fast if template missing/corrupt:
  - Throws exception
  - Application won't start
  - Clear error message
- [ ] Template kept in memory for duration of application
- [ ] Memory usage stable (no leaks)

**Technical Notes**:
- Use Apache POI `WorkbookFactory.create()`
- File path: `VSME-Digital-Template-1.1.0.xlsx` (root)
- Expected: 13 sheets, 797 Named Ranges
- Singleton pattern for performance

**Dependencies**: Task 4 (Backend structure)

**Time Estimate**: 3 hours

---

### Task 12: Named Range Mapping Loader

**Status**: ❌ Not Started

**User Story**:
> As a **backend system**  
> I want **datapoint-to-Named Range mappings loaded at startup**  
> So that **I can quickly lookup which Excel cell to write for each datapoint**

**Spec Reference**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Acceptance Criteria**:
- [ ] Component created: `backend/.../adapter/outbound/excel/NamedRangeMappingLoader.kt`
- [ ] Annotated with `@Component`
- [ ] Loads `docs/data-model/vsme-data-model-spec.json` at startup (`@PostConstruct`)
- [ ] Parses JSON and extracts:
  - datapointId
  - excelNamedRange
  - dataType
- [ ] Stores in `ConcurrentHashMap<String, NamedRangeMapping>` for O(1) lookup
- [ ] Logs on successful load:
  - "Loaded 797 Named Range mappings"
- [ ] Exposes method: `getMapping(datapointId: String): NamedRangeMapping?`
- [ ] Returns null if datapoint not found
- [ ] Thread-safe (ConcurrentHashMap)

**Technical Notes**:
- Input: `docs/data-model/vsme-data-model-spec.json`
- 797 mappings total
- Data class:
```kotlin
data class NamedRangeMapping(
  val datapointId: String,
  val excelNamedRange: String,
  val dataType: DataType
)
```

**Dependencies**: Task 4 (Backend structure)

**Time Estimate**: 3 hours

---

### Task 13: Datapoint Writer Service

**Status**: ❌ Not Started

**User Story**:
> As a **backend system**  
> I want **to write a single datapoint value to its Named Range in Excel**  
> So that **user input correctly populates the VSME template**

**Spec Reference**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Acceptance Criteria**:
- [ ] Service created: `backend/.../adapter/outbound/excel/DatapointWriter.kt`
- [ ] Annotated with `@Service`
- [ ] Implements method:
```kotlin
fun writeDatapoint(
  workbook: Workbook,
  datapointId: String,
  value: Any?
)
```
- [ ] Lookup Named Range mapping via Task 12's loader
- [ ] Resolve Named Range to cell reference using Apache POI
- [ ] Handle all dataTypes correctly:
  - `text`, `textarea`, `url`, `email` → `cell.setCellValue(value.toString())`
  - `number` → `cell.setCellValue(value.toDouble())`
  - `date` → `cell.setCellValue(parseDate(value))` (YYYY-MM-DD)
  - `boolean` → `cell.setCellValue(value as Boolean)`
  - `select` → `cell.setCellValue(value.toString())`
- [ ] Error handling:
  - Named Range not found → Throw `NamedRangeNotFoundException`
  - Datapoint mapping not found → Throw `DatapointMappingNotFoundException`
  - Invalid data type → Throw `InvalidDataTypeException`
- [ ] Unit tests for all dataTypes
- [ ] Cell updates don't corrupt Excel formulas

**Technical Notes**:
- Use Apache POI `workbook.getName(rangeName)`
- AreaReference to get cell coordinates
- Write value based on dataType

**Dependencies**: Task 12 (Mapping loader), Task 11 (Template)

**Time Estimate**: 4 hours

---

### Task 14: Repeating Data (Array) Handler

**Status**: ❌ Not Started

**User Story**:
> As a **backend system**  
> I want **to write array datapoints (e.g., listOfSites) to multiple Excel rows**  
> So that **tables in the VSME template are correctly populated**

**Spec Reference**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Acceptance Criteria**:
- [ ] Service created: `backend/.../adapter/outbound/excel/ArrayDatapointWriter.kt`
- [ ] Loads `docs/data-model/vsme-repeating-data-patterns.json` at startup
- [ ] Implements method:
```kotlin
fun writeArrayDatapoint(
  workbook: Workbook,
  datapointId: String,
  items: List<Map<String, Any?>>
)
```
- [ ] For each pattern:
  - Get excelSheet, excelStartRow, maxRows, columns
  - Validate items.size ≤ maxRows
  - Iterate items
  - For each item: write to row (startRow + index)
  - For each column: write value to excelColumn
- [ ] All 10 repeating patterns supported:
  - `listOfSites`
  - `listOfSubsidiaries`
  - `listOfEmployeesByGender`
  - `listOfEmployeesByContract`
  - `listOfEnergyConsumption`
  - `listOfGHGEmissions`
  - `listOfWaterConsumption`
  - `listOfWasteGeneration`
  - `listOfTrainingHours`
  - `listOfIncidents`
- [ ] Error handling:
  - MaxRows exceeded → Throw `MaxRowsExceededException`
  - Pattern not found → Throw `PatternNotFoundException`
- [ ] Column letter to index conversion (A→0, B→1, C→2, etc.)
- [ ] Unit tests for each pattern

**Technical Notes**:
- Input: `vsme-repeating-data-patterns.json`
- 10 patterns total
- Row iteration: row = startRow + itemIndex
- Column mapping: "C" → index 2

**Dependencies**: Task 13 (Datapoint writer), Task 11 (Template)

**Time Estimate**: 4-5 hours

---

### Task 15: Report Generation Service

**Status**: ❌ Not Started

**User Story**:
> As a **backend system**  
> I want **to orchestrate the complete report generation flow**  
> So that **all user data is written to the Excel and returned as Base64**

**Spec Reference**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Acceptance Criteria**:
- [ ] Service created: `backend/.../domain/service/ReportGenerationService.kt`
- [ ] Implements use case: `ExportReportUseCase`
- [ ] Method signature:
```kotlin
fun generateReport(request: ExcelExportRequest): ExcelExportResponse
```
- [ ] Flow:
  1. Clone template (from Task 11) for thread-safety
  2. Iterate all modules in request (basicModules + comprehensiveModules)
  3. For each module: iterate disclosures → datapoints
  4. For simple datapoints: call `DatapointWriter.writeDatapoint()`
  5. For array datapoints: call `ArrayDatapointWriter.writeArrayDatapoint()`
  6. Convert workbook to ByteArray
  7. Encode to Base64
  8. Return `ExcelExportResponse(success=true, excelFileBase64=...)`
- [ ] Error handling:
  - Any exception → Return `ExcelExportResponse(success=false, message=error)`
  - Validation errors → Return with `validationErrors` list
- [ ] Thread-safe (each request gets cloned template)
- [ ] Performance: < 2 seconds for Basic Report
- [ ] Logging: Log start/end of generation, duration
- [ ] Unit tests with mock data

**Technical Notes**:
- Clone workbook: write to ByteArrayOutputStream, read back
- Use `Base64.getEncoder().encodeToString(bytes)`
- DTO: `ExcelExportRequest`, `ExcelExportResponse`

**Dependencies**: Task 13 (Datapoint writer), Task 14 (Array handler), Task 11 (Template)

**Time Estimate**: 4-5 hours

---

### Task 16: REST API Endpoint

**Status**: ❌ Not Started

**User Story**:
> As a **frontend application**  
> I want **a REST API endpoint to trigger Excel export**  
> So that **users can download their completed VSME report**

**Spec Reference**: [Constitution - API Contract](../memory/constitution.md)

**Acceptance Criteria**:
- [ ] Controller created: `backend/.../adapter/inbound/rest/VsmeExportController.kt`
- [ ] Annotated with `@RestController`, `@RequestMapping("/api/vsme")`
- [ ] Endpoint: `POST /api/vsme/export`
- [ ] Request body: `ExcelExportRequest` (JSON)
  - reportMetadata
  - basicModules (array)
  - comprehensiveModules (array, optional)
- [ ] Response: `ExcelExportResponse` (JSON)
  - success: boolean
  - message: string
  - timestamp: string (ISO 8601)
  - excelFileBase64: string (if success)
  - validationErrors: array (if validation fails)
- [ ] Calls `ReportGenerationService.generateReport()`
- [ ] HTTP status codes:
  - 200 OK: Success
  - 400 Bad Request: Validation error
  - 500 Internal Server Error: Generation failed
- [ ] CORS enabled for frontend (localhost:5173)
- [ ] Request logging (Spring Boot)
- [ ] Integration test with sample request

**Technical Notes**:
- Use `@PostMapping("/export")`
- DTO classes: `ExcelExportRequest`, `ExcelExportResponse` (defined in Task 4)
- Error handling with `@ExceptionHandler`

**Dependencies**: Task 15 (Report Generation Service)

**Time Estimate**: 2-3 hours

---

## Phase 4: Integration & Testing

**Goal**: Connect frontend to backend, end-to-end testing, polish

---

### Task 17: TanStack Query API Client

**Status**: ❌ Not Started

**User Story**:
> As a **frontend application**  
> I want **an API client to call the backend export endpoint**  
> So that **users can trigger Excel generation and download the file**

**Spec Reference**: [Constitution - Tech Stack](../memory/constitution.md)

**Acceptance Criteria**:
- [ ] API client created: `frontend/src/shared/services/vsme-api.ts`
- [ ] Uses TanStack Query (v5)
- [ ] Mutation hook: `useExportReport`
```typescript
const exportMutation = useMutation({
  mutationFn: (data: VsmeReportState) => exportReport(data),
  onSuccess: (response) => handleDownload(response),
  onError: (error) => showErrorToast(error)
})
```
- [ ] Function: `exportReport(data: VsmeReportState): Promise<ExcelExportResponse>`
  - POST to `/api/vsme/export`
  - Reads data from Zustand store
  - Sends JSON body
  - Returns response
- [ ] Success handling:
  - Decode Base64 to Blob
  - Trigger download (Task 18)
  - Show success toast
- [ ] Error handling:
  - Network error → Show error message
  - Validation error → Show validation errors in UI
  - 500 error → Show "Generation failed" message
- [ ] Loading state tracked
- [ ] TypeScript types from `vsme-api-types.ts`

**Technical Notes**:
- Use `fetch` or `axios`
- TanStack Query for state management (loading, error, data)
- Endpoint: `http://localhost:8080/api/vsme/export`

**Dependencies**: Task 16 (API endpoint), Task 5 (Zustand store)

**Time Estimate**: 2-3 hours

---

### Task 18: Excel Download Handler

**Status**: ❌ Not Started

**User Story**:
> As a **user**  
> I want **to download the Excel file after generation**  
> So that **I can open it in Microsoft Excel and review my VSME report**

**Spec Reference**: Implementation Plan

**Acceptance Criteria**:
- [ ] Utility created: `frontend/src/shared/utils/excel-download.ts`
- [ ] Function: `downloadExcel(base64String: string, filename?: string)`
- [ ] Steps:
  1. Decode Base64 to binary
  2. Create Blob with MIME type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  3. Create object URL
  4. Create temporary `<a>` element
  5. Trigger click to download
  6. Revoke object URL
- [ ] Filename: `VSME-Report-{YYYY-MM-DD}.xlsx` (default)
- [ ] Works in Chrome, Firefox, Edge, Safari
- [ ] File opens correctly in Microsoft Excel
- [ ] No console errors
- [ ] TypeScript types correct

**Technical Notes**:
- Use `atob()` to decode Base64
- Blob constructor with correct MIME type
- `URL.createObjectURL()` for download

**Dependencies**: Task 17 (API client)

**Time Estimate**: 1 hour

---

### Task 19: E2E Happy Path Test

**Status**: ❌ Not Started

**User Story**:
> As a **QA tester**  
> I want **to verify the complete user journey works end-to-end**  
> So that **we can confidently say the MVP is functional**

**Spec Reference**: Implementation Plan

**Acceptance Criteria**:

**Test Scenario 1: Basic Mode**
- [ ] Start application (frontend + backend running)
- [ ] Navigate to Introduction stepper
- [ ] Proceed to Mode Selection
- [ ] Select "Basic Module Only"
- [ ] Navigate through all 6 steppers:
  - [ ] Stepper 2: General Information (B1, B2)
  - [ ] Stepper 3: Environmental (B3-B7)
  - [ ] Stepper 4: Social (B8-B10)
  - [ ] Stepper 5: Governance (B11)
  - [ ] Stepper 6: Review & Export
- [ ] Fill sample data in all Basic Modules (select key fields per module)
- [ ] Navigate back to General Information, verify data persists
- [ ] Reload page (F5), verify all data still present
- [ ] Reach Review & Export stepper
- [ ] Verify summary shows filled data
- [ ] Click "Export Excel" button
- [ ] Verify Excel downloads successfully
- [ ] Open Excel in Microsoft Excel, verify:
  - [ ] File opens without errors
  - [ ] Basic Module data present in correct cells
  - [ ] Named Ranges populated correctly
  - [ ] Formulas still work
  - [ ] No #REF! errors

**Test Scenario 2: Comprehensive Mode**
- [ ] Start new report
- [ ] Select "Basic & Comprehensive"
- [ ] Verify Comprehensive modules (C1-C9) visible in steppers
- [ ] Fill sample data in all 20 modules (B1-B11 + C1-C9)
- [ ] Verify array datapoints work (e.g., add 3 sites in listOfSites)
- [ ] Export Excel
- [ ] Open Excel, verify:
  - [ ] All Basic Module data present
  - [ ] All Comprehensive Module data present
  - [ ] Array data in correct rows (listOfSites rows 109-111)

**Test Scenario 3: Mode Switching**
- [ ] Start with Comprehensive mode
- [ ] Fill some Comprehensive module data
- [ ] Switch to Basic mode
- [ ] Verify confirmation dialog appears
- [ ] Confirm switch
- [ ] Verify Comprehensive data cleared
- [ ] Verify Basic data still present

**Technical Notes**:
- Manual testing (no automated E2E for MVP)
- Document test results
- Screenshot critical steps
- Note any bugs/issues

**Dependencies**: All previous tasks completed

**Time Estimate**: 3-4 hours

---

### Task 20: Error Handling & Polish

**Status**: ❌ Not Started

**User Story**:
> As a **user**  
> I want **clear error messages and good UX feedback**  
> So that **I understand what went wrong and how to fix it**

**Spec Reference**: Implementation Plan

**Acceptance Criteria**:

**Validation Errors**:
- [ ] Field-level errors show below input (red text)
- [ ] Error messages from i18n (English/German)
- [ ] Example: "This field is required", "Invalid email format"
- [ ] Errors clear when field becomes valid

**Export Errors**:
- [ ] Loading state during Excel generation:
  - [ ] "Export Excel" button shows loading spinner
  - [ ] Button disabled during generation
  - [ ] Text: "Generating report..."
- [ ] Success feedback:
  - [ ] Toast notification: "Report generated successfully!"
  - [ ] Auto-dismiss after 3 seconds
- [ ] Error feedback:
  - [ ] Toast notification with error message
  - [ ] Example: "Excel generation failed. Please try again."
  - [ ] Network error: "Cannot connect to server"
  - [ ] Validation error: Show specific field errors

**Edge Cases**:
- [ ] Empty report (no data entered):
  - [ ] Export still works
  - [ ] Excel has template structure but empty cells
- [ ] Incomplete modules:
  - [ ] Validation blocks navigation
  - [ ] Shows count of errors per module
- [ ] LocalStorage full:
  - [ ] Show error: "Storage limit reached"
  - [ ] Offer to clear old data

**Polish**:
- [ ] Loading skeletons for slow operations
- [ ] Smooth transitions between steppers
- [ ] Help tooltips work correctly
- [ ] Responsive design (desktop only for MVP)
- [ ] No console errors or warnings
- [ ] Favicon and page title correct

**Technical Notes**:
- Use shadcn/ui Toast for notifications
- Use react-i18next for error messages
- Error boundary for uncaught errors

**Dependencies**: Task 17 (API client), Task 19 (E2E test)

**Time Estimate**: 4-5 hours

---

## Summary

| Phase | Tasks | Est. Time | Dependencies |
|-------|-------|-----------|--------------|
| **Phase 1** | 1-4 | 11-14 hours | None |
| **Phase 2** | 5-10 | 37-46 hours | Phase 1 |
| **Phase 3** | 11-16 | 20-25 hours | Phase 1 |
| **Phase 4** | 17-20 | 10-13 hours | Phases 2+3 |
| **TOTAL** | **20 tasks** | **78-98 hours** | (3-4 weeks) |

---

## Progress Tracking

**Completed**: 0/20 tasks (0%)

```
Phase 1: ⬜⬜⬜⬜ (0/4)
Phase 2: ⬜⬜⬜⬜⬜⬜ (0/6)
Phase 3: ⬜⬜⬜⬜⬜⬜ (0/6)
Phase 4: ⬜⬜⬜⬜ (0/4)
```

**Legend**: ⬜ Not Started | 🟡 In Progress | ✅ Done

---

## Next Actions

1. ✅ **Review this task list** with team/stakeholders
2. ✅ **Start Task 1**: Zod Schema Generator
3. **Commit after each task** (one task = one commit)
4. **Update status** in this file after each task
5. **Daily sync** to track progress (if team > 1)

---

**Version**: 1.0.0 | **Created**: 2025-11-17 | **Based on**: Implementation Plan v1.0.0

