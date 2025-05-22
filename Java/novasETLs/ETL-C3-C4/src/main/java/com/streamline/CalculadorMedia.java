package com.streamline;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class CalculadorMedia {
    public final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
    public List<Captura> formatar(List<String> lista, String sourceBucket, String tipo, S3Event s3Event, LambdaLogger logger) {

        List<Captura> capturas = new ArrayList<>();
        for (String nome : lista) {
            logger.log(sourceBucket);
            InputStream s3InputStream = s3Client.getObject(sourceBucket, nome).getObjectContent();
            try {
                CapturaMapper mapper = new CapturaMapper();
                capturas = mapper.mapearCapturas(s3InputStream);
            } catch (IOException e) {
                logger.log("Falha ao mapear");
                throw new RuntimeException(e);
            }
        }

        UltimaSemana s = new UltimaSemana();
        List<Captura> listaDias = s.organizarUltimaSemana(lista.size(), capturas);
        if(tipo.equals("ultimaSemana")) {
            return listaDias;
        }

        UltimoMes m = new UltimoMes();
        List<Captura> listaMes = m.organizarUltimoMes(listaDias, capturas, logger);
        if(tipo.equals("ultimoMes")) {
            return listaMes;
        }

        UltimoSemestre sem = new UltimoSemestre();
        return sem.organizarUltimoSemestre(listaDias, capturas);
    }
}
