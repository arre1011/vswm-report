# Backend Excel Integration Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2025-11-17  
**Type**: Requirements Specification

---

## Overview

This specification defines the **requirements** for backend Excel report generation. It describes **WHAT** the system must achieve, not **HOW** to implement it.

---

## 1. Requirements

### R1: Template Loading
**What**: The VSME Excel template must be loaded efficiently and be available for all export requests.

**Why**: Avoid loading the 8MB template file on every request (performance).

**Functional Requirements**:
- Template file: `VSME-Digital-Template-1.1.0.xlsx` (root directory)
- Load template once at application startup
- Keep template in memory for duration of application lifecycle
- All export requests use the same template instance (but thread-safe copies)

**Non-Functional Requirements**:
- **Performance**: Template loading ≤ 500ms at startup
- **Memory**: Single template in memory (~8-10 MB)
- **Thread-Safety**: Multiple concurrent requests must not corrupt template

**Acceptance Criteria**:
- [ ] Template loads successfully at Spring Boot startup
- [ ] Application logs confirm template loaded (sheet count, named ranges count)
- [ ] If template file missing/corrupt, application fails to start with clear error
- [ ] Multiple concurrent requests do not interfere with each other
- [ ] Memory usage stable over time (no leaks from template cloning)

---

### R2: Named Range Resolution
**What**: Map datapoint values from frontend request to specific cells in Excel via Named Ranges.

**Why**: The VSME template uses 797 Named Ranges to identify data entry points. Direct cell addressing (e.g., "D3") is fragile and error-prone.

**Functional Requirements**:
- Read datapoint-to-Named Range mappings from `docs/data-model/vsme-data-model-spec.json`
- Resolve Named Range to actual cell reference at runtime
- Write value to resolved cell based on dataType
- Support all dataTypes: text, number, date, boolean, select, url, email

**Data Type Handling**:
| DataType | Excel Cell Type | Validation |
|----------|----------------|------------|
| text, textarea, url, email | String | None (write as-is) |
| number | Numeric | Must be valid number |
| date | String (YYYY-MM-DD) | Must match date format |
| boolean | Boolean | true/false |
| select | String | Value from allowed options |

**Error Scenarios**:
- Named Range not found in template → Clear error message
- Datapoint has no mapping → Clear error message
- Invalid data type → Clear error message with expected type

**Acceptance Criteria**:
- [ ] All 797 Named Ranges from data model are loaded at startup
- [ ] Lookup is fast (O(1) via HashMap or similar)
- [ ] Writing "Test GmbH" to datapoint "entityName" writes to correct cell. In the directory backend/src/test/kotlin is a semple Efrag Excel semple templed it is pre field we can us it for testing. You can take the Values from the Excel and then use it as test date. Give that in the Integrationtest and test the endpoint of the backend wich generate the excel. When ypu got the excel back you can compare the Efrag pre filed Excel Sample tamplade with that which you got from the endpoint and it the values should be the same.
- [ ] All dataTypes write correctly to their target cells
- [ ] Invalid Named Range throws meaningful exception
- [ ] Missing datapoint mapping throws meaningful exception

---

### R3: Repeating Data (Arrays) Handling
**What**: Write arrays/lists to multiple Excel rows.

**Why**: Some disclosures require multiple entries (e.g., list of sites, list of subsidiaries).

**Functional Requirements**:
- Read repeating data patterns from `docs/data-model/vsme-repeating-data-patterns.json`
- Each pattern defines: excelStartRow, maxRows, columns
- Write each array item to a separate row
- Respect maxRows limit

**Example Pattern**:
```json
{
  "patternId": "list-of-sites",
  "excelStartRow": 109,
  "maxRows": 25,
  "columns": [
    { "datapointId": "siteId", "excelColumn": "C" },
    { "datapointId": "siteName", "excelColumn": "D" },
    { "datapointId": "siteCity", "excelColumn": "F" }
  ]
}
```

**Row Iteration Logic**:
- Item 1 → Row 109
- Item 2 → Row 110
- Item N → Row (109 + N - 1)

**Validation**:
- Array length ≤ maxRows
- All required columns present

**Acceptance Criteria**:
- [ ] Array with 3 items writes to 3 consecutive rows
- [ ] Columns map to correct Excel columns (C, D, F, etc.)
- [ ] Exceeding maxRows throws validation error
- [ ] Empty array writes nothing (no error)
- [ ] All 10 repeating patterns from data model supported

---

### R4: Complete Report Generation Flow
**What**: End-to-end process from request to Excel file.

**Flow**:
```
Request → Validate → Clone Template → Write Data → Response
```

**Input**: `ExcelExportRequest` (JSON)
- reportMetadata
- basicModules[] (array of ModuleDataRequest)
- comprehensiveModules[] (optional array)

**Output**: `ExcelExportResponse` (JSON)
- success: boolean
- message: string
- timestamp: string
- excelFileBase64: string (if success)
- validationErrors: array (if validation fails)

**Acceptance Criteria**:
- [ ] Valid request generates Excel file
- [ ] Excel file is valid (opens in Microsoft Excel)
- [ ] All written values are correct (manual verification)
- [ ] Invalid request returns validation errors (not 500 error)
- [ ] Large requests (all modules filled) complete in < 3 seconds

---

## 3. Architecture Guidance

**Recommended Pattern**: Hexagonal Architecture

**Key Design Principles**:
- Single Responsibility: Each component has one job
- Separation of Concerns: Config loading ≠ Writing ≠ API
- Thread-Safe: No shared mutable state


## 4. Data Model References

**Primary**: `docs/data-model/vsme-data-model-spec.json`  
**Secondary**: `docs/data-model/vsme-repeating-data-patterns.json`  
**Template**: `VSME-Digital-Template-1.1.0.xlsx`  
**DTOs**: `backend/src/main/kotlin/org/example/backend/dto/VsmeReportDto.kt`

---