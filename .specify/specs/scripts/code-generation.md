# Code Generation Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2025-11-17

---

## Overview

This specification defines automated code generation scripts that read the VSME data model and generate:
1. **Zod validation schemas** with React Hook Form integration
2. **i18n translation keys** extracted from data model labels
3. **TypeScript types** for type-safe development

**Source**: `docs/data-model/vsme-data-model-spec.json`

---

## 1. Zod Schema Generation

### Goal
Generate Zod validation schemas for React Hook Form from the VSME data model.

### Input
```json
// From docs/data-model/vsme-data-model-spec.json
{
  "moduleCode": "B1",
  "disclosures": [{
    "disclosureId": "b1-xbrl-info",
    "datapoints": [
      {
        "datapointId": "entityName",
        "dataType": "text",
        "required": true,
        "label": { "en": "Entity Name", "de": "Name des Unternehmens" }
      },
      {
        "datapointId": "currency",
        "dataType": "select",
        "required": true,
        "options": [
          { "value": "EUR", "label": { "en": "Euro", "de": "Euro" } },
          { "value": "USD", "label": { "en": "US Dollar", "de": "US-Dollar" } }
        ]
      },
      {
        "datapointId": "turnover",
        "dataType": "number",
        "required": true,
        "unit": "currency"
      }
    ]
  }]
}
```

### Output
```typescript
// Generated: frontend/src/domains/report/schemas/b1-schema.ts

import { z } from 'zod'

/**
 * B1 - Basis for Preparation
 * Auto-generated from docs/data-model/vsme-data-model-spec.json
 * DO NOT EDIT MANUALLY
 */

// Individual field schemas
export const entityNameSchema = z.string()
  .min(1, { message: 'validation.required' })
  .max(255, { message: 'validation.max_length' })

export const currencySchema = z.enum(['EUR', 'USD', 'GBP', 'CHF'], {
  errorMap: () => ({ message: 'validation.invalid_option' })
})

export const turnoverSchema = z.number({
  required_error: 'validation.required',
  invalid_type_error: 'validation.must_be_number'
}).positive({ message: 'validation.must_be_positive' })

// Disclosure schemas
export const b1XbrlInfoSchema = z.object({
  entityName: entityNameSchema,
  entityIdentifier: z.string().min(1),
  currency: currencySchema,
  reportingPeriodStartYear: z.number().int().min(2000).max(2100),
  reportingPeriodStartMonth: z.number().int().min(1).max(12),
  reportingPeriodStartDay: z.number().int().min(1).max(31),
  reportingPeriodEndYear: z.number().int().min(2000).max(2100),
  reportingPeriodEndMonth: z.number().int().min(1).max(12),
  reportingPeriodEndDay: z.number().int().min(1).max(31)
})

// Table/Array schemas
export const listOfSitesItemSchema = z.object({
  siteId: z.string().min(1),
  siteName: z.string().min(1),
  siteAddress: z.string().min(1),
  siteCity: z.string().min(1),
  siteCountry: z.string().min(1)
})

export const listOfSitesSchema = z.array(listOfSitesItemSchema)
  .min(1, { message: 'validation.min_items' })
  .max(25, { message: 'validation.max_items' })

// Complete module schema
export const b1ModuleSchema = z.object({
  // XBRL Info
  entityName: entityNameSchema,
  entityIdentifier: z.string().min(1),
  currency: currencySchema,
  reportingPeriodStartYear: z.number().int(),
  reportingPeriodStartMonth: z.number().int(),
  reportingPeriodStartDay: z.number().int(),
  reportingPeriodEndYear: z.number().int(),
  reportingPeriodEndMonth: z.number().int(),
  reportingPeriodEndDay: z.number().int(),
  
  // Basis for Preparation
  basisForPreparation: z.enum(['Basic Module Only', 'Basic & Comprehensive']),
  omittedDisclosures: z.string().optional(),
  basisForReporting: z.enum(['Consolidated', 'Individual']),
  legalForm: z.string().min(1),
  naceSectorCode: z.string().min(1),
  turnover: turnoverSchema,
  numberOfEmployees: z.number().int().positive(),
  primaryCountry: z.string().min(1),
  
  // Repeating data
  listOfSubsidiaries: z.array(z.object({
    subsidiaryName: z.string(),
    subsidiaryIdentifier: z.string(),
    subsidiaryCountry: z.string()
  })).optional(),
  listOfSites: listOfSitesSchema
})

export type B1FormData = z.infer<typeof b1ModuleSchema>
```

### Implementation Script

```typescript
// scripts/generate-zod-schemas.ts

import fs from 'fs'
import path from 'path'

interface DataModel {
  coreReport: {
    basicModules: Module[]
    comprehensiveModules: Module[]
  }
}

interface Module {
  moduleCode: string
  moduleName: { en: string; de: string }
  disclosures: Disclosure[]
}

interface Disclosure {
  disclosureId: string
  disclosureName: { en: string; de: string }
  datapoints: Datapoint[]
}

interface Datapoint {
  datapointId: string
  label: { en: string; de: string }
  dataType: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'table' | 'textarea' | 'url' | 'email'
  required: boolean
  excelNamedRange?: string
  options?: Array<{ value: string; label: { en: string; de: string } }>
  unit?: string
  minRows?: number
  maxRows?: number
  columns?: Datapoint[]
}

function generateZodSchema(dataType: string, datapointId: string, required: boolean, options?: any[], minRows?: number, maxRows?: number): string {
  switch (dataType) {
    case 'text':
    case 'textarea':
      return required 
        ? `z.string().min(1, { message: 'validation.required' })`
        : `z.string().optional()`
    
    case 'email':
      return required
        ? `z.string().email({ message: 'validation.invalid_email' })`
        : `z.string().email().optional()`
    
    case 'url':
      return required
        ? `z.string().url({ message: 'validation.invalid_url' })`
        : `z.string().url().optional()`
    
    case 'number':
      return required
        ? `z.number({ required_error: 'validation.required', invalid_type_error: 'validation.must_be_number' }).positive()`
        : `z.number().positive().optional()`
    
    case 'date':
      return required
        ? `z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, { message: 'validation.invalid_date' })`
        : `z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/).optional()`
    
    case 'boolean':
      return `z.boolean()`
    
    case 'select':
      if (!options || options.length === 0) {
        return `z.string()`
      }
      const enumValues = options.map(opt => `'${opt.value}'`).join(', ')
      return required
        ? `z.enum([${enumValues}], { errorMap: () => ({ message: 'validation.invalid_option' }) })`
        : `z.enum([${enumValues}]).optional()`
    
    case 'table':
      // Will be handled separately with item schema
      return `z.array(${datapointId}ItemSchema)${minRows ? `.min(${minRows})` : ''}${maxRows ? `.max(${maxRows})` : ''}`
    
    default:
      return `z.any()`
  }
}

function generateModuleSchema(module: Module): string {
  const { moduleCode, moduleName, disclosures } = module
  
  let output = `// Generated: frontend/src/domains/report/schemas/${moduleCode.toLowerCase()}-schema.ts\n\n`
  output += `import { z } from 'zod'\n\n`
  output += `/**\n * ${moduleCode} - ${moduleName.en}\n * Auto-generated from docs/data-model/vsme-data-model-spec.json\n * DO NOT EDIT MANUALLY\n */\n\n`
  
  // Individual field schemas
  const allDatapoints: Datapoint[] = []
  disclosures.forEach(disclosure => {
    allDatapoints.push(...disclosure.datapoints)
  })
  
  // Generate individual schemas
  allDatapoints.forEach(datapoint => {
    if (datapoint.dataType === 'table') {
      // Generate item schema for table
      if (datapoint.columns) {
        output += `export const ${datapoint.datapointId}ItemSchema = z.object({\n`
        datapoint.columns.forEach(col => {
          const schema = generateZodSchema(col.dataType, col.datapointId, col.required, col.options)
          output += `  ${col.datapointId}: ${schema},\n`
        })
        output += `})\n\n`
      }
    }
    
    const schema = generateZodSchema(
      datapoint.dataType,
      datapoint.datapointId,
      datapoint.required,
      datapoint.options,
      datapoint.minRows,
      datapoint.maxRows
    )
    output += `export const ${datapoint.datapointId}Schema = ${schema}\n\n`
  })
  
  // Complete module schema
  output += `// Complete module schema\n`
  output += `export const ${moduleCode.toLowerCase()}ModuleSchema = z.object({\n`
  
  allDatapoints.forEach(datapoint => {
    output += `  ${datapoint.datapointId}: ${datapoint.datapointId}Schema,\n`
  })
  
  output += `})\n\n`
  output += `export type ${moduleCode}FormData = z.infer<typeof ${moduleCode.toLowerCase()}ModuleSchema>\n`
  
  return output
}

async function main() {
  // Load data model
  const dataModelPath = path.join(process.cwd(), 'docs/data-model/vsme-data-model-spec.json')
  const dataModel: DataModel = JSON.parse(fs.readFileSync(dataModelPath, 'utf-8'))
  
  // Output directory
  const outputDir = path.join(process.cwd(), 'frontend/src/domains/report/schemas')
  fs.mkdirSync(outputDir, { recursive: true })
  
  // Generate schemas for all modules
  const allModules = [
    ...dataModel.coreReport.basicModules,
    ...dataModel.coreReport.comprehensiveModules
  ]
  
  allModules.forEach(module => {
    const schemaCode = generateModuleSchema(module)
    const outputPath = path.join(outputDir, `${module.moduleCode.toLowerCase()}-schema.ts`)
    fs.writeFileSync(outputPath, schemaCode)
    console.log(`✓ Generated schema: ${module.moduleCode}`)
  })
  
  console.log(`\n✅ Generated ${allModules.length} Zod schemas`)
}

main().catch(console.error)
```

---

## 2. i18n Key Extraction

### Goal
Extract all translation keys from the data model and generate JSON files for de/en.

### Output Structure
```json
// frontend/src/i18n/de/modules/b1.json
{
  "modules": {
    "b1": {
      "title": "Grundlagen der Berichtserstellung",
      "description": "Basisinformationen über das Unternehmen",
      "disclosures": {
        "xbrl_info": {
          "title": "Für XBRL notwendige Informationen",
          "datapoints": {
            "entity_name": {
              "label": "Name des berichterstattenden Unternehmens",
              "info": "Vollständiger rechtlicher Name des Unternehmens"
            },
            "currency": {
              "label": "Währung der monetären Werte",
              "options": {
                "EUR": "Euro",
                "USD": "US-Dollar",
                "GBP": "Britisches Pfund"
              }
            }
          }
        }
      }
    }
  }
}
```

### Implementation Script

```typescript
// scripts/generate-i18n-keys.ts

interface TranslationOutput {
  modules: Record<string, ModuleTranslation>
}

interface ModuleTranslation {
  title: string
  description: string
  disclosures: Record<string, DisclosureTranslation>
}

interface DisclosureTranslation {
  title: string
  datapoints: Record<string, DatapointTranslation>
}

interface DatapointTranslation {
  label: string
  info?: string
  options?: Record<string, string>
}

function extractTranslations(module: Module, language: 'en' | 'de'): ModuleTranslation {
  const translation: ModuleTranslation = {
    title: module.moduleName[language],
    description: module.description?.[language] || '',
    disclosures: {}
  }
  
  module.disclosures.forEach(disclosure => {
    const disclosureKey = disclosure.disclosureId.replace(/-/g, '_')
    
    translation.disclosures[disclosureKey] = {
      title: disclosure.disclosureName[language],
      datapoints: {}
    }
    
    disclosure.datapoints.forEach(datapoint => {
      const datapointKey = datapoint.datapointId
      
      translation.disclosures[disclosureKey].datapoints[datapointKey] = {
        label: datapoint.label[language],
        info: datapoint.description?.[language]
      }
      
      // Extract options if present
      if (datapoint.options) {
        translation.disclosures[disclosureKey].datapoints[datapointKey].options = {}
        datapoint.options.forEach(option => {
          translation.disclosures[disclosureKey].datapoints[datapointKey].options![option.value] = 
            option.label[language]
        })
      }
    })
  })
  
  return translation
}

async function main() {
  const dataModelPath = path.join(process.cwd(), 'docs/data-model/vsme-data-model-spec.json')
  const dataModel: DataModel = JSON.parse(fs.readFileSync(dataModelPath, 'utf-8'))
  
  const allModules = [
    ...dataModel.coreReport.basicModules,
    ...dataModel.coreReport.comprehensiveModules
  ]
  
  // Generate for both languages
  for (const lang of ['de', 'en'] as const) {
    const outputDir = path.join(process.cwd(), `frontend/src/i18n/${lang}/modules`)
    fs.mkdirSync(outputDir, { recursive: true })
    
    allModules.forEach(module => {
      const translation = extractTranslations(module, lang)
      const output: TranslationOutput = {
        modules: {
          [module.moduleCode.toLowerCase()]: translation
        }
      }
      
      const outputPath = path.join(outputDir, `${module.moduleCode.toLowerCase()}.json`)
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
      console.log(`✓ Generated ${lang}/${module.moduleCode}.json`)
    })
  }
  
  // Generate validation messages
  const validationMessages = {
    de: {
      validation: {
        required: 'Dieses Feld ist erforderlich',
        invalid_email: 'Ungültige E-Mail-Adresse',
        invalid_url: 'Ungültige URL',
        must_be_number: 'Muss eine Zahl sein',
        must_be_positive: 'Muss positiv sein',
        invalid_date: 'Ungültiges Datumsformat (YYYY-MM-DD)',
        invalid_option: 'Ungültige Auswahl',
        min_items: 'Mindestens ein Eintrag erforderlich',
        max_items: 'Maximale Anzahl überschritten',
        max_length: 'Text zu lang'
      }
    },
    en: {
      validation: {
        required: 'This field is required',
        invalid_email: 'Invalid email address',
        invalid_url: 'Invalid URL',
        must_be_number: 'Must be a number',
        must_be_positive: 'Must be positive',
        invalid_date: 'Invalid date format (YYYY-MM-DD)',
        invalid_option: 'Invalid selection',
        min_items: 'At least one entry required',
        max_items: 'Maximum number exceeded',
        max_length: 'Text too long'
      }
    }
  }
  
  for (const lang of ['de', 'en'] as const) {
    const outputPath = path.join(process.cwd(), `frontend/src/i18n/${lang}/validation.json`)
    fs.writeFileSync(outputPath, JSON.stringify(validationMessages[lang], null, 2))
  }
  
  console.log(`\n✅ Generated i18n keys for ${allModules.length} modules`)
}

main().catch(console.error)
```

---

## 3. TypeScript Type Generation

### Goal
Generate TypeScript interfaces from data model (optional - types already exist in vsme-api-types.ts).

### Output
```typescript
// Generated types (if needed beyond existing vsme-api-types.ts)
export interface B1ModuleData {
  entityName: string
  entityIdentifier: string
  currency: 'EUR' | 'USD' | 'GBP' | 'CHF'
  // ... all other fields
}
```

**Note**: Since we already have `frontend/src/types/vsme-api-types.ts`, this might not be necessary. The Zod schemas can infer types with `z.infer<>`.

---

## 4. Script Execution

### Package.json Scripts

```json
{
  "scripts": {
    "generate:schemas": "tsx scripts/generate-zod-schemas.ts",
    "generate:i18n": "tsx scripts/generate-i18n-keys.ts",
    "generate:all": "npm run generate:schemas && npm run generate:i18n"
  }
}
```

### When to Run

- **Initially**: Once to generate all schemas and translations
- **On Data Model Change**: Whenever `vsme-data-model-spec.json` is updated
- **CI/CD**: Optionally in build pipeline to ensure generated code is up-to-date

---

## 5. Implementation Checklist

- [ ] Create `scripts/generate-zod-schemas.ts`
- [ ] Implement Zod schema generator logic
- [ ] Handle all data types (text, number, date, boolean, select, table)
- [ ] Create `scripts/generate-i18n-keys.ts`
- [ ] Implement i18n extraction logic
- [ ] Generate de/en JSON files
- [ ] Add npm scripts to package.json
- [ ] Test generated schemas with React Hook Form
- [ ] Test generated i18n keys with i18next
- [ ] Document usage in README

---

## 6. Usage Example

### Using Generated Schema in Form

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { b1ModuleSchema, type B1FormData } from '@/domains/report/schemas/b1-schema'

export function B1Form() {
  const { register, handleSubmit, formState: { errors } } = useForm<B1FormData>({
    resolver: zodResolver(b1ModuleSchema)
  })
  
  const onSubmit = (data: B1FormData) => {
    console.log('Valid data:', data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('entityName')} />
      {errors.entityName && <span>{errors.entityName.message}</span>}
    </form>
  )
}
```

### Using Generated i18n Keys

```typescript
import { useTranslation } from 'react-i18next'

export function B1Form() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h2>{t('modules.b1.title')}</h2>
      <Label>{t('modules.b1.disclosures.xbrl_info.datapoints.entity_name.label')}</Label>
    </div>
  )
}
```

---

**Next Steps**: Implement scripts, test generated code, integrate with forms.

