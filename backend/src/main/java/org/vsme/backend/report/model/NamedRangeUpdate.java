package org.vsme.backend.report.model;

public record NamedRangeUpdate(
        String excelNamedRange,
        String value
) {
}

