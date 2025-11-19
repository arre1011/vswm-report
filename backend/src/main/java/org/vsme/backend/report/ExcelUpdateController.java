package org.vsme.backend.report;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.vsme.backend.report.model.Datapoint;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExcelUpdateController implements ExcelUpdateApi {

    private final ExcelUpdateService excelUpdateService;

    @Override
    public ResponseEntity<byte[]> updateExcel(List<Datapoint> datapoints) throws IOException {
        byte[] updatedTemplate = excelUpdateService.updateExcel(datapoints);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(EXCEL_MEDIA_TYPE))
                .header("Content-Disposition", "attachment; filename=VSME_Report.xlsx")
                .body(updatedTemplate);
    }
}
