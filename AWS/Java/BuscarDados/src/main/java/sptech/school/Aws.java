package sptech.school;

import software.amazon.awssdk.services.cloudwatchlogs.CloudWatchLogsClient;
import software.amazon.awssdk.services.cloudwatchlogs.model.*;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

import java.util.ArrayList;
import java.util.List;

public class Aws {
    public static S3ObjectInputStream buscarArquivo(String nomeBucket, String chaveObj) {
        System.out.println("Buscando Arquivo JSON do " + nomeBucket);
        AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
        S3Object s3Object = s3Client.getObject(new GetObjectRequest(nomeBucket, chaveObj));

        System.out.println("Arquivo JSON encontrado com sucesso!");
        return s3Object.getObjectContent();
    }

    public static GetLogEventsRequest buscarLogsCloudWatch(String logGroupName, String logStreamName) {
        System.out.println("Buscando Logs do CloudWatch...");
        GetLogEventsRequest getLogEventsRequest = null;
        try {
            getLogEventsRequest = GetLogEventsRequest.builder().logGroupName(logGroupName).logStreamName(logStreamName).startFromHead(true).build();
        } catch (CloudWatchLogsException e) {
            System.err.println(e.awsErrorDetails().errorMessage());
            System.out.println("Erro ao tentar buscar logs do CloudWatch " + e.getMessage());
        }
        return getLogEventsRequest;
    }

    public static List<OutputLogEvent> logsMapper(CloudWatchLogsClient cloudWatchLogsClient, GetLogEventsRequest getLogEventsRequest) {
        return cloudWatchLogsClient.getLogEvents(getLogEventsRequest).events();

    }
    public static List<String> listarLogStream(CloudWatchLogsClient client, String logGroupName) {
        List<String> streams = new ArrayList<>();

        DescribeLogStreamsRequest logsStream = DescribeLogStreamsRequest.builder().logGroupName(logGroupName).build();

        DescribeLogStreamsResponse resposta = client.describeLogStreams(logsStream);

        System.out.println("Buscando todos os Streams do " + logGroupName);

        List<LogStream> listaStream = resposta.logStreams();

        for (LogStream logAtual : listaStream) {
            streams.add(logAtual.logStreamName());
        }
        if (!streams.isEmpty()) {
            System.out.println("Streams Encontradas com Sucesso!");
        }

        return streams;

    }
}
