package org.vsme.backend.report;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.vsme.backend.report.model.Datapoint;

import java.io.IOException;
import java.util.List;

@RequestMapping(ExcelUpdateApi.EXCEL_UPDATE_PATH)
@Tag(name = "Excel Update", description = "API for updating VSME Excel templates")
public interface ExcelUpdateApi {

    String EXCEL_UPDATE_PATH = "/excel-update";
    String EXCEL_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    @Operation(
            summary = "Update VSME Excel template",
            description = "Writes the provided datapoints into the VSME Excel template and returns the updated file."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Excel file generated successfully",
                    content = @Content(
                            mediaType = EXCEL_MEDIA_TYPE,
                            schema = @Schema(type = "string", format = "binary")
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = {MediaType.APPLICATION_OCTET_STREAM_VALUE, EXCEL_MEDIA_TYPE}
    )
    ResponseEntity<byte[]> updateExcel(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "List of datapoints to inject into the Excel template",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = Datapoint.class),
                            examples = @ExampleObject(
                                    name = "Example Request",
                                    value = """
                                            [
                                              {
                                                "datapointId": "entityName",
                                                "values": "Example GmbH"
                                              },
                                              {
                                                "datapointId": "entityIdentifier",
                                                "values": "HRB 123456"
                                              },
                                              {
                                                "datapointId": "currency",
                                                "values": "EUR"
                                              },
                                              {
                                                "datapointId": "reportingPeriodStartYear",
                                                "values": "2024"
                                              },
                                              {
                                                "datapointId": "reportingPeriodStartMonth",
                                                "values": "1"
                                              }
                                            ]
                                            """
                            )
                    )
            )
            @RequestBody List<Datapoint> datapoints) throws IOException;
}
