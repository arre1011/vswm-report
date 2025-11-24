package org.vsme.backend.report.model;

public record ExcelUpdate(
        String datapointID,
        String excelNamedRange,
        String excelCell,
        String value,
        boolean isNumber
) {
}

