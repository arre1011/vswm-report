package org.vsme.backend.report;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.vsme.backend.report.model.Datapoint;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController {

    final ReportService reportService;

   @PostMapping
   public String report(@RequestBody List<Datapoint> datapoint){
        return "Hello World!";
   }
}
