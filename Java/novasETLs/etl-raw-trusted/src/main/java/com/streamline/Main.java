package com.streamline;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class Main implements RequestHandler<S3Event, String> {

    private static final Log log = LogFactory.getLog(Main.class);

    private final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();

    private static final String DESTINATION_BUCKET = "btrusted-streamline";

    public String handleRequest(S3Event s3Event, Context context) {

        String sourceBucket = s3Event.getRecords().get(0).getS3().getBucket().getName();
        String sourceKey = s3Event.getRecords().get(0).getS3().getObject().getKey();

        try {
            LambdaLogger logger = context.getLogger();

            // Leitura do arquivo JSON do bucket de origem
            InputStream s3InputStream = s3Client.getObject(sourceBucket, sourceKey).getObjectContent();

            // Conversão do JSON para uma lista de capturas usando o Mapper
            CapturaMapper mapper = new CapturaMapper();
            List<Captura> capturas = mapper.mapearCapturas(s3InputStream);

            formatarDataHora(capturas);

            // Geração do arquivo CSV a partir da lista de capturas usando o CsvWriter
            CsvWriter csvWriter = new CsvWriter();
            ByteArrayOutputStream csvOutputStream = csvWriter.escreverCsv(capturas);

            logger.log("FUNCIONOU");
            // Converte o ByteArrayOutputStream para InputStream para enviar ao bucket de destino
            InputStream csvInputStream = new ByteArrayInputStream(csvOutputStream.toByteArray());
            logger.log(sourceKey.replace(".json", ".csv"));

            // Envio do CSV para o bucket de destino
            s3Client.putObject(DESTINATION_BUCKET, sourceKey.replace(".json", ".csv"), csvInputStream, null);

            return "Sucesso no processamento";
        } catch (IOException e) {
            context.getLogger().log("Erro ao tentar mapear capturas: " + e.getMessage());
            return "Erro no processamento";
        } catch (Exception e) {
            context.getLogger().log("Erro: " + e.getMessage());
            return "Erro no processamento";
        }

    }
    public static void formatarDataHora (List < Captura > listaCaptura) {
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (Captura capAtual : listaCaptura) {
            LocalDateTime dataHora = LocalDateTime.parse(capAtual.getDataHora(), formatador);

            String dataFormatada = dataHora.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));

            capAtual.setDataHora(dataFormatada);
        }
    }

}
