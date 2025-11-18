package org.vsme.backend.report;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.vsme.backend.report.model.Datapoint;
import org.vsme.backend.report.model.ExcelDatapoint;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelUpdateService {

    final ExcelDatapointsRepo excelDatapointsRepo;


    public ??? updateExcel(List<Datapoint> datapoints){
         List<ExcelDatapoint> excelDatapoints = excelDatapointsRepo.getExcelDatapoints();
        // In dieser Klasse soll die Values die aus dem Frontend in dem Datapoint Objekt gesendet werden in der Excel geupdatet werden. hierfür muss zuvor aber noch geprüft werden, in welhce excelnamerange das value update geschenen soll. Die kann geschen in dem man die zwie objekte datapoints und ExcelDatapoints zu einem gemeinsammen Objekt macht und dann diese Objekt nutzt um die Excel upzudaten. Die Excel soll dann mit der Lib Apache Pio geupdatet werden. achte auf clean code. Implementier nur das nötigste ncihts zusätzliches.

}
