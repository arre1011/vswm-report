package org.vsme.backend.report;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.vsme.backend.report.model.Datapoint;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@Tag(name = "Reports", description = "API for generating VSME Excel reports")
public class ReportController {

    private static final String EXCEL_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    final ReportService reportService;

    @Operation(
            summary = "Generate VSME Excel Report",
            description = "Generates a VSME sustainability report as an Excel file based on the provided datapoints"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Excel file generated successfully",
                    content = @Content(
                            mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            schema = @Schema(type = "string", format = "binary")
                    )
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request data"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping(
            produces = {MediaType.APPLICATION_OCTET_STREAM_VALUE, EXCEL_MEDIA_TYPE},
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<byte[]> report(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "List of datapoints to update in the Excel template",
                    required = true,
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
            @RequestBody List<Datapoint> datapoints) throws IOException {
        byte[] vsmeExcelTemplate = reportService.updateExcel(datapoints);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(EXCEL_MEDIA_TYPE))
                .header("Content-Disposition", "attachment; filename=VSME_Report.xlsx")
                .body(vsmeExcelTemplate);
    }
}
