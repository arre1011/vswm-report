/**
 * VSME API Type Definitions
 * Frontend-Backend API contract for Excel export
 * Generated from VSME Data Model Specification
 */

// ============================================================================
// Core Type Definitions
// ============================================================================

export type DataType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'table' | 'textarea' | 'url' | 'email'

export type ModuleType = 'basic' | 'comprehensive'

export type ModuleCode = 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'B10' | 'B11' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9'

// ============================================================================
// Datapoint Value Types
// ============================================================================

/**
 * Single datapoint value for simple fields
 */
export interface DatapointValue {
  datapointId: string
  excelNamedRange?: string
  value: string | number | boolean | null
}

/**
 * Table/Array datapoint value for repeating data
 */
export interface TableDatapointValue {
  datapointId: string
  excelNamedRange?: string
  items: Array<Record<string, string | number | boolean | null>>
}

/**
 * Union type for all datapoint values
 */
export type DatapointValueUnion = DatapointValue | TableDatapointValue

// ============================================================================
// Excel Export Request
// ============================================================================

/**
 * Module data sent to backend for Excel generation
 */
export interface ModuleDataRequest {
  moduleId: string
  moduleCode: ModuleCode
  datapoints: DatapointValueUnion[]
}

/**
 * Complete Excel export request from frontend to backend
 */
export interface ExcelExportRequest {
  reportMetadata: {
    reportDate: string // ISO 8601 format
    reportVersion: string
    basisForPreparation: 'Basic Module Only' | 'Basic & Comprehensive'
    language: 'en' | 'de'
  }
  coreReport: {
    basicModules: ModuleDataRequest[]
    comprehensiveModules?: ModuleDataRequest[] // Optional, only if comprehensive reporting
  }
}

// ============================================================================
// Excel Export Response
// ============================================================================

/**
 * Validation error for a specific datapoint
 */
export interface ValidationError {
  datapointId: string
  moduleCode: ModuleCode
  error: string
  severity: 'error' | 'warning'
}

/**
 * Excel export response from backend to frontend
 */
export interface ExcelExportResponse {
  success: boolean
  message: string
  timestamp: string // ISO 8601 format
  excelFileBase64?: string // Base64 encoded Excel file
  validationErrors?: ValidationError[]
}

// ============================================================================
// Specific Module Data Types (for type safety)
// ============================================================================

/**
 * B1 Module: Basis for Preparation
 */
export interface B1ModuleData {
  // XBRL Information
  entityName: string
  entityIdentifier: string
  currency: string
  reportingPeriodStartYear: number
  reportingPeriodStartMonth: number
  reportingPeriodStartDay: number
  reportingPeriodEndYear: number
  reportingPeriodEndMonth: number
  reportingPeriodEndDay: number
  
  // Basis for Preparation
  basisForPreparation: 'Basic Module Only' | 'Basic & Comprehensive'
  omittedDisclosures?: string
  basisForReporting: 'Consolidated' | 'Individual'
  legalForm: string
  naceSectorCode: string
  turnover: number
  numberOfEmployees: number
  primaryCountry: string
  
  // List of Subsidiaries (optional, repeating)
  listOfSubsidiaries?: Array<{
    subsidiaryName: string
    subsidiaryIdentifier: string
    subsidiaryCountry: string
  }>
  
  // List of Sites (required, repeating)
  listOfSites: Array<{
    siteId: string
    siteName: string
    siteAddress: string
    siteCity: string
    siteCountry: string
  }>
}

/**
 * B3 Module: Energy and GHG Emissions
 */
export interface B3ModuleData {
  // Energy
  totalEnergyConsumption: number
  
  // GHG Emissions
  scope1Emissions: number
  scope2EmissionsLocation: number
  scope3Emissions?: number
  
  // GHG Intensity
  ghgIntensityPerTurnover: number
}

/**
 * B8 Module: Workforce - General Characteristics
 */
export interface B8ModuleData {
  // Contract Type
  permanentEmployees: number
  temporaryEmployees: number
  
  // Gender Distribution
  maleEmployees: number
  femaleEmployees: number
  otherGenderEmployees?: number
  
  // Turnover Rate (optional)
  turnoverRate?: number
}

/**
 * C1 Module: Strategy and Business Model
 */
export interface C1ModuleData {
  strategyDescription: string
  productsAndServices: string
  significantMarkets: string
  businessRelationships: string
}

/**
 * C3 Module: GHG Reduction Targets
 */
export interface C3ModuleData {
  // Targets
  ghgTargetBaselineYear?: number
  ghgTargetYear?: number
  ghgReductionPercentage?: number
  
  // Transition Plan
  transitionPlanDescription?: string
  adoptionDateTransitionPlan?: string // ISO 8601 format
  
  // Main Actions (repeating)
  mainActionsList?: Array<{
    actionDescription: string
    expectedImpact: number
    timeline?: string
  }>
}

// ============================================================================
// Helper Functions for Type Conversion
// ============================================================================

/**
 * Convert module-specific data to generic ModuleDataRequest
 */
export function convertToModuleDataRequest(
  moduleCode: ModuleCode,
  moduleData: B1ModuleData | B3ModuleData | B8ModuleData | C1ModuleData | C3ModuleData | Record<string, any>
): ModuleDataRequest {
  const datapoints: DatapointValueUnion[] = []
  
  for (const [key, value] of Object.entries(moduleData)) {
    if (Array.isArray(value)) {
      // Table/repeating data
      datapoints.push({
        datapointId: key,
        items: value
      })
    } else {
      // Simple datapoint
      datapoints.push({
        datapointId: key,
        value: value ?? null
      })
    }
  }
  
  return {
    moduleId: `module-${moduleCode.toLowerCase()}`,
    moduleCode,
    datapoints
  }
}

/**
 * Validate ExcelExportRequest before sending
 */
export function validateExportRequest(request: ExcelExportRequest): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Validate metadata
  if (!request.reportMetadata.reportDate) {
    errors.push({
      datapointId: 'reportDate',
      moduleCode: 'B1',
      error: 'Report date is required',
      severity: 'error'
    })
  }
  
  // Validate that at least basic modules are present
  if (!request.coreReport.basicModules || request.coreReport.basicModules.length === 0) {
    errors.push({
      datapointId: 'basicModules',
      moduleCode: 'B1',
      error: 'At least one basic module is required',
      severity: 'error'
    })
  }
  
  // If comprehensive reporting is selected, validate comprehensive modules
  if (request.reportMetadata.basisForPreparation === 'Basic & Comprehensive') {
    if (!request.coreReport.comprehensiveModules || request.coreReport.comprehensiveModules.length === 0) {
      errors.push({
        datapointId: 'comprehensiveModules',
        moduleCode: 'C1',
        error: 'Comprehensive modules are required when "Basic & Comprehensive" is selected',
        severity: 'warning'
      })
    }
  }
  
  return errors
}

/**
 * Download Excel file from base64 response
 */
export function downloadExcelFile(response: ExcelExportResponse, filename: string = 'VSME-Report.xlsx'): void {
  if (!response.success || !response.excelFileBase64) {
    console.error('Cannot download Excel file: ', response.message)
    return
  }
  
  try {
    // Decode base64
    const binaryString = window.atob(response.excelFileBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    
    // Create blob and download
    const blob = new Blob([bytes], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading Excel file:', error)
  }
}

// ============================================================================
// API Client Functions
// ============================================================================

/**
 * Submit export request to backend
 */
export async function submitExportRequest(
  request: ExcelExportRequest,
  apiBaseUrl: string = 'http://localhost:8080'
): Promise<ExcelExportResponse> {
  const validationErrors = validateExportRequest(request)
  if (validationErrors.some(e => e.severity === 'error')) {
    return {
      success: false,
      message: 'Validation errors found',
      timestamp: new Date().toISOString(),
      validationErrors
    }
  }
  
  try {
    const response = await fetch(`${apiBaseUrl}/api/vsme/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        message: errorData.message || `Server error: ${response.status}`,
        timestamp: new Date().toISOString()
      }
    }
    
    return await response.json()
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
      timestamp: new Date().toISOString()
    }
  }
}

