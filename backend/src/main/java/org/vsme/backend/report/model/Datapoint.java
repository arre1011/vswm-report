package org.vsme.backend.report.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "A datapoint containing an ID and its value to be written to the Excel template")
public record Datapoint (
        @Schema(description = "Unique identifier of the datapoint (e.g., 'entityName', 'currency')", 
                example = "entityName", 
                required = true)
        String datapointId,
        
        @Schema(description = "The value to be written to the Excel cell", 
                example = "Example GmbH", 
                required = true)
        String values
){
}
