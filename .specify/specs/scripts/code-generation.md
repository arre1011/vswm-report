# Code Generation Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2025-11-17  
**Type**: Requirements Specification

---

## Overview

This specification defines **requirements** for automated code generation from the VSME data model. It describes **WHAT** to generate and **WHY**, not implementation details.

---

## 1. Requirements

### R1: Zod Schema Generation
**What**: Generate TypeScript Zod validation schemas from the VSME data model.

**Why**: 
- Avoid manual schema writing (error-prone, 797 datapoints!)
- Keep validation in sync with data model (single source of truth)
- Enable type-safe validation with React Hook Form

**Input**: `docs/data-model/vsme-data-model-spec.json`

**Output**: `frontend/src/schemas/vsme-zod-schemas.ts`

**Generated Content**:

#### 1.1 Datapoint Schemas
Generate a Zod schema for each datapoint based on its `dataType` and `validation` rules.

**Datatype Mapping**:
| DataType | Zod Schema | Example |
|----------|-----------|---------|
| text | `z.string()` | `z.string().min(1).max(255)` |
| textarea | `z.string()` | `z.string().max(5000)` |
| number | `z.number()` or `z.coerce.number()` | `z.number().positive()` |
| date | `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)` | Date format YYYY-MM-DD |
| boolean | `z.boolean()` | `z.boolean()` |
| select | `z.enum([...])` | `z.enum(["Option1", "Option2"])` |
| url | `z.string().url()` | `z.string().url()` |
| email | `z.string().email()` | `z.string().email()` |

**Required Field Handling**:
```typescript
// If datapoint.required === true
z.string().min(1, "This field is required")

// If datapoint.required === false
z.string().optional()
```

**Validation Rule Mapping**:
| Validation Rule | Zod Method |
|----------------|-----------|
| `minLength: 5` | `.min(5)` |
| `maxLength: 100` | `.max(100)` |
| `pattern: "^[A-Z]"` | `.regex(/^[A-Z]/)` |
| `min: 0` | `.min(0)` |
| `max: 100` | `.max(100)` |

**Expected Output Example**:
```typescript
export const entityNameSchema = z.string()
  .min(1, "Entity name is required")
  .max(255, "Entity name too long")

export const totalEmployeesSchema = z.coerce.number()
  .int("Must be an integer")
  .positive("Must be positive")
  .optional()

export const legalFormSchema = z.enum([
  "GmbH", 
  "AG", 
  "UG", 
  "KG", 
  "OHG", 
  "Einzelunternehmen"
])
```

#### 1.2 Disclosure Schemas
Generate a Zod schema for each disclosure that combines all its datapoints.

**Expected Output Example**:
```typescript
export const b1Disclosure1Schema = z.object({
  entityName: entityNameSchema,
  legalForm: legalFormSchema,
  registrationNumber: registrationNumberSchema,
  // ... all datapoints in this disclosure
})
```

#### 1.3 Module Schemas
Generate a Zod schema for each module that combines all its disclosures.

**Expected Output Example**:
```typescript
export const b1ModuleSchema = z.object({
  moduleCode: z.literal("B1"),
  disclosures: z.array(
    z.object({
      disclosureId: z.string(),
      datapoints: z.array(
        z.object({
          datapointId: z.string(),
          value: z.any() // Or union of all possible schemas
        })
      )
    })
  )
})
```

#### 1.4 Array/Repeating Data Schemas
For array datapoints (e.g., `listOfSites`), generate a schema for the array structure.

**Input Example** (from data model):
```json
{
  "datapointId": "listOfSites",
  "dataType": "array",
  "arrayStructure": {
    "siteId": { "dataType": "text", "required": true },
    "siteName": { "dataType": "text", "required": true },
    "siteCity": { "dataType": "text", "required": false }
  },
  "maxItems": 25
}
```

**Expected Output**:
```typescript
export const siteItemSchema = z.object({
  siteId: z.string().min(1),
  siteName: z.string().min(1),
  siteCity: z.string().optional()
})

export const listOfSitesSchema = z.array(siteItemSchema)
  .max(25, "Maximum 25 sites allowed")
```

**Acceptance Criteria**:
- [ ] All dataTypes mapped to correct Zod schemas
- [ ] Required/optional handled correctly
- [ ] Validation rules (min, max, pattern) applied
- [ ] Select options generate `z.enum()`
- [ ] Array datapoints generate array schemas
- [ ] Generated file has no TypeScript errors
- [ ] Can import and use schemas in forms

---

### R2: i18n Key Extraction
**What**: Generate i18n translation keys from the VSME data model.

**Why**: 
- Avoid manual translation key definition
- Ensure all labels/descriptions have translations
- Support English (primary) and German (secondary)

**Input**: `docs/data-model/vsme-data-model-spec.json`

**Output**: 
- `frontend/src/locales/en/vsme.json`
- `frontend/src/locales/de/vsme.json`

**Generated Content**:

#### 2.1 Module Names
```json
{
  "modules": {
    "B1": {
      "name": "General Information",
      "description": "Basic information about the entity"
    },
    "B2": {
      "name": "Revenue and Employees",
      "description": "..."
    }
  }
}
```

#### 2.2 Disclosure Names
```json
{
  "disclosures": {
    "B1-1": {
      "name": "Entity Details",
      "description": "Legal name, form, registration"
    }
  }
}
```

#### 2.3 Datapoint Labels
```json
{
  "datapoints": {
    "entityName": {
      "label": "Entity Name",
      "description": "The legal name of the entity",
      "placeholder": "e.g., Example GmbH",
      "helpText": "Enter the full legal name as registered"
    },
    "legalForm": {
      "label": "Legal Form",
      "description": "The legal structure of the entity",
      "options": {
        "GmbH": "Limited Liability Company (GmbH)",
        "AG": "Stock Corporation (AG)",
        "UG": "Mini GmbH (UG)"
      }
    }
  }
}
```

#### 2.4 Validation Error Messages
```json
{
  "validation": {
    "required": "This field is required",
    "minLength": "Minimum {min} characters required",
    "maxLength": "Maximum {max} characters allowed",
    "invalidEmail": "Please enter a valid email address",
    "invalidUrl": "Please enter a valid URL",
    "invalidDate": "Please enter a date in format YYYY-MM-DD",
    "min": "Minimum value is {min}",
    "max": "Maximum value is {max}"
  }
}
```

**Source Priority**:
1. Use `label` and `description` from data model if present
2. Generate from `datapointId` if not present (e.g., "entityName" → "Entity Name")
3. Leave translation values empty if no source available (to be filled manually)

**Language Support**:
- **English (en)**: Primary language, generated from data model
- **German (de)**: Secondary language, copy English structure but leave values empty for manual translation

**Acceptance Criteria**:
- [ ] All modules have name + description keys
- [ ] All disclosures have name + description keys
- [ ] All datapoints have label + description + helpText keys
- [ ] Select options have translation keys
- [ ] Validation messages have translation keys
- [ ] English file has all values filled
- [ ] German file has same structure but empty values
- [ ] Can use with react-i18next in forms

---

### R3: TypeScript Type Generation (Optional)
**What**: Generate TypeScript types for the report data structure.

**Why**: Type-safe data access, autocomplete in IDE, catch errors at compile-time.

**Input**: `docs/data-model/vsme-data-model-spec.json`

**Output**: `frontend/src/types/vsme-generated-types.ts`

**Expected Output Example**:
```typescript
export type DatapointValue = string | number | boolean | Date | null

export interface DatapointData {
  datapointId: string
  value: DatapointValue
}

export interface DisclosureData {
  disclosureId: string
  datapoints: DatapointData[]
}

export interface ModuleData {
  moduleCode: string
  disclosures: DisclosureData[]
}

export interface VsmeReportData {
  reportMetadata: ReportMetadata
  basicModules: ModuleData[]
  comprehensiveModules: ModuleData[]
}

// Specific types for each module
export interface B1ModuleData extends ModuleData {
  moduleCode: "B1"
  // ... specific structure
}
```

**Acceptance Criteria**:
- [ ] Generated types match data model structure
- [ ] No TypeScript errors
- [ ] Can import and use types in components

---

## 2. Technical Constraints

### C1: Programming Language
**Must Use**: TypeScript (Node.js)

**Reasoning**: 
- Frontend is TypeScript
- Easy to run via npm script
- Good JSON parsing libraries

### C2: Script Location
**Must**: Place in `scripts/` directory (root)

**File Names**:
- `scripts/generate-zod-schemas.ts`
- `scripts/generate-i18n-keys.ts`

### C3: Execution
**Must**: Add npm scripts to `package.json`

```json
{
  "scripts": {
    "generate:schemas": "tsx scripts/generate-zod-schemas.ts",
    "generate:i18n": "tsx scripts/generate-i18n-keys.ts",
    "generate:all": "npm run generate:schemas && npm run generate:i18n"
  }
}
```

### C4: Dependencies
**May Use**:
- `tsx`: For running TypeScript scripts
- `@types/node`: For Node.js types
- `zod`: For understanding Zod schema structure (but not for runtime)

**Must Not**:
- Use external code generation frameworks (keep it simple)
- Require Java/Python (keep it in TypeScript ecosystem)

---

## 3. Architecture Guidance

### Recommended Approach

#### Step 1: Parse Data Model
- Read `vsme-data-model-spec.json`
- Parse JSON into typed structure
- Validate JSON structure (basic checks)

#### Step 2: Transform to Target Format
- Iterate modules → disclosures → datapoints
- Apply mapping rules (dataType → Zod schema)
- Handle special cases (arrays, enums, validations)

#### Step 3: Generate Code
- Use template strings to generate TypeScript code
- Ensure proper imports at top of file
- Add header comment (auto-generated, do not edit)

#### Step 4: Write File
- Write to target file path
- Pretty-print/format (optional but nice)
- Log success message

### Error Handling
- If data model file not found → Clear error message
- If JSON invalid → Show parsing error
- If unknown dataType → Warn but continue (use z.any())

### Logging
- Log number of modules/datapoints processed
- Log output file path
- Log any warnings (unknown dataTypes, missing fields)

---

## 4. Integration Points

### I1: Data Model
**Source**: `docs/data-model/vsme-data-model-spec.json`

**Expected Structure**:
```json
{
  "basicModules": [
    {
      "moduleCode": "B1",
      "moduleName": "...",
      "disclosures": [
        {
          "disclosureId": "B1-1",
          "datapoints": [
            {
              "datapointId": "entityName",
              "label": "Entity Name",
              "dataType": "text",
              "required": true,
              "validation": { "maxLength": 255 }
            }
          ]
        }
      ]
    }
  ]
}
```

### I2: React Hook Form
**Usage in Forms**:
```typescript
import { b1ModuleSchema } from '@/schemas/vsme-zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'

const form = useForm({
  resolver: zodResolver(b1ModuleSchema)
})
```

### I3: i18n (react-i18next)
**Usage in Components**:
```typescript
import { useTranslation } from 'react-i18next'

const { t } = useTranslation('vsme')
<Label>{t('datapoints.entityName.label')}</Label>
```

---

## 9. Data Model Reference

**Primary Source**: `docs/data-model/vsme-data-model-spec.json`

**Schema Definition**: Defined in data model documentation

**Total Scope**:
- 20 modules (11 basic + 9 comprehensive)
- 797 datapoints
- ~200 validation rules

---
