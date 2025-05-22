package com.streamline;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

public class Main implements RequestHandler<S3Event, String> {

    private static final Log log = LogFactory.getLog(Main.class);
    private final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();

    private static final String DESTINATION_BUCKET = "bclient-streamline";

    @Override
    public String handleRequest(S3Event s3Event, Context context) {
        LambdaLogger logger = context.getLogger();

        String sourceBucket = "braw-streamline";

        List<S3ObjectSummary> objetos = s3Client.listObjects(sourceBucket).getObjectSummaries();

        List<S3ObjectSummary> objetosOrdenados = objetos.stream()
                .sorted(Comparator.comparing(S3ObjectSummary::getLastModified).reversed())
                .collect(Collectors.toList());

        String nomeInicial = objetosOrdenados.get(0).getKey();
        logger.log(nomeInicial);
        String[] separacaoExtensao = (nomeInicial).split("\\.");
        String[] separacaoDir = separacaoExtensao[0].split("/");
        String[] separacaoData = separacaoDir[2].split("_");
        String prefixo = "%s/%s/%s_%s_%s_%s".formatted(separacaoDir[0], separacaoDir[1], separacaoData[0], separacaoData[1], separacaoData[2], separacaoData[3]);
        logger.log("prefixo");
        logger.log(prefixo);

        S3Client s3Client = S3Client.builder().build();

        ListObjectsV2Request requisicaoArquivoInicial = ListObjectsV2Request.builder()
                .bucket(sourceBucket)
                .prefix(prefixo)
                .build();

        ListObjectsV2Iterable response = s3Client.listObjectsV2Paginator(requisicaoArquivoInicial);
        List<String> listaDocumentos = new ArrayList<>();

        for (ListObjectsV2Response page : response) {
            for (S3Object object : page.contents()) {
                listaDocumentos.add(object.key());
                logger.log(object.key());
            }
        }

        logger.log(nomeInicial);

        novaLista(listaDocumentos, sourceBucket, context, s3Event, DESTINATION_BUCKET, prefixo);

        return "Funcionou";
    }

    public String novaLista(List<String> indices, String sourceBucket, Context context, S3Event s3Event, String DESTINATION_BUCKET, String prefixo) {
        LambdaLogger logger = context.getLogger();

        String[] nomeTotal = prefixo.split("/");

        String nomeEnviado = "capturas/dia";

        logger.log(nomeEnviado);

        nomeEnviado = "%s/%s/%s.json".formatted(nomeEnviado, nomeTotal[1], nomeTotal[2]);

        logger.log(nomeEnviado);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
                byte[] buffer = new byte[1024];
                int bytesLidos;
                byte[] virgula = {44};
                byte[] inicio = {91};
                byte[] fim = {93};
                outputStream.write(inicio);
            for (String arquivo : indices) {
                InputStream s3InputStream = s3Client.getObject(sourceBucket, arquivo).getObjectContent();
                while ((bytesLidos = s3InputStream.read(buffer)) != -1) {
                    ByteArrayOutputStream temporario = new ByteArrayOutputStream();

                    for (int i = 0; i < bytesLidos; i++) {
                        byte b = buffer[i];
                        if (b != inicio[0] && b != fim[0]) {
                            temporario.write(b);
                        }
                    }

                    outputStream.write(temporario.toByteArray());
                }

                if(!arquivo.equals(indices.get(indices.size() - 1))) {
                    outputStream.write(virgula);
                }
            }
            outputStream.write(fim);

            InputStream jsonExportado = new ByteArrayInputStream(outputStream.toByteArray());

            try {
                s3Client.putObject(DESTINATION_BUCKET, nomeEnviado, jsonExportado, null);
            } catch (Exception e) {
                context.getLogger().log("Erro: " + e.getMessage());
                return "Erro no processamento";
            }
        } catch (IOException e) {
            System.err.println("Erro ao criar ou escrever no arquivo de saída: " + e.getMessage());
            e.printStackTrace();
        }
        return "Sucesso no processamento";
    }
}