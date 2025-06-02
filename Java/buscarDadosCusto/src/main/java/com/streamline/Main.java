package com.streamline;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class Main  implements RequestHandler<S3Event, String> {

    private static final Log log = LogFactory.getLog(Main.class);
    @Override
    public String handleRequest(S3Event s3Event, Context context) {
        LambdaLogger logger = context.getLogger();
        logger.log("Passou aqui");
        System.setProperty("aws.java.v1.disableDeprecationAnnouncement", "true");
        S3ObjectInputStream arq = null;
        Aws aws = new Aws();
        arq = aws.buscarArquivo("bclient-streamline", "analiseAWS/Capturas_AWS.json");
        List<DadosAws> listaDados = new ArrayList<>();


        logger.log(arq.toString());
        try {
            listaDados = DadosAws.mapearDados(arq);
        } catch (IOException e) {
            System.out.println("Erro ao tentar mapear os dados " + e.getMessage());
            System.exit(2);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao tentar mapear os dados " + e.getMessage() + " Verifique se as credenciais foram configuradas corretamente!");
            System.exit(3);
        }

        logger.log(listaDados.toString());
        try (Connection conn = ConexaoBanco.conectar();
             Statement query = conn.createStatement()) {
                logger.log("teste");
            for (DadosAws dadoAtual : listaDados) {
                logger.log(dadoAtual.toString());
                if (dadoAtual.getInicio() != null && !dadoAtual.getInicio().isBlank() && dadoAtual.getFim() != null && !dadoAtual.getFim().isBlank() && dadoAtual.getServico().getFirst() != null && !dadoAtual.getServico().getFirst().isBlank() && dadoAtual.getCusto() != null && !dadoAtual.getCusto().isNaN()) {
                    String sqlInsert = String.format("INSERT INTO awsCusto (inicio, fim, servico, custo) VALUES ('%s', '%s', '%s', %s)", dadoAtual.getInicio(), dadoAtual.getFim(), dadoAtual.getServico().getFirst(), (Math.abs(dadoAtual.getCusto())));
                    query.executeUpdate(sqlInsert);
                }
            }
            System.out.println("Insert na tabela awsCusto foi realizado com sucesso!");
            logger.log("Insert na tabela awsCusto foi realizado com sucesso!");
        } catch (SQLException e) {
            System.out.println("Erro ao tentar se conectar ao MySQL! " + e.getMessage());
            System.exit(4);
        }
        return "funcinoou aqui";
    }
}