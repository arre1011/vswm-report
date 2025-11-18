package org.vsme.backend.report;

import org.springframework.stereotype.Component;
import org.vsme.backend.report.model.ExcelDatapoint;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExcelDatapointsRepo {

    public List<ExcelDatapoint> getExcelDatapoints(String reportingPeriodStartMonth) {
        return new ArrayList<>(List.of(
                new ExcelDatapoint("entityName","NameOfReportingEntity"),
                new ExcelDatapoint("entityIdentifier","IdentifierOfReportingEntity"),
                new ExcelDatapoint("currency","CurrencyUsedInReport"),
                new ExcelDatapoint("reportingPeriodStartYear","StartingYearOfReportingPeriod"),
                new ExcelDatapoint("reportingPeriodStartMonth","StartingMonthOfReportingPeriod")
                ));
    }
}
