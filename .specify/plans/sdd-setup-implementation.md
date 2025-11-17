# SDD Setup & Implementation Plan

**Plan ID**: `sdd-setup-001`  
**Status**: In Progress  
**Created**: 2025-11-17  
**Objective**: Set up complete Spec-Driven Development infrastructure and implement VSME Easy Report application

---

## Overview

This plan establishes the foundation for Spec-Driven Development and implements the VSME Easy Report application following the constitution and data model specifications.

**Key Deliverables:**
1. Complete Spec structure in `.specify/specs/`
2. Code generation scripts
3. Frontend architecture scaffolding
4. Backend hexagonal architecture
5. Working Excel export functionality

---

## Prerequisites

✅ Constitution defined (`.specify/memory/constitution.md`)  
✅ Data model complete (`docs/data-model/vsme-data-model-spec.json`)  
✅ GitHub Spec Kit installed  
✅ Frontend dependencies installed  
✅ Backend dependencies installed  

---

## Task Breakdown

### Phase 1: Specifications & Architecture (Tasks 1-7)

#### Task 1: Create Architecture Specifications
**Goal**: Document frontend and backend architecture patterns

**Deliverables:**
- `.specify/specs/architecture/frontend-architecture.md`
- `.specify/specs/architecture/backend-architecture.md`
- `.specify/specs/architecture/data-flow.md`

**Acceptance Criteria:**
- Frontend DDD structure documented with folder layout
- Backend hexagonal architecture documented with ports/adapters
- Data flow from user input → Excel export documented

**Commit Message**: `docs(spec): add frontend and backend architecture specifications`

---

#### Task 2: Create Component Specifications
**Goal**: Document reusable UI components for Storybook

**Deliverables:**
- `.specify/specs/components/input-with-info.md`
- `.specify/specs/components/select-with-info.md`
- `.specify/specs/components/date-picker-with-info.md`

**Acceptance Criteria:**
- Each component spec includes props, behavior, and usage examples
- Validation strategy documented
- Auto-save behavior documented

**Commit Message**: `docs(spec): add form component specifications for Storybook`

---

#### Task 3: Create API Specification
**Goal**: Document REST API contract between frontend and backend

**Deliverables:**
- `.specify/specs/api/vsme-export-api.md`
- `.specify/specs/api/error-handling.md`

**Acceptance Criteria:**
- Request/response formats documented
- Error scenarios covered
- Type references to API types files

**Commit Message**: `docs(spec): add REST API specification for export endpoint`

---

#### Task 4: Create Validation Specification
**Goal**: Document validation strategy and rules

**Deliverables:**
- `.specify/specs/features/validation-strategy.md`
- `.specify/specs/features/field-validation-rules.md`

**Acceptance Criteria:**
- Field-level validation documented
- Module-level validation documented
- Error message strategy defined

**Commit Message**: `docs(spec): add validation strategy specification`

---

#### Task 5: Create i18n Specification
**Goal**: Document internationalization structure and strategy

**Deliverables:**
- `.specify/specs/features/internationalization.md`
- `.specify/specs/features/translation-keys.md`

**Acceptance Criteria:**
- Folder structure for de/en documented
- Translation key naming convention defined
- Generation strategy from data model documented

**Commit Message**: `docs(spec): add internationalization specification`

---

#### Task 6: Create State Management Specification
**Goal**: Document Zustand store structure and persist configuration

**Deliverables:**
- `.specify/specs/features/state-management.md`
- `.specify/specs/features/auto-save-strategy.md`

**Acceptance Criteria:**
- Store structure documented
- Persist configuration documented
- Auto-save timing documented (onBlur + debounced onChange)

**Commit Message**: `docs(spec): add state management and auto-save specifications`

---

#### Task 7: Create Excel Generation Specification
**Goal**: Document Apache POI integration and Named Range mapping

**Deliverables:**
- `.specify/specs/backend/excel-generation.md`
- `.specify/specs/backend/named-range-mapping.md`
- `.specify/specs/backend/template-loading.md`

**Acceptance Criteria:**
- Template loading strategy documented (singleton at startup)
- Named Range resolution process documented
- Repeating data (array) handling documented

**Commit Message**: `docs(spec): add Excel generation specifications for backend`

---

### Phase 2: Code Generation Scripts (Tasks 8-11)

#### Task 8: Create Zod Schema Generator
**Goal**: Generate Zod validation schemas from data model

**Deliverables:**
- `scripts/generate-zod-schemas.ts`
- Generated schemas in `frontend/src/domains/{module}/schemas/`

**Acceptance Criteria:**
- Script reads `docs/data-model/vsme-data-model-spec.json`
- Generates Zod schema per module
- Handles all dataTypes (text, number, date, boolean, select, table)
- Generated code is TypeScript valid

**Commit Message**: `feat(scripts): add Zod schema generator from data model`

---

#### Task 9: Create i18n Key Extractor
**Goal**: Extract translation keys from data model

**Deliverables:**
- `scripts/generate-i18n-keys.ts`
- Generated JSON files in `frontend/src/i18n/{lang}/modules/`

**Acceptance Criteria:**
- Extracts all labels from data model
- Generates de.json and en.json per module
- Includes validation messages
- Maintains hierarchical structure

**Commit Message**: `feat(scripts): add i18n key extraction from data model`

---

#### Task 10: Create Type Generator
**Goal**: Generate TypeScript interfaces from data model

**Deliverables:**
- `scripts/generate-types.ts`
- Generated types in `frontend/src/domains/{module}/types.ts`

**Acceptance Criteria:**
- Generates interface per module
- Handles optional fields
- Handles repeating data (arrays)
- References vsme-api-types.ts

**Commit Message**: `feat(scripts): add TypeScript type generator from data model`

---

#### Task 11: Create Domain Scaffolding Script
**Goal**: Generate folder structure for all VSME domains

**Deliverables:**
- `scripts/scaffold-domains.ts`
- Domain folders created with base files

**Acceptance Criteria:**
- Creates folder per module (B1-B11, C1-C9)
- Generates: components/, hooks/, schemas/, types.ts
- Adds index.ts barrel exports
- Creates README.md per domain

**Commit Message**: `feat(scripts): add domain scaffolding generator`

---

### Phase 3: Frontend Foundation (Tasks 12-17)

#### Task 12: Setup Zustand Store with Persist
**Goal**: Implement state management with LocalStorage persistence

**Deliverables:**
- `frontend/src/stores/vsme-report-store.ts`
- `frontend/src/stores/persist-config.ts`

**Acceptance Criteria:**
- Store follows constitution structure
- Persist middleware configured
- Auto-save functions implemented
- Hydration on mount works

**Commit Message**: `feat(frontend): implement Zustand store with persist middleware`

---

#### Task 13: Setup i18next Configuration
**Goal**: Configure internationalization with generated keys

**Deliverables:**
- `frontend/src/i18n/config.ts`
- `frontend/src/i18n/de/common.json`
- `frontend/src/i18n/en/common.json`

**Acceptance Criteria:**
- i18next initialized with de/en
- Language switching works
- Lazy loading configured for module translations
- Default language is German

**Commit Message**: `feat(frontend): setup i18next with de/en language support`

---

#### Task 14: Setup TanStack Query
**Goal**: Configure TanStack Query for API calls

**Deliverables:**
- `frontend/src/lib/query-client.ts`
- `frontend/src/services/export-service.ts`

**Acceptance Criteria:**
- QueryClient configured
- Export mutation implemented
- Error handling configured
- Retry logic defined

**Commit Message**: `feat(frontend): setup TanStack Query for API integration`

---

#### Task 15: Implement Form Components
**Goal**: Create reusable form components with auto-save

**Deliverables:**
- Enhanced `input-with-info.tsx` with auto-save
- Enhanced `select-with-info.tsx` with auto-save
- Enhanced `date-picker-with-info.tsx` with auto-save

**Acceptance Criteria:**
- onBlur triggers validation + save
- onChange debounced save (900ms)
- Info tooltip displays on hover
- Validation errors displayed
- Storybook stories created

**Commit Message**: `feat(frontend): implement form components with auto-save`

---

#### Task 16: Setup Storybook
**Goal**: Configure Storybook for component documentation

**Deliverables:**
- `.storybook/main.ts` configured
- Stories for all form components
- Storybook builds successfully

**Acceptance Criteria:**
- All form components have stories
- Different states shown (empty, filled, error)
- i18n works in Storybook
- Accessible via `npm run storybook`

**Commit Message**: `feat(frontend): setup Storybook with form component stories`

---

#### Task 17: Scaffold Domain Folders
**Goal**: Create folder structure for all VSME modules

**Deliverables:**
- Domain folders for B1, B3, B8 (initial implementation)
- Placeholder folders for remaining modules

**Acceptance Criteria:**
- Run scaffolding script
- Each domain has: components/, hooks/, schemas/, types.ts
- Base schemas generated
- Base types generated

**Commit Message**: `feat(frontend): scaffold domain folders for VSME modules`

---

### Phase 4: Backend Foundation (Tasks 18-23)

#### Task 18: Setup Hexagonal Architecture Structure
**Goal**: Create folder structure following hexagonal architecture

**Deliverables:**
- Folder structure: domain/, adapter/, application/, dto/
- Base package structure

**Acceptance Criteria:**
- Follows constitution architecture spec
- Clear separation of concerns
- Domain has no external dependencies
- Ports defined as interfaces

**Commit Message**: `feat(backend): setup hexagonal architecture folder structure`

---

#### Task 19: Implement Domain Models
**Goal**: Create domain entities for VSME modules

**Deliverables:**
- `backend/src/main/kotlin/org/example/backend/domain/model/` classes

**Acceptance Criteria:**
- Module, Disclosure, Datapoint entities
- Immutable data classes
- Validation logic in domain

**Commit Message**: `feat(backend): implement VSME domain models`

---

#### Task 20: Define Ports
**Goal**: Create port interfaces for hexagonal architecture

**Deliverables:**
- `domain/ports/inbound/ExportReportUseCase.kt`
- `domain/ports/inbound/ValidateReportUseCase.kt`
- `domain/ports/outbound/ExcelGenerationPort.kt`
- `domain/ports/outbound/TemplateLoaderPort.kt`

**Acceptance Criteria:**
- All ports are interfaces
- Clear contracts defined
- No implementation details
- Documented with KDoc

**Commit Message**: `feat(backend): define hexagonal architecture ports`

---

#### Task 21: Implement Template Loader Adapter
**Goal**: Load VSME Excel template at startup

**Deliverables:**
- `adapter/outbound/template/FileSystemTemplateLoader.kt`
- Configuration to load template as singleton

**Acceptance Criteria:**
- Loads `VSME-Digital-Template-1.1.0.xlsx` from root
- Singleton bean created at startup
- Template kept in memory
- Thread-safe access

**Commit Message**: `feat(backend): implement Excel template loader adapter`

---

#### Task 22: Implement Excel Generation Adapter
**Goal**: Implement Apache POI adapter for Excel generation

**Deliverables:**
- `adapter/outbound/excel/ApachePOIExcelGenerator.kt`
- Named Range resolution logic
- Row iteration for repeating data

**Acceptance Criteria:**
- Implements ExcelGenerationPort
- Resolves all 797 Named Ranges
- Writes values to correct cells
- Handles repeating data (arrays)
- Clones template for each request

**Commit Message**: `feat(backend): implement Apache POI Excel generation adapter`

---

#### Task 23: Implement REST Controller
**Goal**: Create REST endpoint for Excel export

**Deliverables:**
- `adapter/inbound/rest/VsmeExportController.kt`
- Request/response DTOs
- Error handling

**Acceptance Criteria:**
- POST /api/vsme/export endpoint
- Accepts ExcelExportRequest
- Returns ExcelExportResponse with Base64 Excel
- Validation errors returned
- CORS configured

**Commit Message**: `feat(backend): implement REST controller for Excel export`

---

### Phase 5: Integration & Testing (Tasks 24-27)

#### Task 24: Implement B1 Module (End-to-End)
**Goal**: Complete implementation of B1 (Basis for Preparation) module

**Deliverables:**
- B1 form components
- B1 Zod schemas
- B1 i18n translations
- B1 Excel mapping

**Acceptance Criteria:**
- All B1 datapoints implemented
- Form validation works
- Auto-save works
- Excel export includes B1 data
- E2E test passes

**Commit Message**: `feat: implement B1 Basis for Preparation module end-to-end`

---

#### Task 25: Implement B3 Module (End-to-End)
**Goal**: Complete implementation of B3 (Energy & GHG) module

**Deliverables:**
- B3 form components
- B3 Zod schemas
- B3 i18n translations
- B3 Excel mapping

**Acceptance Criteria:**
- All B3 datapoints implemented
- Numeric validations work
- Units displayed correctly
- Excel export includes B3 data
- E2E test passes

**Commit Message**: `feat: implement B3 Energy and GHG module end-to-end`

---

#### Task 26: Implement Wizard Navigation
**Goal**: Create stepper navigation between modules

**Deliverables:**
- Enhanced `Wizard.tsx` with stepper config
- Navigation guards with validation
- Progress persistence

**Acceptance Criteria:**
- 6 steppers implemented (per stepper-config)
- Forward navigation validates current module
- Backward navigation always allowed
- Progress saved to store
- Breadcrumb shows completion

**Commit Message**: `feat(frontend): implement wizard navigation with validation guards`

---

#### Task 27: Integration Testing
**Goal**: End-to-end testing of complete flow

**Deliverables:**
- E2E test: Fill form → Generate Excel → Validate content
- Integration test: Frontend → Backend → Excel
- Validation test: All error scenarios

**Acceptance Criteria:**
- User can complete Basic Report
- Excel file generated correctly
- All Named Ranges populated
- Validation prevents invalid submission
- LocalStorage persistence works

**Commit Message**: `test: add end-to-end integration tests`

---

## Success Metrics

- [ ] All 27 tasks completed
- [ ] All specs in `.specify/specs/` created
- [ ] Code generation scripts working
- [ ] Frontend following DDD structure
- [ ] Backend following hexagonal architecture
- [ ] B1 and B3 modules fully implemented
- [ ] Excel export generating valid VSME reports
- [ ] Auto-save working (onBlur + debounced onChange)
- [ ] LocalStorage persistence working
- [ ] All tests passing

---

## Timeline Estimate

- **Phase 1 (Specs)**: 2-3 days
- **Phase 2 (Scripts)**: 2-3 days
- **Phase 3 (Frontend)**: 5-7 days
- **Phase 4 (Backend)**: 5-7 days
- **Phase 5 (Integration)**: 3-5 days

**Total**: 17-25 days (3-5 weeks)

---

## Dependencies

- Constitution ratified ✅
- Data model complete ✅
- Excel template available ✅
- Development environment setup ✅

---

## Next Steps

1. **Start with Task 1**: Create architecture specifications
2. **One task per session**: Focus and commit
3. **Review after Phase 1**: Ensure specs are clear before coding
4. **Iterate**: Adjust plan based on learnings

---

**Plan Owner**: Development Team  
**Last Updated**: 2025-11-17

