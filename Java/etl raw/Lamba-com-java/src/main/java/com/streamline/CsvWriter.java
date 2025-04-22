package com.streamline;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class CsvWriter {
    public ByteArrayOutputStream escreverCsv(List<Captura> listaCaptura) throws IOException {
        LocalDateTime dataHora = LocalDateTime.now();
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("yyyy-MM-dd HH-mm-ss");
        ByteArrayOutputStream streamSaida = new ByteArrayOutputStream();
        BufferedWriter escritor = new BufferedWriter(new OutputStreamWriter(streamSaida, StandardCharsets.UTF_8));
        CSVPrinter csvPrinter = new CSVPrinter(escritor, CSVFormat.DEFAULT.withHeader(
                "fkAtm",
                "dataHora",
                "valorCpuPercent",
                "limiteCpuPercent",
                "alertaCpuPercent",
                "valorCPUFreq",
                "limiteCPUFreq",
                "alertaCPUFreq",
                "valorRAMDisponivel",
                "valorRAMPercentual",
                "limiteRAMPercentual",
                "alertaRAMPercentual",
                "valorDISKTotal",
                "valorDISKDisponivel",
                "valorDISKPercentual",
                "limiteDISKPercentual",
                "alertaDISKPercentual",
                "valorREDERecebida",
                "limiteREDERecebida",
                "alertaREDERecebida",
                "valorREDEEnviada",
                "limiteREDEEnviada",
                "alertaREDEEnviada",
                "valorPROCESSODesativado",
                "limitePROCESSODesativado",
                "alertaPROCESSODesativado",
                "valorPROCESSOAtivos",
                "limitePROCESSOAtivos",
                "alertaPROCESSOAtivos",
                "valorPROCESSOTotal"
        ));


        for (Captura capAtual : listaCaptura) {
            csvPrinter.printRecord(
                    capAtual.getFkAtm(),
                    capAtual.getDataHora(),
                    capAtual.getValorCpuPercent(),
                    capAtual.getLimiteCpuPercent(),
                    capAtual.getAlertaCpuPercent(),
                    capAtual.getValorCPUFreq(),
                    capAtual.getLimiteCPUFreq(),
                    capAtual.getAlertaCPUFreq(),
                    capAtual.getValorRAMDisponivel(),
                    capAtual.getValorRAMPercentual(),
                    capAtual.getLimiteRAMPercentual(),
                    capAtual.getAlertaRAMPercentual(),
                    capAtual.getValorDISKTotal(),
                    capAtual.getValorDISKDisponivel(),
                    capAtual.getValorDISKPercentual(),
                    capAtual.getLimiteDISKPercentual(),
                    capAtual.getAlertaDISKPercentual(),
                    capAtual.getValorREDERecebida(),
                    capAtual.getLimiteREDERecebida(),
                    capAtual.getAlertaREDERecebida(),
                    capAtual.getValorREDEEnviada(),
                    capAtual.getLimiteREDEEnviada(),
                    capAtual.getAlertaREDEEnviada(),
                    capAtual.getValorPROCESSODesativado(),
                    capAtual.getLimitePROCESSODesativado(),
                    capAtual.getAlertaPROCESSODesativado(),
                    capAtual.getValorPROCESSOAtivos(),
                    capAtual.getLimitePROCESSOAtivos(),
                    capAtual.getAlertaPROCESSOAtivos(),
                    capAtual.getValorPROCESSOTotal()
            );

        }

        csvPrinter.flush();
        escritor.close();

        return streamSaida;
    }

}
