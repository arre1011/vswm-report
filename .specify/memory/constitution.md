# VSME Easy Report Constitution

## Vision & Mission

### Vision Statement
**Making sustainability reporting accessible, understandable, and affordable for SMEs.**

Climate change is one of the greatest global challenges of our time. Companies of all sizes play an important role in limiting human-induced climate change. Small and medium-sized enterprises (SMEs) are increasingly required to disclose sustainability data - whether to be selected as suppliers for larger corporations or to obtain financing benefits from banks.

The **VSME standard** (Voluntary Sustainability Reporting Standard for SME) was created by EFRAG to provide a modular, simplified framework for CSRD-compliant sustainability reporting tailored to SME needs.

**Our vision:** With modern technology, we empower SMEs to create their VSME sustainability report **quickly, comprehensively, and cost-effectively** - thereby contributing to the fight against climate change through broader sustainability reporting.

> *"SMEs should be able to complete their VSME report within a few hours - without Excel skills, without translation problems, without consultants."*

👉 **Full Vision Document**: [`docs/vision.md`](../../docs/vision.md)

---

### Mission
Enable SMEs to create professional, compliant VSME sustainability reports through:

1. **🦯 Guided Wizard**: Step-by-step assistant with explanations, examples, and selection aids
2. **🗂️ Smart Forms**: Intuitive input masks that automatically show only relevant fields (Basic or Comprehensive)
3. **🇩🇪 Multilingual Support**: German primary, English secondary - removing language barriers
4. **✅ Real-time Validation**: Traffic light logic and hints for missing or contradictory information
5. **📦 Automated Excel Generation**: Correctly filled VSME Excel file (official format) ready for submission
6. **💾 Auto-Save**: Local storage with optional cloud backup, data reusable for following years
7. **📚 Integrated Help**: Short descriptions for every field, links to VSME standard

**Result**: SMEs complete their sustainability report in hours instead of weeks, at a fraction of the cost of traditional consulting.

👉 **Product Idea Document**: [`docs/Idea.md`](../../docs/Idea.md)

---

### Problem Statement

**Current Situation:**
The official VSME Excel template from EFRAG is comprehensive, technical, and predominantly in English - a significant barrier for many SMEs. Many input fields are unclear or irrelevant for the Basic Report. Often, expensive external consultants must be hired, or extensive internal expertise must be built up.

**Problems We Solve:**

| Problem | Our Solution |
|---------|-------------|
| ❌ **Complexity** | Simplified wizard, only relevant fields shown |
| ❌ **Language Barrier** | German translations, tooltips, plain language explanations |
| ❌ **Relevance** | Filter Basic vs. Comprehensive, hide unnecessary modules |
| ❌ **Cost** | Affordable SaaS (freemium model), no expensive all-in-one ESG tools |
| ❌ **Excel Skills Required** | No Excel knowledge needed, intuitive web forms |
| ❌ **Time-Consuming** | Hours instead of weeks, guided process |

**Market Gap:**
Existing sustainability/ESG reporting tools are oversized and expensive - designed for comprehensive EU standards (CSRD/ESRS, GRI), not for SME-focused VSME reports. Our software focuses **exclusively on VSME** - lightweight, affordable, specialized.

---

### Target Audience

**Primary Users:**
- 🏢 **Small and Medium Enterprises** (< 250 employees) required to create VSME reports
- 🇩🇪 **German SMEs** as initial focus (product in German language)
- 🌍 **International SMEs** (expandable via English version)

**Secondary Users:**
- 📊 **Consultants** supporting SMEs with sustainability reporting
- 🏛️ **Business Associations** bundling VSME reports for member companies
- 🏦 **Financial Institutions** requiring VSME reports for sustainable financing

**Business Model:**
- **Freemium**: Basic Report creation free, Excel export & premium features paid
- **SaaS Subscription**: Monthly/annual plans for recurring use
- **B2B Licensing**: For consultants, associations, and institutions

---

## Core Principles

### I. Domain-Driven Design (DDD)
The application follows Domain-Driven Design principles at the moment there is only one Domain this is report. The report is the whole VSME Datamodel. which you can find here docs/data-model/vsme-data-model-spec.json.

### II. EFRAG VSME Terminology (NON-NEGOTIABLE)
All code, comments, and documentation must use official EFRAG VSME terminology:
- **Module**: Top-level reporting category (e.g., B1, B3, C1)
- **Disclosure**: Specific reporting requirement within a module
- **Datapoint**: Individual data field (e.g., `entityName`, `scope1Emissions`)
- **Named Range**: Excel cell/range for backend mapping

The master data model is located in `docs/data-model/vsme-data-model-spec.json` and serves as the single source of truth for all domains, disclosures, and datapoints. 

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

## Architecture Principles

### Frontend: Domain-Driven Hybrid Structure
```
src/
├── domains/              # Business domain (VSME report)
│   ├── {report-name}/
│   │   ├── components/   # report components
│   │   ├── hooks/        # report hooks
│   │   ├── schemas/      # Zod validation schemas
│   │   └── types.ts      # report types
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
- **Primary**: English (en) - for international use
- **Secondary**: German (de) - for German SMEs

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

## References & Key Documents

### Vision & Product Documents
- 📄 **[`docs/vision.md`](../../docs/vision.md)**: Full vision statement, problem analysis, and strategic positioning
- 💡 **[`docs/Idea.md`](../../docs/Idea.md)**: Product idea, features, target audience, and business model
- 📊 **[`docs/data-model/`](../../docs/data-model/)**: Complete VSME data model and analysis

### Specifications
All feature specifications follow requirements-based format (WHAT & WHY, not HOW):

#### Backend Specifications
- 📦 **[`.specify/specs/backend/excel-integration.md`](../specs/backend/excel-integration.md)**
  - Template loading (singleton pattern)
  - Named Range resolution (797 mappings)
  - Repeating data handling (arrays/tables)
  - Complete report generation flow

#### Frontend Specifications
- 🗂️ **[`.specify/specs/features/state-management.md`](../specs/features/state-management.md)**
  - Report data persistence (LocalStorage)
  - Auto-save behavior (onBlur + debounced onChange)
  - Wizard state management
  - Validation state integration

#### Code Generation
- ⚙️ **[`.specify/specs/scripts/code-generation.md`](../specs/scripts/code-generation.md)**
  - Zod schema generation from data model
  - i18n key extraction (en/de)
  - TypeScript type generation

### Data Model (Single Source of Truth)
- 📋 **[`docs/data-model/vsme-data-model-spec.json`](../../docs/data-model/vsme-data-model-spec.json)**: Master specification (6705 lines)
  - All Basic Modules (B1-B11) with 797 datapoints
  - All Comprehensive Modules (C1-C9)
  - Complete Named Range mappings
  - 10 Repeating data patterns
  - Stepper configuration
  - Type definitions

### Excel Template
- 📊 **[`VSME-Digital-Template-1.1.0.xlsx`](../../VSME-Digital-Template-1.1.0.xlsx)**: Official EFRAG template
  - 13 sheets
  - 797 Named Ranges
  - Used as template for report generation

### Implementation Plans
- 📝 **[`.specify/plans/`](../plans/)**: Phased implementation roadmaps
- ✅ **[`.specify/tasks/`](../tasks/)**: Task tracking with dependencies and status

---

## Governance

### Constitution Authority
This constitution supersedes all other development practices and guidelines. All code must comply with these principles. Violations require documented justification and approval.

### Spec-First Development
All new features must follow this workflow:
1. **Spec First**: Write requirements specification in `.specify/specs/`
2. **Review**: Team reviews and approves spec
3. **Implement**: Develop according to spec (with implementation freedom)
4. **Verify**: Validate against acceptance criteria
5. **Document**: Update references if needed

### Spec Updates
When requirements change:
1. Update specs first (`.specify/specs/`)
2. Update data model if needed (`docs/data-model/`)
3. Regenerate code (schemas, types, i18n)
4. Implement changes
5. Update documentation

---

**Version**: 1.1.0 | **Ratified**: 2025-11-17 | **Last Amended**: 2025-11-17
