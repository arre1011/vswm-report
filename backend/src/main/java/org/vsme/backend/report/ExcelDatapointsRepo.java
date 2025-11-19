package org.vsme.backend.report;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ExcelDatapointsRepo {

    private static final Map<String, String> DATAPOINT_TO_RANGE = Map.of(
            "entityName", "template_reporting_entity_name",
            "entityIdentifier", "template_reporting_entity_identifier",
            "currency", "template_currency"
    );

    public Map<String, String> getNamedRanges() {
        return DATAPOINT_TO_RANGE;
    }
}
