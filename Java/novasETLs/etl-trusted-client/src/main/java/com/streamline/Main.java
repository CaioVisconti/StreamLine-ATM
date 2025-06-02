package com.streamline;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
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

    private static final String DESTINATION_BUCKET = "client-streamline-atm";

    @Override
    public String handleRequest(S3Event s3Event, Context context) {
        String sourceBucket = s3Event.getRecords().get(0).getS3().getBucket().getName();
        String documentoInicial = s3Event.getRecords().get(0).getS3().getObject().getKey();

        String[] documentoDividido = documentoInicial.split("\\.");
        String[] nomeDividido = documentoDividido[0].split("_");

        String extensaoInicial = documentoDividido[1];
        String[] data = nomeDividido[3].split("-");
        Integer dataAnterior = Integer.parseInt(data[0]) - 1;

        String nomeTxt = "%s_%s_%d.%s".formatted(nomeDividido[1], nomeDividido[2], dataAnterior, extensaoInicial);

        if(extensaoInicial.equals(".txt")) {
            return "fora";
        }

        List<String> listaDocumentos = new ArrayList<>();

        String nome = "%s_%s_%s_%s".formatted(nomeDividido[0], nomeDividido[1], nomeDividido[2], nomeDividido[3]);

        S3Client s3Client = S3Client.builder().build();

        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(sourceBucket)
                .prefix(nome)
                .build();

        ListObjectsV2Iterable response = s3Client.listObjectsV2Paginator(request);
        LambdaLogger logger = context.getLogger();

        for (ListObjectsV2Response page : response) {
            for (S3Object object : page.contents()) {
                listaDocumentos.add(object.key());
                logger.log(object.key());
            }
        }

        if(listaDocumentos.size() == 12){
            return novaLista(listaDocumentos, sourceBucket, context, s3Event, DESTINATION_BUCKET);
        }
        return "Não foi";
    }

    public String novaLista(List<String> indices, String sourceBucket, Context context, S3Event s3Event, String DESTINATION_BUCKET) {
        String nomeArquivoRecebido = s3Event.getRecords().get(0).getS3().getObject().getKey();
        String[] nomeFinal = (nomeArquivoRecebido.split("\\.")[0]).split("_");
        String[] dataDividida = nomeFinal[3].split("-");
        LambdaLogger logger = context.getLogger();

        String nomeEnviado = "%s_%s_%s_%s_%s_%s%s".formatted(nomeFinal[0], nomeFinal[1], nomeFinal[2], dataDividida[0], dataDividida[1], dataDividida[2], ".csv");

        logger.log(nomeEnviado);

        ByteArrayOutputStream outputStream = null;

        BufferedWriter writer = null;
        CSVPrinter csvPrinter = null;

        String cabecalho = "fkAtm,dataHora,valorCpuPercent,limiteCpuPercent,alertaCpuPercent,valorCPUFreq,limiteCPUFreq,alertaCPUFreq,valorRAMDisponivel,valorRAMPercentual,limiteRAMPercentual,alertaRAMPercentual,valorDISKTotal,valorDISKDisponivel,valorDISKPercentual,limiteDISKPercentual,alertaDISKPercentual,valorREDERecebida,limiteREDERecebida,alertaREDERecebida,valorREDEEnviada,limiteREDEEnviada,alertaREDEEnviada,valorPROCESSODesativado,limitePROCESSODesativado,alertaPROCESSODesativado,valorPROCESSOAtivos,limitePROCESSOAtivos,alertaPROCESSOAtivos,valorPROCESSOTotal";
        String[] header = cabecalho.split(",");

        try {
            outputStream = new ByteArrayOutputStream();
            writer = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8));
            csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(header[0],header[1],header[2],header[3],header[4],header[5],header[6],header[7],header[8],header[9],header[10],header[11],header[12],header[13],header[14],header[15],header[16],header[17],header[18],header[19],header[20],header[21],header[22],header[23],header[24],header[25],header[26],header[27],header[28],header[29]));
        }
        catch (IOException err) {
            System.err.println("Erro ao criar ou escrever no arquivo de saída: " + err.getMessage());
            err.printStackTrace();
        }

        try {
            for (String arquivo : indices) {
                InputStream s3InputStream = s3Client.getObject(sourceBucket, arquivo).getObjectContent();
                try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(s3InputStream))) {
                    String linha;

                    while ((linha = bufferedReader.readLine()) != null) {
                        if(!cabecalho.equals(linha)) {
                            csvPrinter.printRecord(linha);
                        }
                    }
                } catch (IOException e) {
                    System.err.println("Erro ao ler " + arquivo + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }

            csvPrinter.flush();
            writer.close();

            InputStream csvInputStream = new ByteArrayInputStream(outputStream.toByteArray());

            try {
                s3Client.putObject(DESTINATION_BUCKET, nomeEnviado, csvInputStream, null);
                // s3Client.putObject(sourceBucket, nomeEnviado.replace(".csv", ".txt"), txt, null);
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