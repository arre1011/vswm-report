#!/usr/bin/env tsx
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

type Option = { value: string }

type Datapoint = {
  datapointId: string
  dataType: string
  required?: boolean
  options?: Option[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  columns?: Datapoint[]
  minRows?: number
  maxRows?: number
}

type Module = {
  moduleCode: string
  disclosures?: { datapoints?: Datapoint[] }[]
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_MODEL_PATH = path.resolve(
  __dirname,
  '../docs/data-model/vsme-data-model-spec.json',
)
const OUTPUT_PATH = path.resolve(
  __dirname,
  '../frontend/src/schemas/vsme-zod-schemas.ts',
)

const DATE_REGEX = '/^\\d{4}-\\d{2}-\\d{2}$/'
const REQUIRED_MESSAGE = '"Required"'

const readDataModel = async (): Promise<Module[]> => {
  const raw = await fs.readFile(DATA_MODEL_PATH, 'utf8')
  const data = JSON.parse(raw)
  const core = data?.coreReport ?? {}
  const basic: Module[] = core.basicModules ?? []
  const comprehensive: Module[] = core.comprehensiveModules ?? []
  return [...basic, ...comprehensive]
}

const escapeString = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/"/g, '\\"')

const buildBaseSchema = (datapoint: Datapoint): string => {
  switch (datapoint.dataType) {
    case 'text':
    case 'textarea':
      return 'z.string()'
    case 'number':
      return 'z.coerce.number()'
    case 'date':
      return `z.string().regex(${DATE_REGEX}, "Invalid date format (YYYY-MM-DD)")`
    case 'boolean':
      return 'z.boolean()'
    case 'select': {
      const optionValues = datapoint.options?.map((opt) => opt.value) ?? []
      if (optionValues.length === 0) {
        return 'z.string()'
      }
      const enumValues = `[${optionValues
        .map((val) => `"${escapeString(val)}"`)
        .join(', ')}]`
      return `z.enum(${enumValues} as const)`
    }
    case 'url':
      return 'z.string().url()'
    case 'email':
      return 'z.string().email()'
    case 'table':
      return buildTableSchema(datapoint)
    default:
      return 'z.any()'
  }
}

const applyValidation = (schema: string, datapoint: Datapoint): string => {
  const rules: string[] = []

  if (datapoint.validation?.min !== undefined) {
    rules.push(`.min(${datapoint.validation.min})`)
  }

  if (datapoint.validation?.max !== undefined) {
    rules.push(`.max(${datapoint.validation.max})`)
  }

  if (datapoint.validation?.pattern) {
    rules.push(
      `.regex(new RegExp("${escapeString(datapoint.validation.pattern)}"))`,
    )
  }

  let result = `${schema}${rules.join('')}`

  if (datapoint.required === false) {
    result = `${result}.optional()`
  } else if (datapoint.dataType === 'text' || datapoint.dataType === 'textarea') {
    result = `${result}.min(1, ${REQUIRED_MESSAGE})`
  }

  return result
}

const buildTableSchema = (datapoint: Datapoint): string => {
  const columns = datapoint.columns ?? []

  const columnEntries = columns
    .map((col) => {
      const base = buildBaseSchema(col)
      const validated = applyValidation(base, col)
      return `        ${JSON.stringify(col.datapointId)}: ${validated}`
    })
    .join(',\n')

  const rowSchema = `z.object({\n${columnEntries}\n      })`
  const minRows = datapoint.minRows ?? 0
  const maxRows = datapoint.maxRows

  let arraySchema = `z.array(${rowSchema})`
  if (minRows > 0) {
    arraySchema = `${arraySchema}.min(${minRows})`
  }
  if (typeof maxRows === 'number') {
    arraySchema = `${arraySchema}.max(${maxRows})`
  }

  return arraySchema
}

const buildDatapointSchema = (datapoint: Datapoint): string => {
  const base = buildBaseSchema(datapoint)
  return applyValidation(base, datapoint)
}

const buildDatapointMap = (modules: Module[]): Map<string, string> => {
  const map = new Map<string, string>()

  for (const module of modules) {
    for (const disclosure of module.disclosures ?? []) {
      for (const datapoint of disclosure.datapoints ?? []) {
        if (!map.has(datapoint.datapointId)) {
          map.set(datapoint.datapointId, buildDatapointSchema(datapoint))
        }
      }
    }
  }

  return map
}

const buildModuleEntries = (
  modules: Module[],
  datapointMap: Map<string, string>,
): string => {
  return modules
    .map((module) => {
      const fields: string[] = []

      for (const disclosure of module.disclosures ?? []) {
        for (const datapoint of disclosure.datapoints ?? []) {
          const schemaRef = datapointMap.has(datapoint.datapointId)
            ? `datapointSchemas[${JSON.stringify(datapoint.datapointId)}]`
            : buildDatapointSchema(datapoint)
          fields.push(`      ${JSON.stringify(datapoint.datapointId)}: ${schemaRef}`)
        }
      }

      const shape = fields.length
        ? `{\n${fields.join(',\n')}\n    }`
        : '{}'

      return `  ${JSON.stringify(module.moduleCode)}: z.object(${shape})`
    })
    .join(',\n')
}

const buildDatapointEntries = (map: Map<string, string>): string =>
  Array.from(map.entries())
    .map(([id, schema]) => `  ${JSON.stringify(id)}: ${schema}`)
    .join(',\n')

const buildFileHeader = (totalDatapoints: number): string =>
  `// AUTO-GENERATED BY scripts/generate-zod-schemas.ts. DO NOT EDIT MANUALLY.\n// Total datapoints: ${totalDatapoints}\n`

const generateContent = (modules: Module[], datapointMap: Map<string, string>) => {
  const header = buildFileHeader(datapointMap.size)
  const datapointEntries = buildDatapointEntries(datapointMap)
  const moduleEntries = buildModuleEntries(modules, datapointMap)

  return `${header}import { z } from 'zod'\n\nexport const datapointSchemas = {\n${datapointEntries}\n} as const\n\nexport const moduleSchemas = {\n${moduleEntries}\n} as const\n\nexport type ModuleCode = keyof typeof moduleSchemas\nexport type ModuleSchema = {\n  [K in ModuleCode]: z.infer<(typeof moduleSchemas)[K]>\n}\n`
}

const ensureOutputDir = async () => {
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
}

const main = async () => {
  const modules = await readDataModel()
  const datapointMap = buildDatapointMap(modules)
  const content = generateContent(modules, datapointMap)

  await ensureOutputDir()
  await fs.writeFile(OUTPUT_PATH, content, 'utf8')
  console.log(
    `Generated ${datapointMap.size} datapoint schemas for ${
      modules.length
    } modules at ${OUTPUT_PATH}`,
  )
}

main().catch((error) => {
  console.error('Failed to generate Zod schemas:', error)
  process.exit(1)
})
