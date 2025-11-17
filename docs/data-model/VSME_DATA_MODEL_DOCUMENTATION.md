# VSME Easy Report - Data Model Documentation

**Version:** 1.0.0  
**Standard:** EFRAG VSME 1.1.0  
**Date:** November 17, 2025  
**Status:** Complete Specification for AI-Driven Development

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Introduction](#introduction)
3. [Data Model Overview](#data-model-overview)
4. [Terminology](#terminology)
5. [Hierarchical Structure](#hierarchical-structure)
6. [Module Specifications](#module-specifications)
7. [API Contract](#api-contract)
8. [Repeating Data Patterns](#repeating-data-patterns)
9. [Frontend Implementation](#frontend-implementation)
10. [Backend Implementation](#backend-implementation)
11. [Named Range Mapping](#named-range-mapping)
12. [Validation Rules](#validation-rules)
13. [Implementation Roadmap](#implementation-roadmap)
14. [File Index](#file-index)

---

## Executive Summary

This document provides the complete data model specification for **VSME Easy Report**, an application designed to simplify VSME (Voluntary Sustainability Reporting Standard for SME) report creation for small and medium-sized enterprises.

### Key Statistics

- **Total Modules:** 20 (11 Basic + 9 Comprehensive)
- **Total Disclosures:** 21
- **Total Excel Named Ranges:** 797
- **Repeating Data Patterns:** 10
- **UI Steppers:** 6
- **Supported Languages:** German (de), English (en)

### Design Principles

1. **EFRAG Terminology Compliance:** Uses official EFRAG VSME terminology (Module, Disclosure, Datapoint)
2. **AI-Optimized:** Clear hierarchical JSON structure for LLM processing
3. **Type-Safe:** Complete TypeScript and Kotlin type definitions
4. **Direct Mapping:** Every datapoint maps to Excel Named Ranges
5. **Scalable:** Array-based structures for dynamic/repeating data

---

## Introduction

### Purpose

The VSME Easy Report application addresses the challenges small and medium enterprises face when creating sustainability reports:

- **Complexity:** Official VSME Excel template is overwhelming
- **Language Barrier:** Template is in English; German SMEs need German interface
- **Cost:** Existing ESG reporting tools are expensive and over-featured

### Solution

A focused, wizard-based application that:
1. Guides users through VSME reporting step-by-step
2. Provides German translations and tooltips
3. Automatically generates correctly formatted VSME Excel files
4. Supports both Basic and Comprehensive reporting modules

---

## Data Model Overview

The data model follows a strict hierarchy based on EFRAG VSME official terminology:

```
Report
├── Metadata (version, standard, languages)
├── Core Report
│   ├── Basic Modules (B1-B11) [Required]
│   │   └── Disclosures
│   │       └── Datapoints
│   │           └── Excel Named Ranges
│   └── Comprehensive Modules (C1-C9) [Optional]
│       └── Disclosures
│           └── Datapoints
│               └── Excel Named Ranges
└── Steppers (UI configuration)
```

### Key Files

| File | Purpose |
|------|---------|
| `vsme-data-model-spec.json` | Complete unified specification (6,705 lines) |
| `vsme-schema-definition.json` | JSON Schema for validation |
| `vsme-basic-modules-mapping.json` | B1-B11 module mappings |
| `vsme-comprehensive-modules-mapping.json` | C1-C9 module mappings |
| `vsme-repeating-data-patterns.json` | Array/table structures |
| `vsme-stepper-config.json` | Wizard UI configuration |
| `VSME_DATA_MODEL_DIAGRAMS.md` | Mermaid visual diagrams |

---

## Terminology

### EFRAG VSME Official Terms

| Term | Definition | Example |
|------|------------|---------|
| **Module** | Top-level reporting category defined by VSME standard | B1 (Basis for Preparation), B3 (Energy & GHG), C1 (Strategy) |
| **Disclosure** | Specific reporting requirement within a module | "Total Energy Consumption", "List of Sites" |
| **Datapoint** | Individual data field collecting a specific value | `entityName`, `scope1Emissions`, `turnover` |
| **Named Range** | Excel named cell/range for backend mapping | `NameOfReportingEntity`, `TotalEnergyConsumption` |

### Application-Specific Terms

| Term | Definition |
|------|------------|
| **Stepper** | UI wizard step grouping related modules |
| **Core Report** | Basic + Comprehensive modules containing actual data |
| **Repeating Data** | Array/table structures (e.g., list of sites, list of subsidiaries) |

---

## Hierarchical Structure

### Module Codes

**Basic Modules (B1-B11)** - Required for all reports:
- **B1:** Basis for Preparation
- **B2:** Practices, Policies and Future Initiatives
- **B3:** Energy and Greenhouse Gas Emissions
- **B4:** Pollution of Air, Water and Soil
- **B5:** Biodiversity
- **B6:** Water
- **B7:** Resource Use, Circular Economy and Waste Management
- **B8:** Workforce - General Characteristics
- **B9:** Workforce - Health and Safety
- **B10:** Workforce - Remuneration, Collective Bargaining and Training
- **B11:** Convictions and Fines for Corruption and Bribery

**Comprehensive Modules (C1-C9)** - Optional, for detailed reporting:
- **C1:** Strategy: Business Model and Sustainability-Related Initiatives
- **C2:** Description of Practices, Policies and Future Initiatives
- **C3:** GHG Reduction Targets and Climate Transition
- **C4:** Climate Risks
- **C5:** Additional (General) Workforce Characteristics
- **C6:** Human Rights Policies and Processes
- **C7:** Severe Negative Human Rights Incidents
- **C8:** Revenues from Certain Activities and EU Reference Benchmarks
- **C9:** Gender Diversity Ratio in Governance Body

---

## Module Specifications

### Example: B1 - Basis for Preparation

**Module Information:**
- **Module Code:** B1
- **Module ID:** module-b1
- **Type:** basic
- **Sheet:** General Information
- **Total Disclosures:** 4
- **Total Datapoints:** 30+

**Disclosures:**

1. **XBRL Information** (Required)
   - Entity Name, Identifier, Currency
   - Reporting Period (start/end dates)

2. **Basis for Preparation** (Required)
   - Module selection (Basic Only or Basic & Comprehensive)
   - Legal form, NACE code
   - Turnover, Employees, Country

3. **List of Subsidiaries** (Optional, Repeating)
   - Subsidiary name, identifier, country

4. **List of Sites** (Required, Repeating)
   - Site ID, name, address, city, country

**Key Datapoints:**

```json
{
  "datapointId": "entityName",
  "label": {
    "en": "Name of the reporting entity",
    "de": "Name des berichterstattenden Unternehmens"
  },
  "dataType": "text",
  "required": true,
  "excelNamedRange": "NameOfReportingEntity",
  "excelReference": "'General Information'!$D$3"
}
```

### Example: B3 - Energy and GHG Emissions

**Key Datapoints:**
- `totalEnergyConsumption` (MWh) - Required
- `scope1Emissions` (tCO2e) - Required
- `scope2EmissionsLocation` (tCO2e) - Required
- `scope3Emissions` (tCO2e) - Optional
- `ghgIntensityPerTurnover` (tCO2e/M€) - Required

---

## API Contract

### Frontend to Backend

**Endpoint:** `POST /api/vsme/export`

**Request Structure (TypeScript):**

```typescript
interface ExcelExportRequest {
  reportMetadata: {
    reportDate: string // ISO 8601
    reportVersion: string
    basisForPreparation: 'Basic Module Only' | 'Basic & Comprehensive'
    language: 'en' | 'de'
  }
  coreReport: {
    basicModules: ModuleDataRequest[]
    comprehensiveModules?: ModuleDataRequest[]
  }
}

interface ModuleDataRequest {
  moduleId: string
  moduleCode: string // e.g., "B1", "B3"
  datapoints: DatapointValueUnion[]
}
```

**Response Structure:**

```typescript
interface ExcelExportResponse {
  success: boolean
  message: string
  timestamp: string
  excelFileBase64?: string // Base64 encoded Excel
  validationErrors?: ValidationError[]
}
```

### Backend (Kotlin)

Corresponding Kotlin data classes are defined in:
`backend/src/main/kotlin/org/example/backend/dto/VsmeReportDto.kt`

---

## Repeating Data Patterns

### Pattern: List of Sites (B1)

**Configuration:**
- **Excel Start Row:** 109
- **Excel End Row:** 133
- **Max Rows:** 25
- **Required:** Yes

**Structure:**

```typescript
listOfSites: Array<{
  siteId: string
  siteName: string
  siteAddress: string
  siteCity: string
  siteCountry: string
}>
```

**Backend Mapping Strategy:**
1. Load Excel template
2. Navigate to "General Information" sheet
3. For each site in array:
   - Calculate target row = 109 + index
   - Write to columns: C (siteId), D (siteName, address), F (city), G (country)
4. Validate max 25 sites

### All Repeating Patterns

1. List of Subsidiaries (B1)
2. List of Sites (B1)
3. Sustainability Certifications (B1)
4. Energy Consumption Breakdown (B3)
5. Pollution Emissions by Pollutant (B4)
6. Sites in Biodiversity Areas (B5)
7. Waste Generated by Type (B7)
8. Materials Flow (B7)
9. Employees by Country (B8)
10. GHG Reduction Actions (C3)

---

## Frontend Implementation

### Technology Stack

- **Framework:** React + TypeScript
- **State Management:** Zustand
- **UI Library:** shadcn/ui + Tailwind CSS
- **Validation:** Zod
- **i18n:** i18next
- **Forms:** React Hook Form

### Type Definitions

Located in: `frontend/src/types/vsme-api-types.ts`

Key exports:
- `ExcelExportRequest`
- `ExcelExportResponse`
- `DatapointValue`
- `TableDatapointValue`
- Module-specific types (B1ModuleData, B3ModuleData, etc.)
- Helper functions: `convertToModuleDataRequest()`, `validateExportRequest()`, `downloadExcelFile()`

### Store Structure (Zustand)

```typescript
interface WizardState {
  currentStep: number
  data: {
    generalInformation: B1ModuleData
    environmental: B3ModuleData
    social: B8ModuleData
    governance: B11ModuleData
    // + comprehensive modules if selected
  }
  updateModule: (moduleCode: string, data: any) => void
  submitExport: () => Promise<ExcelExportResponse>
}
```

---

## Backend Implementation

### Technology Stack

- **Framework:** Spring Boot 3.x + Kotlin
- **Excel Library:** Apache POI
- **Build Tool:** Gradle

### Controller Endpoint

```kotlin
@RestController
@RequestMapping("/api/vsme")
class VsmeExportController(
    private val excelService: ExcelService
) {
    @PostMapping("/export")
    fun exportExcel(@RequestBody request: ExcelExportRequest): ExcelExportResponse {
        return excelService.generateExcel(request)
    }
}
```

### Excel Service Logic

1. **Load Template:** Load `VSME-Digital-Template-1.1.0.xlsx`
2. **Iterate Modules:** For each module in request
3. **Map Datapoints:** For each datapoint:
   - Lookup Named Range from mapping configuration
   - Resolve to actual cell reference
   - Write value to cell
4. **Handle Repeating Data:** For array/table datapoints:
   - Iterate starting from excelStartRow
   - Write each item to consecutive rows
5. **Save & Encode:** Convert workbook to bytes, encode to Base64
6. **Return Response:** Send Base64 string to frontend

### Named Range Resolution

```kotlin
fun writeDatapoint(workbook: Workbook, datapoint: DatapointValue) {
    val namedRange = workbook.getName(datapoint.excelNamedRange)
    val cellRef = namedRange.refersToFormula // e.g., "'General Information'!$D$3"
    
    val cell = getCellFromReference(workbook, cellRef)
    cell.setCellValue(datapoint.value)
}
```

---

## Named Range Mapping

### Total Named Ranges: 797

Named Ranges provide the bridge between datapoints and Excel cells.

**Example Mappings:**

| Datapoint ID | Named Range | Cell Reference |
|--------------|-------------|----------------|
| entityName | NameOfReportingEntity | 'General Information'!$D$3 |
| currency | CurrencyUsedInReport | 'General Information'!$D$5 |
| totalEnergyConsumption | TotalEnergyConsumption | 'Environmental Disclosures'!$G$5 |
| scope1Emissions | TotalGrossScope1GreenhouseGasEmissions | 'Environmental Disclosures'!$D$18 |
| numberOfEmployees | NumberOfEmployees | 'General Information'!$E$62 |

### Mapping Configuration Format

```json
{
  "datapointId": "entityName",
  "excelNamedRange": "NameOfReportingEntity",
  "excelReference": "'General Information'!$D$3",
  "dataType": "text",
  "required": true
}
```

---

## Validation Rules

### Frontend Validation (Zod)

- **Required Fields:** Check all required datapoints are filled
- **Data Types:** Validate number fields contain numbers, dates are valid, etc.
- **Min/Max Rows:** For repeating data, check minRows ≤ itemCount ≤ maxRows
- **Cross-References:** Validate referenced IDs exist (e.g., siteId in biodiversity disclosure)

### Backend Validation

- **Request Structure:** Validate ExcelExportRequest matches expected schema
- **Module Codes:** Verify module codes are valid (B1-B11, C1-C9)
- **Named Ranges:** Ensure all referenced Named Ranges exist in template
- **Data Types:** Convert and validate values before writing to Excel

---

## Implementation Roadmap

### Phase 1: Foundation (Completed ✓)
- [x] Extract complete VSME structure from Excel
- [x] Design hierarchical JSON schema
- [x] Map all Basic Modules (B1-B11)
- [x] Map all Comprehensive Modules (C1-C9)
- [x] Design repeating data structures
- [x] Define API contract (TypeScript + Kotlin)
- [x] Create stepper configuration
- [x] Generate Mermaid diagrams
- [x] Generate complete specifications
- [x] Create comprehensive documentation

### Phase 2: Backend Development (Next)
- [ ] Set up Spring Boot project structure
- [ ] Implement DTO classes from VsmeReportDto.kt
- [ ] Create ExcelService with Apache POI
- [ ] Implement Named Range resolution logic
- [ ] Handle repeating data (row iteration)
- [ ] Add validation logic
- [ ] Create REST controller endpoint
- [ ] Unit tests for Excel generation

### Phase 3: Frontend Development
- [ ] Set up React + TypeScript project
- [ ] Implement Zustand store with module data
- [ ] Create wizard stepper navigation
- [ ] Build form components for each module
- [ ] Implement repeating data (table) components
- [ ] Add Zod validation schemas
- [ ] Integrate i18next for German/English
- [ ] Connect to backend API
- [ ] Handle file download

### Phase 4: Integration & Testing
- [ ] End-to-end testing
- [ ] Validate generated Excel files
- [ ] Test all repeating data patterns
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Error handling improvements

### Phase 5: Deployment
- [ ] Docker containers (frontend + backend)
- [ ] Azure infrastructure setup (Terraform)
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## File Index

### Specification Files

| File | Lines | Description |
|------|-------|-------------|
| `vsme-data-model-spec.json` | 6,705 | **Master specification** - Complete unified data model |
| `vsme-schema-definition.json` | 369 | JSON Schema for validation |
| `vsme-basic-modules-mapping.json` | 717 | Detailed mapping of B1-B11 modules |
| `vsme-comprehensive-modules-mapping.json` | 498 | Detailed mapping of C1-C9 modules |
| `vsme-repeating-data-patterns.json` | 539 | Array/table structure definitions |
| `vsme-stepper-config.json` | ~200 | Wizard UI stepper configuration |
| `vsme-complete-structure.json` | 8,984 | Raw extracted Excel structure |

### Code Files

| File | Description |
|------|-------------|
| `frontend/src/types/vsme-api-types.ts` | TypeScript type definitions and API client |
| `backend/src/main/kotlin/org/example/backend/dto/VsmeReportDto.kt` | Kotlin data classes for backend |

### Documentation Files

| File | Description |
|------|-------------|
| `VSME_DATA_MODEL_DOCUMENTATION.md` | **This file** - Comprehensive documentation |
| `VSME_DATA_MODEL_DIAGRAMS.md` | Mermaid visual diagrams |
| `VSME_IMPLEMENTATION_PLAN.md` | Original implementation plan |
| `docs/vision.md` | Product vision and rationale |
| `docs/Idea.md` | Original product idea |

### Analysis Scripts

| File | Description |
|------|-------------|
| `extract_complete_vsme_structure.py` | Extracts all structure from Excel |
| `map_basic_modules.py` | Maps B1-B11 modules |
| `map_comprehensive_modules.py` | Maps C1-C9 modules |
| `analyze_excel_detailed.py` | Detailed Excel analysis |
| `analyze_excel_structure.py` | Structure extraction |

---

## Usage Guide

### For AI/LLM Development

This specification is optimized for AI-driven development:

1. **Start with `vsme-data-model-spec.json`** - Contains everything in one file
2. **Reference module mappings** for implementation details
3. **Use type definitions** directly in code generation
4. **Follow naming conventions** established in the spec
5. **Validate against schema** using `vsme-schema-definition.json`

### For Human Developers

1. **Read this documentation first** for high-level understanding
2. **Review Mermaid diagrams** for visual reference
3. **Examine specific module mappings** for implementation
4. **Use type definitions** for type-safe development
5. **Follow API contract** for frontend-backend integration

---

## Summary

This data model specification provides a complete, production-ready foundation for implementing the VSME Easy Report application. All 797 Excel Named Ranges are accounted for, all modules are mapped, and both frontend and backend types are defined.

The specification follows EFRAG VSME official terminology, is optimized for AI processing, and includes comprehensive documentation for both human and machine readers.

**Total Coverage:**
- ✓ All 11 Basic Modules (B1-B11)
- ✓ All 9 Comprehensive Modules (C1-C9)
- ✓ All 797 Named Ranges
- ✓ All 10 Repeating Data Patterns
- ✓ Complete API Contract (TypeScript + Kotlin)
- ✓ Complete UI Configuration (6 Steppers)
- ✓ Comprehensive Documentation

**Next Steps:** Begin Phase 2 (Backend Development) using this specification as the source of truth.

---

*Document Version: 1.0.0*  
*Last Updated: November 17, 2025*  
*Specification Status: Complete*

