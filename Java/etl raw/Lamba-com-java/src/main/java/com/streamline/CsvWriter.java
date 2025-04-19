package com.streamline;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class CsvWriter {
    public ByteArrayOutputStream escreverCsv(Map<String, List<Captura>> mapCaptura) throws IOException {
        LocalDate localDate = LocalDate.now();
        ByteArrayOutputStream streamSaida = new ByteArrayOutputStream();
        FileWriter escritor = new FileWriter("capturas " + String.valueOf(localDate) + ".csv", StandardCharsets.UTF_8);
        CSVPrinter csvPrinter = null;
        for (Map.Entry<String, List<Captura>> map : mapCaptura.entrySet()) {
            csvPrinter = new CSVPrinter(escritor, CSVFormat.DEFAULT.withHeader("Data Hora da Captura", "ATM", map.getKey(), "Unidade", "Limite", "Alerta?"));
            String tipo = map.getKey();

            List<Captura> valor = map.getValue();

            for (Captura capAtual : valor) {
                csvPrinter.printRecord(
                        capAtual.getDataHora(),
                        capAtual.getFkAtm(),
                        capAtual.getValor(),
                        capAtual.getUnidade(),
                        capAtual.getLimite(),
                        capAtual.getAlerta()
                );
            }
        }

        if (csvPrinter != null) {
            csvPrinter.flush();
        }
        escritor.close();

        return streamSaida;
    }

}
