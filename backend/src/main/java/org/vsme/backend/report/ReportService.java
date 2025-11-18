package org.vsme.backend.report;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.vsme.backend.report.model.Datapoint;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    ExcelUpdateService excelUpdateService;

    public byte[] updateExcel(List<Datapoint> dataPoints) throws IOException {
        return excelUpdateService.updateExcel(dataPoints);
    }


}
