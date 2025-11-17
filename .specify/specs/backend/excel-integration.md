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
- [ ] Writing "Test GmbH" to datapoint "entityName" writes to correct cell
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
Request → Validate → Clone Template → Write Data → Convert to Bytes → Encode Base64 → Response
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

## 2. Technical Constraints

### C1: Technology Stack
**Must Use**:
- Apache POI library for Excel manipulation
- Spring Boot dependency injection
- Kotlin as implementation language

**Reasoning**: Already defined in constitution, proven libraries

### C2: Template Integrity
**Must Not**:
- Modify the original template file on disk
- Change template structure (sheets, Named Ranges)
- Alter template formulas or formatting

**Must**:
- Work with provided template as-is
- Clone template for each request (thread-safety)
- Preserve all Excel features (formulas, formatting, validation)

### C3: Performance Targets
- **Startup**: Template loading ≤ 500ms
- **Basic Report**: Generation ≤ 2 seconds
- **Comprehensive Report**: Generation ≤ 3 seconds
- **Memory**: No leaks from repeated requests

---

## 3. Architecture Guidance

**Recommended Pattern**: Hexagonal Architecture

**Suggested Components**:
1. **Configuration Layer**: Load template at startup
2. **Mapping Layer**: Load Named Range & repeating data configs
3. **Writer Layer**: Write values to cells
4. **Service Layer**: Orchestrate the complete flow
5. **Controller Layer**: REST endpoint

**Alternative Approaches** (not mandated):
- Simple service without hexagonal architecture (if team prefers)
- Direct cell addressing instead of Named Ranges (not recommended)
- In-memory cache of generated reports (if needed for performance)

**Key Design Principles**:
- Single Responsibility: Each component has one job
- Separation of Concerns: Config loading ≠ Writing ≠ API
- Thread-Safe: No shared mutable state

---

## 4. Integration Points

### I1: Data Model
**Source**: `docs/data-model/vsme-data-model-spec.json`

**What to Extract**:
- All modules (basicModules, comprehensiveModules)
- All disclosures per module
- All datapoints per disclosure
- excelNamedRange per datapoint

**When**: At application startup (load once)

### I2: Repeating Data Patterns
**Source**: `docs/data-model/vsme-repeating-data-patterns.json`

**What to Extract**:
- patternId, excelSheet, excelStartRow, maxRows
- Column mappings

**When**: At application startup (load once)

### I3: Frontend API
**Endpoint**: POST `/api/vsme/export`

**Receives**: `ExcelExportRequest` (defined in `VsmeReportDto.kt`)

**Returns**: `ExcelExportResponse` with Base64 encoded Excel

**Error Handling**:
- Validation errors → 400 Bad Request
- Server errors → 500 Internal Server Error
- Missing template → Application won't start

### I4: Excel Template
**File**: `VSME-Digital-Template-1.1.0.xlsx` (root directory)

**Expected Structure**:
- 13 sheets (Introduction, Table of Contents, General Information, etc.)
- 797 Named Ranges
- Pre-defined formulas and formatting

---

## 5. Non-Requirements

**Explicitly NOT part of this specification**:
- ❌ Multi-language Excel generation (only English template)
- ❌ PDF export
- ❌ Excel validation after generation (assumed template is valid)
- ❌ Undo/Redo functionality
- ❌ Partial report generation (must be complete)
- ❌ Report versioning or history
- ❌ Direct Excel editing in browser
- ❌ Real-time collaborative editing

---

## 6. Testing Requirements

### Unit Tests (Recommended)
- Template loading succeeds
- Named Range resolution works correctly
- Data type conversion correct for all types
- Error handling for missing mappings

### Integration Tests (Required)
- Complete report generation from sample request
- Generated Excel opens in Microsoft Excel
- Verify key datapoints written correctly
- Performance test (generation time < 3s)

### Acceptance Tests (Required)
- End-to-end: Frontend → Backend → Excel download
- Manual verification: Open Excel, check 10 random values
- Edge cases: Empty arrays, optional fields, all dataTypes

---

## 7. Data Model References

**Primary**: `docs/data-model/vsme-data-model-spec.json`  
**Secondary**: `docs/data-model/vsme-repeating-data-patterns.json`  
**Template**: `VSME-Digital-Template-1.1.0.xlsx`  
**DTOs**: `backend/src/main/kotlin/org/example/backend/dto/VsmeReportDto.kt`

---

## 8. Success Metrics

**Definition of Done**:
- [ ] Template loads at startup without errors
- [ ] All 797 Named Ranges resolvable
- [ ] B1 module (20+ datapoints) writes correctly
- [ ] B3 module with numeric values writes correctly
- [ ] List of Sites (array, 3 items) writes to 3 rows
- [ ] Performance: Basic Report generates in < 2s
- [ ] Integration test passes
- [ ] Excel file validated manually

---

**Implementation Freedom**: Development team may choose implementation details not specified here, as long as all requirements and acceptance criteria are met.

**Questions?** Clarify with team before implementation if requirements are unclear.
