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
                        "'General Information'!$D$6",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodStartMonth",
                        null,
                        "'General Information'!$D$7",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodStartDay",
                        null,
                        "'General Information'!$D$8",
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
                        "'General Information'!$D$10",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodEndMonth",
                        null,
                        "'General Information'!$D$11",
                        null
                ),
                new ExcelUpdate(
                        "reportingPeriodEndDay",
                        null,
                        "'General Information'!$D$12",
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
