package org.vsme.backend.report;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.vsme.backend.report.model.Datapoint;
import org.vsme.backend.report.model.ExcelDatapoint;
import org.vsme.backend.report.model.NamedRangeUpdate;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelUpdateService {

    private final ExcelDatapointsRepo excelDatapointsRepo;
    private static final String EXCEL_TEMPLATE = "VSME-Digital-Template-1.1.0.xlsx";
    
    // Cached template as byte array (thread-safe)
    private byte[] templateBytes;

    @PostConstruct
    public void loadTemplate() {
        try {
            log.info("🔄 Loading VSME Excel template: {}", EXCEL_TEMPLATE);
            ClassPathResource resource = new ClassPathResource(EXCEL_TEMPLATE);
            if (!resource.exists()) {
                log.error("❌ Excel template not found: {}", EXCEL_TEMPLATE);
                throw new IllegalStateException("Excel template not found: " + EXCEL_TEMPLATE);
            }
            try (InputStream inputStream = resource.getInputStream()) {
                templateBytes = inputStream.readAllBytes();
                log.info("✅ Excel template loaded successfully ({} bytes)", templateBytes.length);
            }
        } catch (IOException e) {
            log.error("❌ Failed to load Excel template: {}", e.getMessage(), e);
            throw new IllegalStateException("Failed to load Excel template", e);
        }
    }

    public byte[] updateExcel(List<Datapoint> dataPoints) throws IOException {
        if (templateBytes == null) {
            throw new IllegalStateException("Excel template not loaded. Application startup failed.");
        }
        
        List<ExcelDatapoint> excelDataPoints = excelDatapointsRepo.getExcelDatapoints(null);
        List<NamedRangeUpdate> updates = createNamedRangeUpdates(dataPoints, excelDataPoints);
        
        // Create new workbook from cached template (thread-safe)
        Workbook workbook = new XSSFWorkbook(new java.io.ByteArrayInputStream(templateBytes));
        
        try {
            // Update named ranges
            for (NamedRangeUpdate update : updates) {
                updateNamedRange(workbook, update.excelNamedRange(), update.value());
            }
            
            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } finally {
            workbook.close();
        }
    }
    
    private List<NamedRangeUpdate> createNamedRangeUpdates(List<Datapoint> dataPoints, List<ExcelDatapoint> excelDataPoints) {
        // Map excel datapoints by ID for quick lookup
        Map<String, String> excelMap = excelDataPoints.stream()
                .collect(Collectors.toMap(ExcelDatapoint::datapointId, ExcelDatapoint::excelNamedRange));
        
        // Combine datapoint values with excel named ranges
        return dataPoints.stream()
                .filter(datapoint -> excelMap.containsKey(datapoint.datapointId()))
                .map(datapoint -> new NamedRangeUpdate(
                        excelMap.get(datapoint.datapointId()),
                        datapoint.values()
                ))
                .toList();
    }
    
    private void updateNamedRange(Workbook workbook, String namedRange, String value) {
        var name = workbook.getName(namedRange);
        if (name == null) return;
        
        var cellRef = new org.apache.poi.ss.util.CellReference(name.getRefersToFormula());
        var sheet = workbook.getSheet(cellRef.getSheetName());
        if (sheet == null) return;
        
        var row = sheet.getRow(cellRef.getRow());
        if (row == null) {
            row = sheet.createRow(cellRef.getRow());
        }
        
        var cell = row.getCell(cellRef.getCol());
        if (cell == null) {
            cell = row.createCell(cellRef.getCol());
        }
        
        cell.setCellValue(value);
    }
}
