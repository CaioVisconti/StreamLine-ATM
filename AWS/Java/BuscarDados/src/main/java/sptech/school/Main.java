package sptech.school;

import com.amazonaws.services.s3.model.S3ObjectInputStream;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatchlogs.CloudWatchLogsClient;
import software.amazon.awssdk.services.cloudwatchlogs.model.GetLogEventsRequest;
import software.amazon.awssdk.services.cloudwatchlogs.model.OutputLogEvent;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.setProperty("aws.java.v1.disableDeprecationAnnouncement", "true");
        S3ObjectInputStream arq = Aws.buscarArquivo("bclientstreamline", "analiseAWS/Capturas_AWS.json");

        List<DadosAws> listaDados = new ArrayList<>();

        CloudWatchLogsClient cloudWatchLogsClientBuilder = CloudWatchLogsClient.builder().region(Region.US_EAST_1).build();

        List<String> streams = Aws.listarLogStream(cloudWatchLogsClientBuilder, "/aws/lambda/etlPythonV2");

        List<GetLogEventsRequest> eventos = new ArrayList<>();
        List<OutputLogEvent> mapeadorEventos = new ArrayList<>();

        for (String streamAtual : streams) {
            eventos.add(Aws.buscarLogsCloudWatch("/aws/lambda/etlPythonV2", streamAtual));
        }
        for (GetLogEventsRequest eventoAtual : eventos) {
            mapeadorEventos.addAll(Aws.logsMapper(cloudWatchLogsClientBuilder, eventoAtual));
        }
        try {
            listaDados = DadosAws.mapearDados(arq);
        } catch (IOException e) {
            System.out.println("Erro ao tentar mapear os dados " + e.getMessage());
        }
        try (Connection conn = ConexaoBanco.conectar();
             Statement query = conn.createStatement();) {
            for (DadosAws dadoAtual : listaDados) {
                String sqlInsert = String.format("INSERT INTO awsCusto (inicio, fim, servico, custo) VALUES ('%s', '%s', '%s', %s)", dadoAtual.getInicio(), dadoAtual.getFim(), dadoAtual.getServico().getFirst(), (Math.abs(dadoAtual.getCusto())));
                query.executeUpdate(sqlInsert);
            }
            System.out.println("Insert na tabela awsCusto foi realizado com sucesso!");
            for (OutputLogEvent evento : mapeadorEventos) {
                if (evento.message().contains("REPORT")) {
                    String[] partes = evento.message().split("\\s+");
                    String requestId = "";
                    String duracao = "";
                    String status = "";
                    String maxMemoryUsed = "";
                    String tipoErro = "";
                    for (int i = 0; i < partes.length; i++) {
                        if (partes[i].startsWith("RequestId:")) {
                            requestId = partes[i + 1];
                        } else if (partes[i].startsWith("Duration:")) {
                            duracao = partes[i + 1];
                        } else if (partes[i].startsWith("Status")) {
                            status = partes[i + 1];
                        } else if (partes[i].startsWith("Used:")) {
                            maxMemoryUsed = partes[i + 1];
                        } else if (partes[i].startsWith("Error")){
                            tipoErro = partes[i + 2];
                        }
                    }
                    if (!requestId.isBlank() && !duracao.isBlank() && !status.isBlank() && !maxMemoryUsed.isBlank()) {
                        String sqlInsert = String.format("INSERT INTO awslogs (requestId, duracao, memoriaUsada, statusLog, tipoErro, dataRegistro) VALUES ('%s', '%s', %s, '%s', '%s', now());", requestId, duracao, maxMemoryUsed, status, tipoErro);
                        query.executeUpdate(sqlInsert);
                    }
                }
            }
            System.out.println("Insert na tabela awsLogs foi realizado com sucesso!");
        } catch (SQLException e) {
            System.out.println("Erro ao tentar se conectar ao MySQL! " + e.getMessage());
        }

    }

}