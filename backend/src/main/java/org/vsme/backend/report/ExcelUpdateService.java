package org.vsme.backend.report;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.vsme.backend.report.model.Datapoint;
import org.vsme.backend.report.model.ExcelUpdate;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelUpdateService {

    private final ExcelDataPointsRepo excelDatapointsRepo;
    private static final String EXCEL_TEMPLATE = "VSME-Digital-Template-1.1.0.xlsx";
    
    // Cached template as byte array (thread-safe)
    private byte[] templateBytes;

    @PostConstruct
    public void loadTemplate() {
        try {
            log.info("Loading VSME Excel template: {}", EXCEL_TEMPLATE);
            ClassPathResource resource = new ClassPathResource(EXCEL_TEMPLATE);
            if (!resource.exists()) {
                log.error("Excel template not found: {}", EXCEL_TEMPLATE);
                throw new IllegalStateException("Excel template not found: " + EXCEL_TEMPLATE);
            }
            try (InputStream inputStream = resource.getInputStream()) {
                templateBytes = inputStream.readAllBytes();
                log.info("Excel template loaded successfully ({} bytes)", templateBytes.length);
            }
        } catch (IOException e) {
            log.error("Failed to load Excel template: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to load Excel template", e);
        }
    }

    public byte[] updateExcel(List<Datapoint> dataPoints) throws IOException {
        if (templateBytes == null) {
            throw new IllegalStateException("Excel template not loaded. Application startup failed.");
        }
        List<ExcelUpdate> namedRanges = excelDatapointsRepo.getExcelDataPoints();
        List<ExcelUpdate> updates = createNamedRangeUpdates(dataPoints, namedRanges);
        
        // Create new workbook from cached template (thread-safe)
        Workbook workbook = new XSSFWorkbook(new java.io.ByteArrayInputStream(templateBytes));
        
        try {
            // Update named ranges
            log.info("Updating {} named ranges in Excel", updates.size());
            for (ExcelUpdate update : updates) {
                log.debug("Updating named range '{}' with value '{}'", update.excelNamedRange(), update.value());
                updateNamedRange(workbook, update.excelNamedRange(), update.value());
            }
            log.info("Excel update completed");

            // Ensure formulas and validation logic are recalculated when the user opens the workbook
            workbook.setForceFormulaRecalculation(true);
            workbook.getCreationHelper()
                    .createFormulaEvaluator()
                    .clearAllCachedResultValues();
            
            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } finally {
            workbook.close();
        }
    }
    
    private List<ExcelUpdate> createNamedRangeUpdates(List<Datapoint> dataPoints, List<ExcelUpdate> excelDataPoints) {
        // In dieser Funktion sollen die Values aus dataPoints in excelDataPoints übertragen werden. Dass mapping kann über die Variable DatapointsId gemacht werden
    }

    
    private void updateNamedRange(Workbook workbook, String namedRange, String value) {
        var name = workbook.getName(namedRange);
        if (name == null) {
            log.warn("Named range '{}' not found in workbook", namedRange);
            return;
        }
        
        String formula = name.getRefersToFormula();
        if (formula == null || formula.isEmpty()) {
            log.warn("Named range '{}' has no formula", namedRange);
            return;
        }
        
            log.debug("Processing named range '{}' with formula: {}", namedRange, formula);
        
        try {
            // Parse formula (format: 'Sheet Name'!$A$1 or SheetName!$A$1)
            String sheetName;
            String cellRef;
            
            if (formula.contains("!")) {
                int exclamationIndex = formula.indexOf('!');
                String sheetPart = formula.substring(0, exclamationIndex);
                cellRef = formula.substring(exclamationIndex + 1);
                
                // Remove quotes if present
                if (sheetPart.startsWith("'") && sheetPart.endsWith("'")) {
                    sheetName = sheetPart.substring(1, sheetPart.length() - 1);
                } else {
                    sheetName = sheetPart;
                }
            } else {
                // No sheet name, use first sheet
                sheetName = workbook.getSheetName(0);
                cellRef = formula;
            }
            
            // Parse cell reference (format: $A$1 or A1, or range $A$1:$B$2 - use first cell)
            // Handle ranges by taking only the first cell
            if (cellRef.contains(":")) {
                cellRef = cellRef.split(":")[0];
            }
            cellRef = cellRef.replace("$", "");
            String colStr = cellRef.replaceAll("\\d+", "");
            int colIndex = org.apache.poi.ss.util.CellReference.convertColStringToIndex(colStr);
            int rowIndex = Integer.parseInt(cellRef.replaceAll("[A-Z]+", "")) - 1; // Excel is 1-based
            
            log.debug("Parsed: sheet='{}', cell={}{}, row={}, col={}", 
                    sheetName, colStr, rowIndex + 1, rowIndex, colIndex);
            
            var sheet = workbook.getSheet(sheetName);
            if (sheet == null) {
                log.warn("Sheet '{}' not found for named range '{}'", sheetName, namedRange);
                return;
            }
            
            var row = sheet.getRow(rowIndex);
            if (row == null) {
                row = sheet.createRow(rowIndex);
            }
            
            var cell = row.getCell(colIndex);
            if (cell == null) {
                cell = row.createCell(colIndex);
            }
            
            cell.setCellValue(value);
            log.debug("Updated named range '{}' -> sheet '{}', cell {}{} with value '{}'",
                    namedRange, sheetName, colStr, rowIndex + 1, value);
        } catch (Exception e) {
            log.error("Error updating named range '{}' with formula '{}': {}", 
                    namedRange, formula, e.getMessage(), e);
        }
    }
}
