package org.vsme.backend.report;

import org.springframework.stereotype.Component;
import org.vsme.backend.report.model.ExcelUpdate;

import java.util.ArrayList;
import java.util.List;

@Component
public class ExcelDataPointsRepo {


    public List<ExcelUpdate> getExcelDataPoints() {
        return new ArrayList<>(List.of(
                new ExcelUpdate(
                        "entityName",
                        "template_reporting_entity_name",
                        null,
                        null
                ),
                new ExcelUpdate(
                        "entityIdentifierScheme",
                        "template_reporting_entity_identifier_scheme",
                        null,
                        null
                ),
                new ExcelUpdate(
                        "entityIdentifier",
                        "template_reporting_entity_identifier",
                        null,
                        null
                ),
                new ExcelUpdate(
                        "currency",
                        "template_currency",
                        null,
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodStartYear",
                        null,
                        "D6",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodStartMonth",
                        null,
                        "D7",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodStartDay",
                        null,
                        "D8",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodStart",
                        "template_reporting_period_startdate",
                        null,
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodEndYear",
                        null,
                        "D10",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodEndMonth",
                        null,
                        "D11",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodEndDay",
                        null,
                        "D12",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodEnd",
                        "template_reporting_period_enddate",
                        null,
                        null
                )
        ));

    }
}
