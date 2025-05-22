package com.streamline;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.google.gson.Gson;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class UltimaSemana {
    private final AmazonS3 client = AmazonS3ClientBuilder.defaultClient();
    public String transformarUltimaSemana(String sourceBucket, String arq, String[] separacao, LambdaLogger logger) {
        logger.log("entrouTranformarUltimoDia");
        String[] separado = separacao[2].split("_");
        logger.log(separacao[2]);
        String dir = "%s%s".formatted(separado[0], separado[1]);

        arq = "%s/ultimaSemana/%s/Capturas.json".formatted(arq, dir);

        logger.log(arq);

        S3Client s3Client = S3Client.builder().build();

        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(sourceBucket)
                .prefix(arq)
                .build();

        ListObjectsV2Iterable response = s3Client.listObjectsV2Paginator(request);

        for (ListObjectsV2Response page : response) {
            for (S3Object object : page.contents()) {
                arq = object.key();
                logger.log(arq);
                break;
            }
            break;
        }

        InputStream s3InputStream = client.getObject(sourceBucket, arq).getObjectContent();

        StringBuilder stringBuilder = new StringBuilder();
        try (InputStreamReader isr = new InputStreamReader(s3InputStream);
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
