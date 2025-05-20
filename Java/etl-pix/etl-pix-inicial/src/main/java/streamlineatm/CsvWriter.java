package streamlineatm;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class CsvWriter {

    public ByteArrayOutputStream escreverCsv(List<Pix> lista) throws IOException {

        ByteArrayOutputStream streamSaida = new ByteArrayOutputStream();

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(streamSaida, StandardCharsets.UTF_8));

        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withDelimiter(';').withHeader(
                "Ano",
                "Mês",
                "Pagante",
                "RegiaoPagante",
                "IdadePagante",
                "Formato",
                "Natureza",
                "ValorTotal"

        ));

        for (Pix p : lista) {
            csvPrinter.printRecord(
                    p.getAno(),
                    p.getMes(),
                    p.getPagante(),
                    p.getRegiaoPagante(),
                    p.getIdadePagante(),
                    p.getFormato(),
                    p.getNatureza(),
                    p.getValorTotal()
            );
        }

        csvPrinter.flush();
        writer.close();

        return streamSaida;

    }
}
