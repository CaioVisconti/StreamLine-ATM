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
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
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
    public final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();

    private static final String DESTINATION_BUCKET = "client-streamline-atm";

    @Override
    public String handleRequest(S3Event s3Event, Context context) {
        LambdaLogger logger = context.getLogger();
        String sourceBucket = s3Event.getRecords().get(0).getS3().getBucket().getName();

        String documentoInicial = s3Event.getRecords().get(0).getS3().getObject().getKey();
        logger.log(documentoInicial);

        String[] documentoDividido = documentoInicial.split("\\.");
        String[] nomeDividido = documentoDividido[0].split("_");

        String[] data = nomeDividido[3].split("-");

        List<String> listaSemana = new ArrayList<>();
        List<String> listaMes = new ArrayList<>();
        List<String> listaSemestre = new ArrayList<>();

        ListObjectsRequest req = new ListObjectsRequest()
                .withBucketName(sourceBucket)
                .withPrefix(nomeDividido[0]);

        ObjectListing listing = s3Client.listObjects(req);
        List<S3ObjectSummary> objetos = listing.getObjectSummaries();

        List<S3ObjectSummary> objetosOrdenados = objetos.stream()
                .sorted(Comparator.comparing(S3ObjectSummary::getLastModified).reversed())
                .collect(Collectors.toList());

        for(S3ObjectSummary obj : objetosOrdenados) {
            logger.log(obj.getKey());

            if(listaSemana.size() < 7) {
                listaSemana.add(obj.getKey());
            }

            if(listaMes.size() < 30) {
                listaMes.add(obj.getKey());
            }

            if(listaSemestre.size() < 180) {
                listaSemestre.add(obj.getKey());
            } else {
                break;
            }
        }

        CalculadorMedia calc = new CalculadorMedia();
        Formatador formatador = new Formatador();

        String nomeArqSemana = formatador.formatarNomeArquivo(s3Event, "ultimaSemana");
        List<Captura> listaSemanaFormatada = calc.formatar(listaSemana, sourceBucket, "ultimaSemana", s3Event, logger);
        try {
            novaLista(listaSemanaFormatada, nomeArqSemana, context, DESTINATION_BUCKET);
        } catch (IOException e) {
            logger.log("Deu pau na semana");
            throw new RuntimeException(e);
        }

        String nomeArqMes = formatador.formatarNomeArquivo(s3Event, "ultimoMes");
        List<Captura> listaMesFormatado = calc.formatar(listaMes, sourceBucket, "ultimoMes", s3Event, logger);
        try {
            novaLista(listaMesFormatado, nomeArqMes, context, DESTINATION_BUCKET);
        } catch (IOException e) {
            logger.log("Deu pau na semana");
            throw new RuntimeException(e);
        }

        String nomeArqSemestre = formatador.formatarNomeArquivo(s3Event, "ultimoSemestre");
        List<Captura> listaSemestreFormatado = calc.formatar(listaSemestre, sourceBucket, "ultimoSemestre", s3Event, logger);
        try {
            novaLista(listaSemestreFormatado, nomeArqSemestre, context, DESTINATION_BUCKET);
        } catch (IOException e) {
            logger.log("Deu pau na semana");
            throw new RuntimeException(e);
        }

        return "Funcionou";
    }

    public String novaLista(List<Captura> lista, String nomeEnviado, Context context, String DESTINATION_BUCKET) throws IOException {
        Formatador formatador = new Formatador();

        try {
            s3Client.putObject(DESTINATION_BUCKET, nomeEnviado, formatador.formatarInputstream(lista), null);
        } catch (Exception e) {
            context.getLogger().log("Erro: " + e.getMessage());
            return "Erro no processamento";
        }
        return "Sucesso no processamento";
    }
}