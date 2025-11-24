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
                        null,
                        false
                ),
                new ExcelUpdate(
                        "entityIdentifierScheme",
                        "template_reporting_entity_identifier_scheme",
                        null,
                        null,
                        false
                ),
                new ExcelUpdate(
                        "entityIdentifier",
                        "template_reporting_entity_identifier",
                        null,
                        null,
                        false
                ),
                new ExcelUpdate(
                        "currency",
                        "template_currency",
                        null,
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodStartYear",
                        null,
                        "'General Information'!$D$6",
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodStartMonth",
                        null,
                        "'General Information'!$D$7",
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodStartDay",
                        null,
                        "'General Information'!$D$8",
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodStart",
                        "template_reporting_period_startdate",
                        null,
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodEndYear",
                        null,
                        "'General Information'!$D$10",
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodEndMonth",
                        null,
                        "'General Information'!$D$11",
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodEndDay",
                        null,
                        "'General Information'!$D$12",
                        null,
                        false
                ),
                new ExcelUpdate(
                        "reportingPeriodEnd",
                        "template_reporting_period_enddate",
                        null,
                        null,
                        false
                ),
                new ExcelUpdate(
                        "basisForPreparation",
                        "BasisForPreparation",
                        null,
                        null,
                        false
                ),
                new ExcelUpdate(
                "basisForReporting",
                "BasisForReporting",
                null,
                null,
                        false
                ),
                new ExcelUpdate(
                        "omittedDisclosures",
                        null,
                        "'General Information'!$E$33",
                        null,
                        false
                ),
                new ExcelUpdate(
                        "sizeOfBalanceSheet",
                        "Assets",
                        null,
                        null,
                        true
                )
        ));

    }
}
