package com.streamline;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
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
        FileWriter escritor = new FileWriter("capturas " + String.valueOf(formatador.format(dataHora)) + ".csv", StandardCharsets.UTF_8);
        CSVPrinter csvPrinter = new CSVPrinter(escritor, CSVFormat.DEFAULT.withHeader(
                "ATM",
                "Data Hora da Captura",
                "Porcentagem de Uso da CPU",
                "Limite de uso da CPU",
                "Alerta de CPU",
                "Frequência de uso da CPU",
                "Limite da frequência da CPU",
                "Alerta de CPU Freq",
                "RAM Disponível",
                "Porcentagem de Uso da RAM",
                "Limite de Uso da RAM",
                "Alerta de RAM",
                "Disco Total",
                "Disco Disponível",
                "Porcentagem de Uso do Disco",
                "Limite de Uso do Disco",
                "Alerta do Disco",
                "Rede Recebida",
                "Limite da Rede Recebida",
                "Alerta da Rede Recebida",
                "Rede Enviada",
                "Limite da Rede Enviada",
                "Alerta da Rede Enviada",
                "Processos Desativados",
                "Limite dos Processos Desativados",
                "Alerta de Processos Desativados",
                "Processos Ativos",
                "Limite dos Processos Ativos",
                "Alerta de Processos Ativos",
                "Total de Processos"
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
