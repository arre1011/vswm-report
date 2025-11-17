# Backend Excel Integration Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2025-11-17

---

## Overview

This specification defines how the backend integrates with Apache POI to generate VSME Excel reports by:
1. Loading the template as a singleton at Spring Boot startup
2. Resolving Named Ranges to write datapoint values
3. Handling repeating data (arrays) with row iteration

---

## 1. Template Loading Strategy

### Requirement
Load `VSME-Digital-Template-1.1.0.xlsx` once at application startup and keep it in memory as a singleton bean.

### Implementation

#### Spring Configuration
```kotlin
@Configuration
class ExcelTemplateConfig {
    
    @Bean
    @Singleton
    fun vsmeTemplateWorkbook(): Workbook {
        val templatePath = "VSME-Digital-Template-1.1.0.xlsx"
        val inputStream = FileInputStream(templatePath)
        
        return WorkbookFactory.create(inputStream).also {
            inputStream.close()
            logger.info("VSME Excel template loaded successfully with ${it.numberOfSheets} sheets")
        }
    }
    
    companion object {
        private val logger = LoggerFactory.getLogger(ExcelTemplateConfig::class.java)
    }
}
```

#### Template Cloning per Request
```kotlin
@Service
class ExcelGenerationService(
    private val templateWorkbook: Workbook
) {
    
    fun generateReport(request: ExcelExportRequest): ByteArray {
        // Clone template for thread-safety
        val workbook = cloneWorkbook(templateWorkbook)
        
        // Process request...
        writeDatapoints(workbook, request)
        
        // Convert to bytes
        return workbookToBytes(workbook)
    }
    
    private fun cloneWorkbook(source: Workbook): Workbook {
        val baos = ByteArrayOutputStream()
        source.write(baos)
        val bais = ByteArrayInputStream(baos.toByteArray())
        return WorkbookFactory.create(bais)
    }
}
```

### Benefits
- **Performance**: Template loaded once, not per request
- **Thread-Safety**: Each request gets a clone
- **Memory Efficient**: Shared template, only cloned when needed

---

## 2. Named Range Resolution

### Overview
The VSME template contains **797 Named Ranges**. Each datapoint in the request maps to a Named Range.

**Data Model Reference**: `docs/data-model/vsme-data-model-spec.json`

### Named Range Structure

Example from data model:
```json
{
  "datapointId": "entityName",
  "excelNamedRange": "NameOfReportingEntity",
  "excelReference": "'General Information'!$D$3",
  "dataType": "text",
  "required": true
}
```

### Implementation Strategy

#### Step 1: Create Mapping Configuration
```kotlin
data class NamedRangeMapping(
    val datapointId: String,
    val excelNamedRange: String,
    val dataType: DataType
)

@Component
class NamedRangeMappingLoader {
    
    @PostConstruct
    fun loadMappings() {
        // Load from docs/data-model/vsme-data-model-spec.json
        val mappings = parseDataModelSpec()
        mappingCache.putAll(mappings)
    }
    
    private val mappingCache = ConcurrentHashMap<String, NamedRangeMapping>()
    
    fun getMapping(datapointId: String): NamedRangeMapping? {
        return mappingCache[datapointId]
    }
}
```

#### Step 2: Write Datapoint to Named Range
```kotlin
@Service
class DatapointWriter(
    private val mappingLoader: NamedRangeMappingLoader
) {
    
    fun writeDatapoint(
        workbook: Workbook,
        datapointId: String,
        value: Any?
    ) {
        // Get mapping
        val mapping = mappingLoader.getMapping(datapointId) 
            ?: throw IllegalArgumentException("No mapping for $datapointId")
        
        // Resolve Named Range
        val namedRange = workbook.getName(mapping.excelNamedRange)
            ?: throw IllegalStateException("Named Range ${mapping.excelNamedRange} not found")
        
        // Get cell reference
        val areaRef = AreaReference(namedRange.refersToFormula, SpreadsheetVersion.EXCEL2007)
        val cellRef = areaRef.firstCell
        
        // Get sheet and cell
        val sheet = workbook.getSheet(cellRef.sheetName)
        val cell = sheet.getRow(cellRef.row)?.getCell(cellRef.col.toInt()) 
            ?: sheet.createRow(cellRef.row).createCell(cellRef.col.toInt())
        
        // Write value based on type
        writeValueToCell(cell, value, mapping.dataType)
    }
    
    private fun writeValueToCell(cell: Cell, value: Any?, dataType: DataType) {
        when (dataType) {
            DataType.TEXT, DataType.TEXTAREA, DataType.URL, DataType.EMAIL -> 
                cell.setCellValue(value?.toString() ?: "")
            DataType.NUMBER -> 
                cell.setCellValue((value as? Number)?.toDouble() ?: 0.0)
            DataType.DATE -> 
                cell.setCellValue(parseDate(value?.toString()))
            DataType.BOOLEAN -> 
                cell.setCellValue(value as? Boolean ?: false)
            DataType.SELECT -> 
                cell.setCellValue(value?.toString() ?: "")
        }
    }
}
```

### Best Practice: Batch Writing
```kotlin
fun writeModule(workbook: Workbook, module: ModuleDataRequest) {
    module.datapoints.forEach { datapoint ->
        when {
            datapoint.isTable() -> writeTableDatapoint(workbook, datapoint)
            else -> writeSimpleDatapoint(workbook, datapoint)
        }
    }
}
```

---

## 3. Repeating Data (Arrays) Handling

### Challenge
Some datapoints are tables/arrays that need to be written across multiple rows.

**Example**: `listOfSites` in B1 module
```typescript
listOfSites: [
  { siteId: "HQ-01", siteName: "Headquarters", siteCity: "Berlin" },
  { siteId: "FAC-02", siteName: "Factory", siteCity: "Munich" }
]
```

### Configuration from Data Model
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

### Implementation

#### Load Repeating Data Patterns
```kotlin
@Component
class RepeatingDataPatternLoader {
    
    private val patterns = mutableMapOf<String, RepeatingDataPattern>()
    
    @PostConstruct
    fun loadPatterns() {
        // Load from docs/data-model/vsme-repeating-data-patterns.json
        val json = File("docs/data-model/vsme-repeating-data-patterns.json").readText()
        val config = objectMapper.readValue<RepeatingDataConfig>(json)
        
        config.repeatingDataPatterns.forEach { pattern ->
            patterns[pattern.patternId] = pattern
        }
    }
    
    fun getPattern(datapointId: String): RepeatingDataPattern? {
        return patterns[datapointId]
    }
}
```

#### Write Table Datapoint
```kotlin
fun writeTableDatapoint(
    workbook: Workbook,
    datapointId: String,
    items: List<Map<String, Any?>>
) {
    val pattern = patternLoader.getPattern(datapointId)
        ?: throw IllegalArgumentException("No pattern for $datapointId")
    
    // Validate max rows
    if (items.size > pattern.maxRows) {
        throw IllegalArgumentException("Too many items: ${items.size} > ${pattern.maxRows}")
    }
    
    val sheet = workbook.getSheet(pattern.excelSheet)
    
    // Write each item to a row
    items.forEachIndexed { index, item ->
        val targetRow = pattern.excelStartRow + index
        val row = sheet.getRow(targetRow) ?: sheet.createRow(targetRow)
        
        // Write each column
        pattern.columns.forEach { column ->
            val value = item[column.datapointId]
            val cell = row.getCell(columnLetterToIndex(column.excelColumn))
                ?: row.createCell(columnLetterToIndex(column.excelColumn))
            
            writeValueToCell(cell, value, column.dataType)
        }
    }
}

private fun columnLetterToIndex(column: String): Int {
    return column.first().code - 'A'.code
}
```

---

## 4. Complete Flow

### Request Processing Flow
```
1. Request arrives: ExcelExportRequest
   └─> Contains: basicModules, comprehensiveModules

2. Clone template workbook
   └─> Thread-safe copy for this request

3. For each module in request:
   └─> For each datapoint:
       ├─> Is simple datapoint?
       │   └─> Lookup Named Range
       │       └─> Resolve to cell
       │           └─> Write value
       │
       └─> Is table datapoint?
           └─> Lookup repeating pattern
               └─> Iterate items
                   └─> Write to rows (startRow + index)

4. Convert workbook to bytes
   └─> ByteArrayOutputStream

5. Encode to Base64
   └─> Return in ExcelExportResponse
```

### Error Handling
```kotlin
sealed class ExcelGenerationError : Exception() {
    class NamedRangeNotFound(val rangeName: String) : 
        ExcelGenerationError()
    
    class DatapointMappingNotFound(val datapointId: String) : 
        ExcelGenerationError()
    
    class MaxRowsExceeded(val datapointId: String, val count: Int, val max: Int) : 
        ExcelGenerationError()
    
    class InvalidDataType(val expected: DataType, val actual: Any?) : 
        ExcelGenerationError()
}
```

---

## 5. Performance Considerations

### Optimization Strategies
1. **Template Caching**: Load once at startup ✅
2. **Mapping Cache**: Preload all mappings into ConcurrentHashMap ✅
3. **Lazy Sheet Loading**: Only access sheets when needed
4. **Batch Writes**: Write all datapoints before saving
5. **Stream Response**: Stream bytes directly to response

### Expected Performance
- **Template Loading**: ~500ms (once at startup)
- **Report Generation**: 
  - Basic Report: < 2 seconds
  - Comprehensive Report: < 3 seconds

---

## 6. Testing Strategy

### Unit Tests
```kotlin
@Test
fun `should write simple datapoint to named range`() {
    val workbook = createTestWorkbook()
    val writer = DatapointWriter(mappingLoader)
    
    writer.writeDatapoint(workbook, "entityName", "Test GmbH")
    
    val cell = getCell(workbook, "'General Information'!D3")
    assertEquals("Test GmbH", cell.stringCellValue)
}

@Test
fun `should write table datapoint to multiple rows`() {
    val workbook = createTestWorkbook()
    val items = listOf(
        mapOf("siteId" to "HQ-01", "siteName" to "HQ"),
        mapOf("siteId" to "FAC-02", "siteName" to "Factory")
    )
    
    writer.writeTableDatapoint(workbook, "listOfSites", items)
    
    val row1 = workbook.getSheet("General Information").getRow(109)
    assertEquals("HQ-01", row1.getCell(2).stringCellValue) // Column C
}
```

### Integration Tests
```kotlin
@SpringBootTest
@Test
fun `should generate complete VSME report`() {
    val request = createTestExportRequest()
    
    val response = excelService.generateReport(request)
    
    assertTrue(response.success)
    assertNotNull(response.excelFileBase64)
    
    // Validate Excel content
    val workbook = decodeAndLoadWorkbook(response.excelFileBase64!!)
    assertEntityNameWritten(workbook, "Test Company")
    assertSitesWritten(workbook, 3)
}
```

---

## 7. File References

**Data Model**: `docs/data-model/vsme-data-model-spec.json`  
**Repeating Patterns**: `docs/data-model/vsme-repeating-data-patterns.json`  
**Excel Template**: `VSME-Digital-Template-1.1.0.xlsx`  
**DTO Definitions**: `backend/src/main/kotlin/org/example/backend/dto/VsmeReportDto.kt`

---

## 8. Implementation Checklist

- [ ] Create `ExcelTemplateConfig` with singleton bean
- [ ] Create `NamedRangeMappingLoader` component
- [ ] Create `RepeatingDataPatternLoader` component
- [ ] Create `DatapointWriter` service
- [ ] Implement simple datapoint writing
- [ ] Implement table datapoint writing
- [ ] Add error handling
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Validate against real VSME template

---

**Next Steps**: Implement according to this spec, test thoroughly, commit.

