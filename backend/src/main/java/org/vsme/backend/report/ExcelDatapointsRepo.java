package org.vsme.backend.report;

import org.springframework.stereotype.Component;
import org.vsme.backend.report.model.ExcelDatapoint;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExcelDatapointsRepo {

    public List<ExcelDatapoint> getExcelDatapoints(String reportingPeriodStartMonth) {
        return new ArrayList<>(List.of(
                new ExcelDatapoint("entityName","template_reporting_entity_name"),
                new ExcelDatapoint("entityIdentifier","template_reporting_entity_identifier"),
                new ExcelDatapoint("currency","template_currency")
                ));
    }
}
