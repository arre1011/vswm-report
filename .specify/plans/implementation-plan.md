# VSME Easy Report - Implementation Plan

**Version**: 1.0.0  
**Status**: Active  
**Created**: 2025-11-17  
**Based on**: Constitution v1.1.0 + 3 Core Specifications

---

## Executive Summary

This implementation plan transforms the VSME Easy Report vision into a working MVP through a **4-phase approach**. The plan is grounded in our **Constitution** (tech stack, principles) and guided by **3 detailed specifications** (Excel Integration, State Management, Code Generation).

**Timeline Estimate**: 3-4 weeks (60-80 hours)  
**Approach**: Spec-Driven Development (SDD)  
**Commit Strategy**: One task = one commit  

---

## Success Criteria

### MVP Definition
A working VSME Easy Report application where:
- ✅ User can select Basic or Comprehensive mode
- ✅ User navigates through all 6 wizard steppers
- ✅ User fills in **all Basic Modules (B1-B11)**
- ✅ User fills in **all Comprehensive Modules (C1-C9)** if mode selected
- ✅ Data persists across page reloads (LocalStorage)
- ✅ User triggers Excel export from Review & Export stepper
- ✅ Backend generates fully filled VSME Excel file
- ✅ User downloads the completed Excel file

### Quality Gates
  - ✅ All TypeScript/Kotlin code compiles without errors
  - ✅ Zod validation works for all 797 datapoints
  - ✅ All 11 Basic Modules functional
  - ✅ All 9 Comprehensive Modules functional (conditional)
  - ✅ Generated Excel opens in Microsoft Excel
  - ✅ All 797 datapoints correctly mapped to Named Ranges
  - ✅ i18n works for English and German
  - ✅ All 6 steppers navigable


---

## Phase 1: Foundation & Code Generation

**Goal**: Analyse the current implementation override if necessery 
### Tasks

#### Task 1: Zod Schema Generator
**What**: Auto-generate Zod validation schemas from `vsme-data-model-spec.json`  
**Why**: 797 datapoints - manual schemas = maintenance nightmare  
**Output**: `frontend/src/schemas/vsme-zod-schemas.ts`  
**Spec**: [Code Generation Spec](../specs/scripts/code-generation.md)

**Key Requirements**:
- Map all dataTypes (text→z.string(), number→z.number(), etc.)
- Apply validation rules (min, max, pattern, required)
- Generate schemas for array datapoints
- npm script: `npm run generate:schemas`

#### Task 2: i18n Key Extraction
**What**: Extract translation keys (English + German) from data model  
**Why**: Multilingual support is core feature  
**Output**: `frontend/src/i18n/en/vsme.json`, `frontend/src/i18n/de/vsme.json`  
**Time**: 3 hours  
**Spec**: [Code Generation Spec](../specs/scripts/code-generation.md)

**Key Requirements**:
- Module names, disclosure names, datapoint labels
- Validation messages
- Help texts & tooltips
- npm script: `npm run generate:i18n`

#### Task 3: Frontend Project Structure (DDD)
**What**: Setup React project with DDD folder structure  
**Why**: Constitution mandates Domain-Driven Design  
**Output**: Complete folder structure as per Constitution  
**Time**: 2 hours  

**Structure**:
```
frontend/src/
├── domains/
│   └── report/              # Single "report" domain
│       ├── components/      # Report-specific components
│       ├── hooks/           # useAutoSave, useWizard
│       └── types.ts         # Domain types
├── shared/
│   ├── components/
│   │   ├── form/            # input-with-info, select-with-info, date-picker-with-info
│   │   ├── ui/              # shadcn/ui components
│   │   └── layout/          # Layout components
│   ├── services/            # API client (TanStack Query)
│   └── utils/
├── stores/                  # Zustand stores
├── i18n/                    # Generated translations
└── App.tsx
```

#### Task 4: Backend Project Structure (Hexagonal)
**What**: Setup Spring Boot Kotlin project with Hexagonal Architecture  
**Why**: Constitution mandates clean architecture  
**Output**: Complete backend structure  
**Time**: 2 hours  

**Structure**:
```
backend/src/main/kotlin/org/example/backend/
├── domain/
│   ├── model/               # Domain entities
│   ├── ports/
│   │   ├── inbound/         # ExportReportUseCase
│   │   └── outbound/        # ExcelGenerationPort
│   └── service/             # Domain logic
├── adapter/
│   ├── inbound/rest/        # REST controllers
│   └── outbound/
│       ├── excel/           # Apache POI implementation
│       └── template/        # Template loading
├── application/             # Orchestration
└── dto/                     # VsmeReportDto
```

### Phase 1 Milestone
✅ **Code generators functional**  
✅ **Project structure aligned with Constitution**  
✅ **Zod schemas generated for all datapoints**  
✅ **i18n keys extracted for en/de**  
✅ **Both projects compile successfully**

---

## Phase 2: Frontend Implementation

**Goal**: Build working wizard UI with state management and auto-save.

### Tasks

#### Task 5: Zustand Store Setup
**What**: Implement VSME report state with Zustand + Persist  
**Why**: Core state management (Constitution Principle III)  
**Output**: `frontend/src/stores/vsme-report-store.ts`  
**Spec**: [State Management Spec](../specs/features/state-management.md)

**Key Requirements**:
- Store structure matches data model
- Persist middleware with LocalStorage
- Immer middleware for immutability
- Actions: updateDatapoint, goToStep, validateStep

#### Task 6: Auto-Save Implementation
**What**: Implement onBlur + debounced onChange auto-save  
**Why**: "Save early, save quietly" (Constitution Principle III)  
**Output**: `frontend/src/domains/report/hooks/useAutoSave.ts`  
**Spec**: [State Management Spec](../specs/features/state-management.md)

**Key Requirements**:
- onBlur: immediate save + validation
- onChange: debounced 900ms
- Silent (no loading indicators)
- Integration with Zustand store

#### Task 7: Wizard Navigation
**What**: Implement stepper with navigation rules  
**Why**: Multi-step wizard is core UX  
**Output**: `frontend/src/domains/report/components/ReportWizard.tsx`
**Spec**: [State Management Spec](../specs/features/state-management.md)

**Key Requirements**:
- Next button: validates current step
- Back button: no validation
- Jump to completed steps: allowed
- Progress indicator shows completion

#### Task 8: Form Component Integration
**What**: Integrate existing form components with store  
**Why**: Reuse existing input-with-info, select-with-info, date-picker-with-info  
**Output**: Enhanced components with store integration

**Key Requirements**:
- Connect to Zustand store
- Trigger auto-save on blur/change
- Display validation errors
- Support i18n labels

#### Task 9: All Module Forms Implementation
**What**: Build complete forms for all 20 modules (11 Basic + 9 Comprehensive)  
**Why**: Complete VSME report requires all modules  
**Output**: `frontend/src/domains/report/components/modules/` (20 module components)

**Module Breakdown**:
- **Basic Modules**: B1-B11 (11 modules)
- **Comprehensive Modules**: C1-C9 (9 modules, conditional display)

**Key Requirements**:
- All 797 datapoints implemented as form fields
- Use generated Zod schemas for validation
- React Hook Form integration per module
- i18n labels from generated keys
- Reuse form components: input-with-info, select-with-info, date-picker-with-info
- Handle array datapoints (e.g., listOfSites) with dynamic add/remove
- Conditional rendering based on report mode (Basic vs. Comprehensive)

#### Task 10: Report Mode Selection
**What**: Implement Basic vs. Comprehensive mode selection  
**Why**: User needs to choose report type at start  
**Output**: `frontend/src/domains/report/components/ModeSelection.tsx`  
**Time**: 2 hours  
**Spec**: [State Management Spec](../specs/features/state-management.md)

**Key Requirements**:
- Radio buttons: Basic / Comprehensive
- Affects which modules shown in wizard
- Confirmation dialog if changed mid-report
- Persists in store

### Phase 2 Milestone
✅ **All 6 wizard steppers navigable**  
✅ **All 11 Basic Module forms functional**  
✅ **All 9 Comprehensive Module forms functional (conditional)**  
✅ **Auto-save works for all 797 datapoints (onBlur + onChange)**  
✅ **Data persists across page reload**  
✅ **Validation shows errors on blur for all fields**  
✅ **Mode selection works (Basic vs. Comprehensive)**  
✅ **Stepper configuration from vsme-stepper-config.json implemented**

---

## Phase 3: Backend Implementation

**Goal**: Excel template loading, Named Range resolution, and report generation.

**Duration**: 5-7 days  
**Parallelization**: Can run parallel with Phase 2 (Frontend)

### Tasks

#### Task 11: Excel Template Singleton
**What**: Load VSME template once at Spring Boot startup  
**Why**: Performance - avoid loading 8MB file per request  
**Output**: `backend/.../adapter/outbound/template/ExcelTemplateLoader.kt`  
**Time**: 3 hours  
**Spec**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Key Requirements**:
- @Bean annotation for singleton
- Load VSME-Digital-Template-1.1.0.xlsx
- Log sheet count and Named Range count
- Fail fast if template missing

#### Task 12: Named Range Mapping Loader
**What**: Load datapoint→Named Range mappings from data model  
**Why**: Need to know which datapoint maps to which Excel cell  
**Output**: `backend/.../adapter/outbound/excel/NamedRangeMappingLoader.kt`  
**Time**: 3 hours  
**Spec**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Key Requirements**:
- Read vsme-data-model-spec.json at startup
- Store in ConcurrentHashMap (O(1) lookup)
- 797 mappings loaded
- Expose getMapping(datapointId) method

#### Task 13: Datapoint Writer Service
**What**: Write single datapoint value to Named Range in Excel  
**Why**: Core logic for filling Excel cells  
**Output**: `backend/.../adapter/outbound/excel/DatapointWriter.kt`  
**Time**: 4 hours  
**Spec**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Key Requirements**:
- Resolve Named Range to cell reference
- Handle all dataTypes (text, number, date, boolean, select)
- Write value to cell
- Error handling (range not found, invalid type)

#### Task 14: Repeating Data (Array) Handler
**What**: Write array datapoints to multiple Excel rows  
**Why**: listOfSites, listOfSubsidiaries need table handling  
**Output**: `backend/.../adapter/outbound/excel/ArrayDatapointWriter.kt`  
**Time**: 4 hours  
**Spec**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Key Requirements**:
- Load repeating patterns from data model
- Iterate array items
- Write each item to consecutive rows
- Respect maxRows limit

#### Task 15: Report Generation Service
**What**: Orchestrate complete report generation flow  
**Why**: High-level service tying everything together  
**Output**: `backend/.../domain/service/ReportGenerationService.kt`  
**Time**: 4 hours  
**Spec**: [Excel Integration Spec](../specs/backend/excel-integration.md)

**Key Requirements**:
- Clone template for thread-safety
- Iterate all modules/datapoints
- Write simple datapoints via DatapointWriter
- Write array datapoints via ArrayDatapointWriter
- Convert workbook to Base64
- Return ExcelExportResponse

#### Task 16: REST API Endpoint
**What**: POST /api/vsme/export endpoint  
**Why**: Frontend needs to trigger export  
**Output**: `backend/.../adapter/inbound/rest/VsmeExportController.kt`  
**Time**: 2 hours  

**Key Requirements**:
- Accept ExcelExportRequest (JSON)
- Call ReportGenerationService
- Return ExcelExportResponse with Base64 Excel
- Error handling (400, 500)

### Phase 3 Milestone
✅ **Template loads at Spring Boot startup**  
✅ **All 797 Named Ranges loadable and resolvable**  
✅ **All Basic Module datapoints write to Excel correctly**  
✅ **All Comprehensive Module datapoints write to Excel correctly**  
✅ **All array datapoints (10 patterns) write to multiple rows**  
✅ **API endpoint returns Base64 Excel file**  
✅ **Generated Excel opens in Microsoft Excel**  
✅ **Excel formulas and formatting preserved**

---

## Phase 4: Integration & Testing

**Goal**: Connect frontend to backend, end-to-end testing, polish.

**Duration**: 3-5 days  
**Parallelization**: None (sequential integration work)

### Tasks

#### Task 17: TanStack Query API Client
**What**: Setup API client for /api/vsme/export  
**Why**: Frontend needs to call backend  
**Output**: `frontend/src/shared/services/vsme-api.ts`  
**Time**: 2 hours  

**Key Requirements**:
- useMutation for export
- Read data from Zustand store
- Handle success (download file)
- Handle errors (show to user)

#### Task 18: Excel Download Handler
**What**: Convert Base64 to downloadable .xlsx file  
**Why**: User needs to download the Excel  
**Output**: `frontend/src/shared/utils/excel-download.ts`  
**Time**: 1 hour  

**Key Requirements**:
- Decode Base64 string
- Create Blob with correct MIME type
- Trigger browser download
- Filename: VSME-Report-{date}.xlsx

#### Task 19: E2E Happy Path Test
**What**: Complete user journey from start to download  
**Why**: Validate MVP works end-to-end  
**Output**: Test script + manual verification  
**Time**: 3 hours  

**Test Steps - Basic Mode**:
1. Start wizard, reach Mode Selection
2. Select "Basic Module Only"
3. Navigate through all 6 steppers
4. Fill sample data in all Basic Modules (B1-B11)
5. Navigate back to General Information stepper, verify data persists
6. Reload page, verify all data still there
7. Reach Review & Export stepper
8. Click Export button
9. Verify Excel downloads
10. Open Excel, verify all Basic Module data present in correct Named Ranges

**Test Steps - Comprehensive Mode**:
1. Select "Basic & Comprehensive"
2. Navigate through all 6 steppers
3. Fill sample data in all 20 modules (B1-B11 + C1-C9)
4. Verify Comprehensive modules shown in appropriate steppers
5. Reach Review & Export stepper
6. Click Export button
7. Verify Excel downloads
8. Open Excel, verify all 797 datapoints present in correct cells

#### Task 20: Error Handling & Polish
**What**: Add error messages, loading states, edge cases  
**Why**: Production-ready MVP needs good UX  
**Output**: Error boundaries, toast notifications, loading indicators  
**Time**: 4 hours  

**Key Requirements**:
- Validation error messages in i18n
- Loading state during Excel generation
- Error toast if export fails
- Empty state for new reports

### Phase 4 Milestone
✅ **Complete user journey works**  
✅ **VSME Report data flows from frontend → backend → Excel**  
✅ **Excel downloads successfully**  
✅ **Manual verification: Excel is correct**  
✅ **MVP ready for stakeholder demo**



## Dependencies

### External Dependencies
- **VSME Excel Template**: `VSME-Digital-Template-1.1.0.xlsx` (already in repo)
- **Data Model**: `vsme-data-model-spec.json` (already in repo)
- **Constitution**: Defines tech stack and principles

### Technical Dependencies
- **Node.js**: 18+ (for frontend build)
- **JDK**: 17+ (for backend)
- **npm packages**: React, Zustand, Zod, TanStack Query, shadcn/ui, Tailwind
- **Maven/Gradle**: Spring Boot, Kotlin, Apache POI



## Scope

### In Scope (MVP)
✅ **All Basic Modules (B1-B11)** - Complete implementation
✅ **All Comprehensive Modules (C1-C9)** - Complete implementation  
✅ **All 797 Datapoints** - Form inputs with validation  
✅ **All 6 Wizard Steppers** - Based on `vsme-stepper-config.json`  
✅ **Mode Selection** - Basic vs. Comprehensive  
✅ **Auto-Save** - LocalStorage persistence  
✅ **Validation** - Zod schemas for all datapoints  
✅ **i18n** - English and German  
✅ **Excel Generation** - All 797 Named Ranges populated  
✅ **Array Datapoints** - All 10 repeating patterns  

### Out of Scope (Future Enhancements)
❌ **XBRL Generation** - Excel only for MVP  
❌ **Backend Database** - LocalStorage only, no server persistence  
❌ **User Authentication** - Single-user local app  
❌ **Multi-device Sync** - Single device only  
❌ **Report Templates** - One report at a time  
❌ **Undo/Redo** - Auto-save only  
❌ **Storybook** - Focus on functionality first  
❌ **Playwright E2E Tests** - Manual testing for MVP  
❌ **Cloud Backup** - LocalStorage only  

**Rationale**: MVP delivers a **complete, working VSME report tool** with all modules. Additional features (XBRL, database, auth) can be added incrementally after MVP validation.

