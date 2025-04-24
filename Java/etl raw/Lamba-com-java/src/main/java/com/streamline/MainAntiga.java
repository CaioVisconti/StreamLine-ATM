package com.streamline;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class MainAntiga {
    public static void main(String[] args) {
        FileInputStream inputStream = null;
        CapturaMapper capturaMapper = new CapturaMapper();
        List<Captura> listaCaptura = new ArrayList<>();
        CsvWriter escritor = new CsvWriter();
        try {
            inputStream = new FileInputStream("Capturas.json");
        } catch (FileNotFoundException e) {
            System.out.println("Arquivo não encontrado! " + e.getMessage());
        }

        try {
            listaCaptura = capturaMapper.mapearCapturas(inputStream);
        } catch (IOException e) {
            System.out.println("Erro ao tentar mapear JSON de capturas " + e.getMessage());
        } finally {
            try {
                inputStream.close();
            } catch (IOException e) {
                System.out.println("Erro ao tentar fechar JSON de capturas " + e.getMessage());
            } catch (NullPointerException e) {
                System.out.println(e.getMessage());
            } catch (Exception e) {
                System.out.println("Erro! " + e.getMessage());
            }
        }

        for(Captura capAtual : listaCaptura){
            System.out.println(capAtual);
        }

        formatarDataHora(listaCaptura);

        try {
            escritor.escreverCsv(listaCaptura);
            System.out.println("CSV escrito com sucesso!");
        } catch (IOException e) {
            System.out.println("Ocorreu um erro ao tentar escrever o CSV! " + e.getMessage());
        }

    }

    public static void formatarDataHora(List<Captura> listaCaptura){
        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for(Captura capAtual : listaCaptura){
            LocalDateTime dataHora = LocalDateTime.parse(capAtual.getDataHora(), formatador);

            String dataFormatada = dataHora.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));

            capAtual.setDataHora(dataFormatada);
        }
    }

}
