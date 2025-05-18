package sptech.school;

import com.amazonaws.services.s3.model.S3ObjectInputStream;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        S3ObjectInputStream arq = Aws.buscarArquivo("bclientstreamline", "analiseAWS/Capturas_AWS.json");
        List<DadosAws> listaDados = new ArrayList<>();

        try {
            listaDados = DadosAws.mapearDados(arq);
        } catch (IOException e) {
            System.out.println("Erro ao tentar mapear os dados " + e.getMessage());
        }

        try (Connection conn = ConexaoBanco.conectar();
             Statement query = conn.createStatement();) {
            for (DadosAws dadoAtual : listaDados) {
                String sqlInsert = String.format("INSERT INTO aws (inicio, fim, servico, custo) VALUES ('%s', '%s', '%s', %s)", dadoAtual.getInicio(), dadoAtual.getFim(), dadoAtual.getServico().getFirst(), String.valueOf(dadoAtual.getCusto()).replace(",", "."));
                System.out.println(sqlInsert);
                System.out.println(dadoAtual);
                query.executeUpdate(sqlInsert);
            }
        } catch (SQLException e) {
            System.out.println("Erro ao tentar se conectar ao MySQL! " + e.getMessage());
        }

    }
}