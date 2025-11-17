# VSME Data Model - Visual Documentation

This document provides visual representations of the VSME data model hierarchy and data flows using Mermaid diagrams.

## Table of Contents

1. [Overall Report Structure](#1-overall-report-structure)
2. [Module Detail View (B3 Example)](#2-module-detail-view-b3-example)
3. [Frontend-Backend Data Flow](#3-frontend-backend-data-flow)
4. [Named Range Mapping Process](#4-named-range-mapping-process)
5. [Stepper Navigation Flow](#5-stepper-navigation-flow)
6. [Repeating Data Structure](#6-repeating-data-structure)

---

## 1. Overall Report Structure

High-level hierarchy of the VSME report data model following EFRAG terminology.

```mermaid
graph TD
    A[VSME Report] --> B[Metadata]
    A --> C[Core Report]
    A --> D[Steppers Configuration]
    
    B --> B1[Version]
    B --> B2[Standard: VSME 1.1.0]
    B --> B3[Languages: en, de]
    
    C --> C1[Basic Modules<br/>B1-B11]
    C --> C2[Comprehensive Modules<br/>C1-C9]
    
    C1 --> C1A[B1: Basis for Preparation]
    C1 --> C1B[B3: Energy & GHG]
    C1 --> C1C[B8: Workforce]
    C1 --> C1D[B11: Anti-Corruption]
    C1 --> C1E[...]
    
    C2 --> C2A[C1: Strategy]
    C2 --> C2B[C3: GHG Targets]
    C2 --> C2C[C6: Human Rights]
    C2 --> C2D[...]
    
    D --> D1[Introduction Stepper]
    D --> D2[General Info Stepper]
    D --> D3[Environmental Stepper]
    D --> D4[Social Stepper]
    D --> D5[Governance Stepper]
    D --> D6[Review Stepper]
    
    style A fill:#10b981,color:#fff
    style C fill:#3b82f6,color:#fff
    style C1 fill:#8b5cf6,color:#fff
    style C2 fill:#f59e0b,color:#fff
```

---

## 2. Module Detail View (B3 Example)

Detailed structure of a single module showing the hierarchy: Module → Disclosure → Datapoint → Excel Named Range.

```mermaid
graph TD
    M[Module B3:<br/>Energy and GHG Emissions] --> D1[Disclosure 1:<br/>Total Energy Consumption]
    M --> D2[Disclosure 2:<br/>GHG Emissions]
    M --> D3[Disclosure 3:<br/>GHG Intensity]
    
    D1 --> DP1[Datapoint: totalEnergyConsumption]
    DP1 --> DP1A[excelNamedRange:<br/>TotalEnergyConsumption]
    DP1 --> DP1B[dataType: number]
    DP1 --> DP1C[unit: MWh]
    DP1 --> DP1D[required: true]
    DP1A --> E1[Excel:<br/>'Environmental Disclosures'!$G$5]
    
    D2 --> DP2[Datapoint: scope1Emissions]
    D2 --> DP3[Datapoint: scope2EmissionsLocation]
    D2 --> DP4[Datapoint: scope3Emissions]
    
    DP2 --> DP2A[excelNamedRange:<br/>TotalGrossScope1GreenhouseGasEmissions]
    DP2A --> E2[Excel:<br/>'Environmental Disclosures'!$D$18]
    
    DP3 --> DP3A[excelNamedRange:<br/>TotalGrossLocationBasedGHGEmissions]
    DP3A --> E3[Excel:<br/>'Environmental Disclosures'!$D$22]
    
    D3 --> DP5[Datapoint: ghgIntensityPerTurnover]
    DP5 --> DP5A[excelNamedRange:<br/>GreenhouseGasEmissionIntensityPerTurnover]
    DP5A --> E4[Excel:<br/>'Environmental Disclosures'!$D$64]
    
    style M fill:#10b981,color:#fff
    style D1 fill:#3b82f6,color:#fff
    style D2 fill:#3b82f6,color:#fff
    style D3 fill:#3b82f6,color:#fff
    style DP1 fill:#8b5cf6,color:#fff
    style DP2 fill:#8b5cf6,color:#fff
    style DP3 fill:#8b5cf6,color:#fff
    style DP5 fill:#8b5cf6,color:#fff
```

---

## 3. Frontend-Backend Data Flow

Complete data flow from user input in the frontend to Excel file generation in the backend.

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Frontend<br/>(TypeScript)
    participant Zustand as Zustand Store
    participant API as API Client
    participant Backend as Spring Boot Backend<br/>(Kotlin)
    participant ExcelService as Excel Service
    participant Template as VSME Excel Template
    
    User->>Frontend: Fills form in wizard
    Frontend->>Zustand: Updates store state
    
    User->>Frontend: Clicks "Export Excel"
    Frontend->>Zustand: Retrieves all data
    Zustand-->>Frontend: Complete report data
    
    Frontend->>Frontend: Validates data
    Frontend->>Frontend: Transforms to ExcelExportRequest
    
    Frontend->>API: POST /api/vsme/export<br/>(ExcelExportRequest)
    API->>Backend: HTTP Request
    
    Backend->>Backend: Validates request
    Backend->>Backend: Extracts datapoints
    
    Backend->>ExcelService: generateExcel(request)
    ExcelService->>Template: Load template
    Template-->>ExcelService: Workbook loaded
    
    loop For each module
        loop For each datapoint
            ExcelService->>ExcelService: Get Named Range
            ExcelService->>Template: Write value to cell
        end
    end
    
    loop For each repeating data
        ExcelService->>ExcelService: Iterate rows
        ExcelService->>Template: Write array items
    end
    
    ExcelService->>ExcelService: Save workbook to bytes
    ExcelService->>ExcelService: Encode to Base64
    ExcelService-->>Backend: Base64 Excel string
    
    Backend->>Backend: Create ExcelExportResponse
    Backend-->>API: HTTP Response (JSON)
    API-->>Frontend: ExcelExportResponse
    
    Frontend->>Frontend: Decode Base64
    Frontend->>Frontend: Create Blob
    Frontend->>User: Trigger download
    User->>User: Receives VSME-Report.xlsx
    
    style User fill:#10b981,color:#fff
    style Frontend fill:#3b82f6,color:#fff
    style Backend fill:#8b5cf6,color:#fff
    style ExcelService fill:#f59e0b,color:#fff
```

---

## 4. Named Range Mapping Process

How datapoints are mapped to Excel Named Ranges and written to specific cells.

```mermaid
graph LR
    A[User Input:<br/>entityName = 'Acme GmbH'] --> B[Frontend Data:<br/>datapointId: 'entityName'<br/>value: 'Acme GmbH']
    
    B --> C[API Request:<br/>ExcelExportRequest]
    
    C --> D[Backend Processing]
    
    D --> E[Lookup Mapping:<br/>datapointId → Named Range]
    
    E --> F[Named Range:<br/>'NameOfReportingEntity']
    
    F --> G[Resolve to Cell:<br/>'General Information'!$D$3]
    
    G --> H[Write to Excel:<br/>Sheet: General Information<br/>Cell: D3<br/>Value: 'Acme GmbH']
    
    H --> I[Excel File with<br/>populated data]
    
    style A fill:#10b981,color:#fff
    style B fill:#3b82f6,color:#fff
    style F fill:#8b5cf6,color:#fff
    style H fill:#f59e0b,color:#fff
    style I fill:#ef4444,color:#fff
```

---

## 5. Stepper Navigation Flow

User navigation through the wizard interface showing the stepper sequence.

```mermaid
graph TD
    Start([User starts application]) --> S1
    
    S1[Stepper 1:<br/>Introduction<br/><i>Informational</i>] --> S2
    
    S2[Stepper 2:<br/>General Information<br/><i>Core - B1, B2</i>] --> Check1{Comprehensive<br/>selected?}
    
    Check1 -->|Yes| S2C[Show C1, C2 modules]
    Check1 -->|No| S3
    S2C --> S3
    
    S3[Stepper 3:<br/>Environmental Disclosures<br/><i>Core - B3-B7</i>] --> Check2{Comprehensive<br/>selected?}
    
    Check2 -->|Yes| S3C[Show C3, C4 modules]
    Check2 -->|No| S4
    S3C --> S4
    
    S4[Stepper 4:<br/>Social Disclosures<br/><i>Core - B8-B10</i>] --> Check3{Comprehensive<br/>selected?}
    
    Check3 -->|Yes| S4C[Show C5, C6, C7 modules]
    Check3 -->|No| S5
    S4C --> S5
    
    S5[Stepper 5:<br/>Governance Disclosures<br/><i>Core - B11</i>] --> Check4{Comprehensive<br/>selected?}
    
    Check4 -->|Yes| S5C[Show C8, C9 modules]
    Check4 -->|No| S6
    S5C --> S6
    
    S6[Stepper 6:<br/>Review & Export<br/><i>Validation</i>] --> Validate{Data<br/>valid?}
    
    Validate -->|No| ShowErrors[Show validation errors]
    ShowErrors --> Back[User goes back to fix]
    Back --> S2
    
    Validate -->|Yes| Export[Export Excel button enabled]
    Export --> Download[User downloads Excel]
    Download --> End([Complete])
    
    style S1 fill:#94a3b8,color:#000
    style S2 fill:#10b981,color:#fff
    style S3 fill:#3b82f6,color:#fff
    style S4 fill:#8b5cf6,color:#fff
    style S5 fill:#f59e0b,color:#fff
    style S6 fill:#ef4444,color:#fff
    style End fill:#22c55e,color:#fff
```

---

## 6. Repeating Data Structure

How repeating/table data (arrays) are structured and mapped to Excel rows.

```mermaid
graph TD
    A[User adds multiple sites] --> B[Frontend Array:<br/>listOfSites]
    
    B --> C[Site 1:<br/>siteId: 'HQ-01'<br/>siteName: 'Headquarters'<br/>siteAddress: 'Main St 1'<br/>siteCity: 'Berlin'<br/>siteCountry: 'Germany']
    
    B --> D[Site 2:<br/>siteId: 'FAC-02'<br/>siteName: 'Factory'<br/>siteAddress: 'Industrial Rd 5'<br/>siteCity: 'Munich'<br/>siteCountry: 'Germany']
    
    B --> E[Site 3:<br/>...]
    
    C --> F[Backend Processing]
    D --> F
    E --> F
    
    F --> G[Configuration:<br/>excelStartRow: 109<br/>maxRows: 25<br/>sheet: 'General Information']
    
    G --> H[Map Site 1 to Row 109]
    G --> I[Map Site 2 to Row 110]
    G --> J[Map Site 3 to Row 111]
    
    H --> K[Write columns:<br/>C: siteId<br/>D: siteName<br/>D: siteAddress<br/>F: siteCity<br/>G: siteCountry]
    
    I --> L[Write same columns<br/>to next row]
    
    J --> M[Continue for all sites...]
    
    K --> N[Excel with populated<br/>site table]
    L --> N
    M --> N
    
    style A fill:#10b981,color:#fff
    style B fill:#3b82f6,color:#fff
    style F fill:#8b5cf6,color:#fff
    style N fill:#ef4444,color:#fff
```

---

## EFRAG Terminology Reference

The diagrams use the official EFRAG VSME terminology:

- **Module**: Top-level reporting category (e.g., B1, B3, C1)
- **Disclosure**: Specific reporting requirement within a module (e.g., "Total Energy Consumption")
- **Datapoint**: Individual data field that collects a specific value (e.g., `entityName`, `scope1Emissions`)
- **Named Range**: Excel named cell/range that the datapoint maps to for backend processing
- **Stepper**: UI component in the wizard that groups related modules

---

## Legend

```mermaid
graph LR
    A[Component] --> B[Process]
    B --> C[Decision]
    C --> D[Result]
    
    style A fill:#10b981,color:#fff
    style B fill:#3b82f6,color:#fff
    style C fill:#8b5cf6,color:#fff
    style D fill:#f59e0b,color:#fff
```

- **Green**: User-facing elements, entry points
- **Blue**: Frontend components, data structures
- **Purple**: Backend processing, business logic
- **Orange**: Excel operations, file generation
- **Red**: Final outputs, downloads
- **Gray**: Informational, read-only

