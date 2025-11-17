package org.example.backend.dto

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.Instant

/**
 * VSME API Data Transfer Objects
 * Backend Kotlin data classes corresponding to TypeScript types
 * Generated from VSME Data Model Specification
 */

// ============================================================================
// Core Type Definitions
// ============================================================================

enum class ModuleType {
    @JsonProperty("basic")
    BASIC,
    @JsonProperty("comprehensive")
    COMPREHENSIVE
}

enum class DataType {
    @JsonProperty("text")
    TEXT,
    @JsonProperty("number")
    NUMBER,
    @JsonProperty("date")
    DATE,
    @JsonProperty("boolean")
    BOOLEAN,
    @JsonProperty("select")
    SELECT,
    @JsonProperty("table")
    TABLE,
    @JsonProperty("textarea")
    TEXTAREA,
    @JsonProperty("url")
    URL,
    @JsonProperty("email")
    EMAIL
}

// ============================================================================
// Datapoint Value Types
// ============================================================================

/**
 * Single datapoint value for simple fields
 */
data class DatapointValue(
    @JsonProperty("datapointId") val datapointId: String,
    @JsonProperty("excelNamedRange") val excelNamedRange: String? = null,
    @JsonProperty("value") val value: Any? = null // Can be String, Number, Boolean, or null
)

/**
 * Table/Array datapoint value for repeating data
 */
data class TableDatapointValue(
    @JsonProperty("datapointId") val datapointId: String,
    @JsonProperty("excelNamedRange") val excelNamedRange: String? = null,
    @JsonProperty("items") val items: List<Map<String, Any?>> = emptyList()
)

// ============================================================================
// Excel Export Request
// ============================================================================

/**
 * Report metadata
 */
data class ReportMetadata(
    @JsonProperty("reportDate") val reportDate: String, // ISO 8601 format
    @JsonProperty("reportVersion") val reportVersion: String,
    @JsonProperty("basisForPreparation") val basisForPreparation: String, // "Basic Module Only" or "Basic & Comprehensive"
    @JsonProperty("language") val language: String // "en" or "de"
)

/**
 * Module data sent from frontend for Excel generation
 */
data class ModuleDataRequest(
    @JsonProperty("moduleId") val moduleId: String,
    @JsonProperty("moduleCode") val moduleCode: String,
    @JsonProperty("datapoints") val datapoints: List<Map<String, Any?>> // Mixed DatapointValue and TableDatapointValue
)

/**
 * Core report containing basic and comprehensive modules
 */
data class CoreReport(
    @JsonProperty("basicModules") val basicModules: List<ModuleDataRequest>,
    @JsonProperty("comprehensiveModules") val comprehensiveModules: List<ModuleDataRequest>? = null
)

/**
 * Complete Excel export request from frontend
 */
data class ExcelExportRequest(
    @JsonProperty("reportMetadata") val reportMetadata: ReportMetadata,
    @JsonProperty("coreReport") val coreReport: CoreReport
)

// ============================================================================
// Excel Export Response
// ============================================================================

/**
 * Validation error for a specific datapoint
 */
data class ValidationError(
    @JsonProperty("datapointId") val datapointId: String,
    @JsonProperty("moduleCode") val moduleCode: String,
    @JsonProperty("error") val error: String,
    @JsonProperty("severity") val severity: String // "error" or "warning"
)

/**
 * Excel export response from backend to frontend
 */
data class ExcelExportResponse(
    @JsonProperty("success") val success: Boolean,
    @JsonProperty("message") val message: String,
    @JsonProperty("timestamp") val timestamp: String = Instant.now().toString(),
    @JsonProperty("excelFileBase64") val excelFileBase64: String? = null, // Base64 encoded Excel file
    @JsonProperty("validationErrors") val validationErrors: List<ValidationError>? = null
)

// ============================================================================
// Specific Module Data Types (for type safety and validation)
// ============================================================================

/**
 * B1 Module: Basis for Preparation
 */
data class B1ModuleData(
    // XBRL Information
    @JsonProperty("entityName") val entityName: String,
    @JsonProperty("entityIdentifier") val entityIdentifier: String,
    @JsonProperty("currency") val currency: String,
    @JsonProperty("reportingPeriodStartYear") val reportingPeriodStartYear: Int,
    @JsonProperty("reportingPeriodStartMonth") val reportingPeriodStartMonth: Int,
    @JsonProperty("reportingPeriodStartDay") val reportingPeriodStartDay: Int,
    @JsonProperty("reportingPeriodEndYear") val reportingPeriodEndYear: Int,
    @JsonProperty("reportingPeriodEndMonth") val reportingPeriodEndMonth: Int,
    @JsonProperty("reportingPeriodEndDay") val reportingPeriodEndDay: Int,
    
    // Basis for Preparation
    @JsonProperty("basisForPreparation") val basisForPreparation: String,
    @JsonProperty("omittedDisclosures") val omittedDisclosures: String? = null,
    @JsonProperty("basisForReporting") val basisForReporting: String,
    @JsonProperty("legalForm") val legalForm: String,
    @JsonProperty("naceSectorCode") val naceSectorCode: String,
    @JsonProperty("turnover") val turnover: Double,
    @JsonProperty("numberOfEmployees") val numberOfEmployees: Int,
    @JsonProperty("primaryCountry") val primaryCountry: String,
    
    // List of Subsidiaries (optional, repeating)
    @JsonProperty("listOfSubsidiaries") val listOfSubsidiaries: List<SubsidiaryData>? = null,
    
    // List of Sites (required, repeating)
    @JsonProperty("listOfSites") val listOfSites: List<SiteData>
)

data class SubsidiaryData(
    @JsonProperty("subsidiaryName") val subsidiaryName: String,
    @JsonProperty("subsidiaryIdentifier") val subsidiaryIdentifier: String,
    @JsonProperty("subsidiaryCountry") val subsidiaryCountry: String
)

data class SiteData(
    @JsonProperty("siteId") val siteId: String,
    @JsonProperty("siteName") val siteName: String,
    @JsonProperty("siteAddress") val siteAddress: String,
    @JsonProperty("siteCity") val siteCity: String,
    @JsonProperty("siteCountry") val siteCountry: String
)

/**
 * B3 Module: Energy and GHG Emissions
 */
data class B3ModuleData(
    // Energy
    @JsonProperty("totalEnergyConsumption") val totalEnergyConsumption: Double,
    
    // GHG Emissions
    @JsonProperty("scope1Emissions") val scope1Emissions: Double,
    @JsonProperty("scope2EmissionsLocation") val scope2EmissionsLocation: Double,
    @JsonProperty("scope3Emissions") val scope3Emissions: Double? = null,
    
    // GHG Intensity
    @JsonProperty("ghgIntensityPerTurnover") val ghgIntensityPerTurnover: Double
)

/**
 * B8 Module: Workforce - General Characteristics
 */
data class B8ModuleData(
    // Contract Type
    @JsonProperty("permanentEmployees") val permanentEmployees: Int,
    @JsonProperty("temporaryEmployees") val temporaryEmployees: Int,
    
    // Gender Distribution
    @JsonProperty("maleEmployees") val maleEmployees: Int,
    @JsonProperty("femaleEmployees") val femaleEmployees: Int,
    @JsonProperty("otherGenderEmployees") val otherGenderEmployees: Int? = null,
    
    // Turnover Rate (optional)
    @JsonProperty("turnoverRate") val turnoverRate: Double? = null
)

/**
 * C1 Module: Strategy and Business Model
 */
data class C1ModuleData(
    @JsonProperty("strategyDescription") val strategyDescription: String,
    @JsonProperty("productsAndServices") val productsAndServices: String,
    @JsonProperty("significantMarkets") val significantMarkets: String,
    @JsonProperty("businessRelationships") val businessRelationships: String
)

/**
 * C3 Module: GHG Reduction Targets
 */
data class C3ModuleData(
    // Targets
    @JsonProperty("ghgTargetBaselineYear") val ghgTargetBaselineYear: Int? = null,
    @JsonProperty("ghgTargetYear") val ghgTargetYear: Int? = null,
    @JsonProperty("ghgReductionPercentage") val ghgReductionPercentage: Double? = null,
    
    // Transition Plan
    @JsonProperty("transitionPlanDescription") val transitionPlanDescription: String? = null,
    @JsonProperty("adoptionDateTransitionPlan") val adoptionDateTransitionPlan: String? = null,
    
    // Main Actions (repeating)
    @JsonProperty("mainActionsList") val mainActionsList: List<GhgReductionAction>? = null
)

data class GhgReductionAction(
    @JsonProperty("actionDescription") val actionDescription: String,
    @JsonProperty("expectedImpact") val expectedImpact: Double,
    @JsonProperty("timeline") val timeline: String? = null
)

// ============================================================================
// Named Range Mapping Configuration (used by backend service)
// ============================================================================

/**
 * Configuration for mapping a datapoint to Excel Named Range
 */
data class NamedRangeMapping(
    @JsonProperty("datapointId") val datapointId: String,
    @JsonProperty("excelNamedRange") val excelNamedRange: String,
    @JsonProperty("excelReference") val excelReference: String, // e.g., "'General Information'!$D$3"
    @JsonProperty("dataType") val dataType: DataType,
    @JsonProperty("isRepeating") val isRepeating: Boolean = false,
    @JsonProperty("excelStartRow") val excelStartRow: Int? = null, // For repeating data
    @JsonProperty("excelColumn") val excelColumn: String? = null // For repeating data
)

/**
 * Complete mapping configuration for a module
 */
data class ModuleMappingConfig(
    @JsonProperty("moduleCode") val moduleCode: String,
    @JsonProperty("moduleName") val moduleName: String,
    @JsonProperty("sheet") val sheet: String,
    @JsonProperty("datapoints") val datapoints: List<NamedRangeMapping>
)

// ============================================================================
// Helper Classes for Excel Generation
// ============================================================================

/**
 * Result of writing to Excel
 */
data class ExcelWriteResult(
    val success: Boolean,
    val errors: List<String> = emptyList(),
    val warnings: List<String> = emptyList()
)

/**
 * Excel cell location
 */
data class CellLocation(
    val sheet: String,
    val row: Int,
    val column: String
) {
    fun toReference(): String = "'$sheet'!\$$column\$$row"
}

