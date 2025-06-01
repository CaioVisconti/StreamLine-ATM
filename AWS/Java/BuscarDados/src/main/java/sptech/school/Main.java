package sptech.school;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        System.setProperty("aws.java.v1.disableDeprecationAnnouncement", "true");
        S3ObjectInputStream arq = null;
        try {
            arq = Aws.buscarArquivo("bclientstreamline", "analiseAWS/Capturas_AWS.json");
        } catch (AmazonS3Exception e) {
            System.out.println("Erro ao tentar buscar o arquivo! " + e.getMessage());
            System.exit(1);
        }
        List<DadosAws> listaDados = new ArrayList<>();

        try {
            listaDados = DadosAws.mapearDados(arq);
        } catch (IOException e) {
            System.out.println("Erro ao tentar mapear os dados " + e.getMessage());
            System.exit(2);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao tentar mapear os dados " + e.getMessage() + " Verifique se as credenciais foram configuradas corretamente!");
            System.exit(3);
        }
        try (Connection conn = ConexaoBanco.conectar();
             Statement query = conn.createStatement()) {
            for (DadosAws dadoAtual : listaDados) {
                if (dadoAtual.getInicio() != null && !dadoAtual.getInicio().isBlank() && dadoAtual.getFim() != null && !dadoAtual.getFim().isBlank() && dadoAtual.getServico().getFirst() != null && !dadoAtual.getServico().getFirst().isBlank() && dadoAtual.getCusto() != null && !dadoAtual.getCusto().isNaN()) {
                    String sqlInsert = String.format("INSERT INTO awsCusto (inicio, fim, servico, custo) VALUES ('%s', '%s', '%s', %s)", dadoAtual.getInicio(), dadoAtual.getFim(), dadoAtual.getServico().getFirst(), (Math.abs(dadoAtual.getCusto())));
                    query.executeUpdate(sqlInsert);
                }
            }
            System.out.println("Insert na tabela awsCusto foi realizado com sucesso!");
        } catch (SQLException e) {
            System.out.println("Erro ao tentar se conectar ao MySQL! " + e.getMessage());
            System.exit(4);
        }

    }

}