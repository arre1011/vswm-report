# VSME Easy Report Constitution

## Core Principles

### I. Domain-Driven Design (DDD)
The application follows Domain-Driven Design principles with domains organized by Report. Each domain is self-contained with its own components, hooks, schemas, and types. Shared components live in a separate layer to avoid coupling.

**Folder Structure:**
```
frontend/src/
├── domains/              # Domain logic (nach VSME-Modulen)
│   ├── report
├── shared/               # Shared across domains
│   ├── components/form/  # input-with-info, select-with-info, date-picker-with-info
│   └── ...
```

### II. EFRAG VSME Terminology (NON-NEGOTIABLE)
All code, comments, and documentation must use official EFRAG VSME terminology:
- **Module**: Top-level reporting category (e.g., B1, B3, C1)
- **Disclosure**: Specific reporting requirement within a module
- **Datapoint**: Individual data field (e.g., `entityName`, `scope1Emissions`)
- **Named Range**: Excel cell/range for backend mapping

The master data model is located in `docs/data-model/vsme-data-model-spec.json` and serves as the single source of truth for all domains, disclosures, and datapoints. In the directory `docs/data-model/` you will find also other important  

### III. Save Early, Save Quietly (NON-NEGOTIABLE)
User data must be persisted immediately to prevent data loss:
- **onBlur**: Trigger validation + save for every field
- **onChange**: Debounced save (900ms delay) for text inputs
- **LocalStorage**: All data persisted via Zustand Persist Middleware
- **Auto-hydration**: State automatically restored on page reload

**Implementation:**
```typescript
// Zustand store with persist
persist(
  (set, get) => ({...}),
  {
    name: 'vsme-report-state',
    storage: createJSONStorage(() => localStorage)
  }
)
```

### IV. Type Safety First
All data structures must be strongly typed:
- **Frontend**: TypeScript strict mode, Zod schemas for validation
- **Backend**: Kotlin data classes, compile-time type checking
- **API Contract**: Shared types between frontend and backend (`vsme-api-types.ts` ↔ `VsmeReportDto.kt`)

### V. Validation Strategy
Two-level validation approach:
1. **Field-level (onBlur)**: Immediate feedback, non-blocking
2. **Module-level (on Next)**: Complete validation, blocks navigation if invalid

Generated from data model with custom extensions for complex rules.

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript (strict mode)
- **State Management**: Zustand with Persist middleware
- **Forms**: React Hook Form
- **Validation**: Zod (schemas generated from data model)
- **API Client**: TanStack Query (v5)
- **UI Library**: shadcn/ui + Tailwind CSS
- **i18n**: i18next (German primary, English secondary)
- **Build Tool**: Vite

**Reusable Form Components:**
- `input-with-info.tsx` - Text input with tooltip
- `select-with-info.tsx` - Dropdown with tooltip
- `date-picker-with-info.tsx` - Date picker with tooltip

### Backend
- **Framework**: Spring Boot 3.x with Kotlin
- **Architecture**: Hexagonal (Ports & Adapters)
- **Excel Library**: Apache POI
- **Build Tool**: Gradle with Kotlin DSL
- **JDK**: 17 or higher

### Infrastructure
- **IaC**: Terraform (Azure)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

## Architecture Principles

### Frontend: Domain-Driven Hybrid Structure
```
src/
├── domains/              # Business domains (VSME modules)
│   ├── {module-name}/
│   │   ├── components/   # Module-specific components
│   │   ├── hooks/        # Module-specific hooks
│   │   ├── schemas/      # Zod validation schemas
│   │   └── types.ts      # Module types
├── shared/               # Cross-cutting concerns
│   ├── components/
│   │   ├── form/         # Form components with info tooltips
│   │   ├── ui/           # shadcn/ui components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Shared hooks
│   ├── services/         # API services (TanStack Query)
│   └── utils/            # Utilities
├── stores/               # Global state (Zustand)
├── i18n/                 # Translations (de, en)
└── App.tsx
```

### Backend: Hexagonal Architecture
```
backend/src/main/kotlin/org/example/backend/
├── domain/               # Core domain (no external dependencies)
│   ├── model/            # Domain entities
│   ├── ports/
│   │   ├── inbound/      # Use cases (ExportReportUseCase)
│   │   └── outbound/     # External interfaces (ExcelGenerationPort)
│   └── service/          # Domain logic
├── adapter/              # External adapters
│   ├── inbound/
│   │   └── rest/         # REST controllers
│   └── outbound/
│       ├── excel/        # Apache POI implementation
│       └── template/     # Template loading
├── application/          # Application orchestration
└── dto/                  # Data Transfer Objects
```

**Key Ports:**
1. **ExportReportUseCase** (inbound): Generate VSME Excel report
2. **ValidateReportUseCase** (inbound): Validate report data
3. **ExcelGenerationPort** (outbound): Excel file generation interface
4. **TemplateLoaderPort** (outbound): Load VSME Excel template

### Excel Template Handling
- Template file: `VSME-Digital-Template-1.1.0.xlsx` (root directory)
- **Load once at startup** (singleton bean)
- **Keep in memory** for performance
- **Clone template** for each export request
- **Thread-safe operations** required

**Named Range Mapping:** 
All 797 Named Ranges from the Excel template are mapped to datapoints in `docs/data-model/vsme-data-model-spec.json`. Backend writes values using Named Range resolution.

## Data Model

### Single Source of Truth
`docs/data-model/vsme-data-model-spec.json` contains:
- All 11 Basic Modules (B1-B11)
- All 9 Comprehensive Modules (C1-C9)
- All 797 Excel Named Ranges
- 10 Repeating Data Patterns
- Stepper configuration (6 steps)
- Complete type definitions

### Code Generation
Schemas, types, and i18n keys are **generated** from the data model:
```bash
npm run generate:schemas    # Generate Zod schemas
npm run generate:i18n       # Extract i18n keys
npm run generate:types      # Generate TypeScript types
```

## Internationalization (i18n)

### Languages
- **Primary**: German (de) - for German SMEs
- **Secondary**: English (en) - for international use

### Structure
```
src/i18n/
├── de/
│   ├── common.json
│   ├── modules/
│   │   ├── b1.json     # Basis for Preparation
│   │   ├── b3.json     # Energy & GHG
│   │   └── ...
│   └── validation.json
├── en/
│   └── (same structure)
└── config.ts
```

### Translation Keys
Generated from `docs/data-model/vsme-data-model-spec.json`:
- Module labels (e.g., `modules.b1.title`)
- Disclosure labels (e.g., `modules.b1.disclosures.xbrl_info.title`)
- Datapoint labels (e.g., `modules.b1.datapoints.entity_name.label`)
- Validation messages (e.g., `validation.required`, `validation.invalid_format`)

## Development Workflow

### Spec-Driven Development (SDD)
1. **Write Spec**: Define feature in `.specify/specs/`
2. **Generate Code**: Use scripts or AI to generate boilerplate
3. **Implement**: Fill in business logic
4. **Test**: Validate against spec
5. **Commit**: One feature per commit

### Commit Strategy
- One task = one commit
- Conventional Commits format: `feat:`, `fix:`, `docs:`, `refactor:`
- Reference task ID in commit message
- Each commit must pass linting and type checking

### Testing Strategy
- **Frontend**: Vitest for unit tests, Playwright for E2E
- **Backend**: JUnit 5 with Kotlin
- **Storybook**: For component documentation and testing
- Generated Excel files validated against VSME standard

## API Contract

### Endpoint
**POST** `/api/vsme/export`

### Request Format
```typescript
{
  reportMetadata: {
    reportDate: string (ISO 8601)
    reportVersion: string
    basisForPreparation: 'Basic Module Only' | 'Basic & Comprehensive'
    language: 'en' | 'de'
  },
  coreReport: {
    basicModules: ModuleDataRequest[]
    comprehensiveModules?: ModuleDataRequest[]
  }
}
```

### Response Format
```typescript
{
  success: boolean
  message: string
  timestamp: string
  excelFileBase64?: string  // Base64 encoded Excel file
  validationErrors?: ValidationError[]
}
```

**Type Definitions:** 
- Frontend: `frontend/src/types/vsme-api-types.ts`
- Backend: `backend/src/main/kotlin/org/example/backend/dto/VsmeReportDto.kt`

## Non-Functional Requirements

### Performance
- **Excel generation**: < 2 seconds for Basic Report
- **Auto-save**: Debounced to prevent excessive writes
- **Template caching**: Load once, reuse for all requests
- **Frontend bundle**: < 500 KB gzipped

### User Experience
- **Silent saving**: No loading spinners for auto-save
- **Optimistic updates**: UI updates immediately
- **Error recovery**: Previous state restored on page reload
- **Progress indication**: Stepper shows completion status

### Security
- **No sensitive data in LocalStorage**: Only report data (non-personal)
- **HTTPS only** in production
- **Input sanitization**: All user inputs validated and sanitized
- **CORS configuration**: Restricted to known origins

## Quality Gates

### Pre-Commit
- TypeScript compilation successful
- ESLint passes (frontend)
- Ktlint passes (backend)
- Prettier formatting applied

### Pre-Push
- All tests pass
- No console.errors in code
- i18n keys exist for all labels
- Storybook builds successfully

### Pre-Merge
- Code review approved
- Integration tests pass
- Generated Excel validated
- Documentation updated

## Governance

### Constitution Authority
This constitution supersedes all other development practices and guidelines. All code must comply with these principles. Violations require documented justification and approval.

### Amendment Process
1. Propose change with rationale
2. Discuss with team
3. Document impact and migration plan
4. Update constitution
5. Communicate to all developers

### Spec Updates
When requirements change:
1. Update specs first (`.specify/specs/`)
2. Update data model if needed (`docs/data-model/`)
3. Regenerate code (schemas, types, i18n)
4. Implement changes
5. Update documentation

**Version**: 1.0.0 | **Ratified**: 2025-11-17 | **Last Amended**: 2025-11-17
