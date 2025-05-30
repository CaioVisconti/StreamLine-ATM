package com.streamline;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

public class TempoReal {
    private final AmazonS3 client = AmazonS3ClientBuilder.defaultClient();
        public String transformarTempoReal(String sourceBucket, String arq, String[] separacao, LambdaLogger logger) {


        String[] separado = separacao[2].split("_");
        logger.log(separacao[2]);
        String dir = "%s%s".formatted(separado[0], separado[1]);
        arq = "%s/dia/%s/Capturas.json".formatted(arq, dir);
        arq = "%s_%s_%s.json".formatted(arq.split("\\.")[0], separacao[2],separacao[3]);

        InputStream s3InputStream = client.getObject(sourceBucket, arq).getObjectContent();

        CapturaMapper capturaMapper = new CapturaMapper();
        List<Captura> lista;

        try {
            lista = capturaMapper.mapearCapturas(s3InputStream);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        StringBuilder stringBuilder = new StringBuilder();
        Formatador formatador = new Formatador();
        try (InputStreamReader isr = new InputStreamReader(formatador.formatarInputstream(lista));
             BufferedReader reader = new BufferedReader(isr)) {
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line).append("\n");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return stringBuilder.toString();
    }
}
