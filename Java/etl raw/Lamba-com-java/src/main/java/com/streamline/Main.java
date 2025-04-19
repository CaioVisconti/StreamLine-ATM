package com.streamline;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        FileInputStream inputStream = null;
        CapturaMapper capturaMapper = new CapturaMapper();
        List<Captura> listaCaptura = new ArrayList<>();

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

        Map<String, List<Captura>> map = organizarDados(listaCaptura);

        for(Map.Entry<String, List<Captura>> infoAtual : map.entrySet()){
            String tipo = infoAtual.getKey();
            List<Captura> listaCap = infoAtual.getValue();

            System.out.println("=== " + tipo + " ===");

            for(Captura capAtual : listaCap){
                System.out.println("ATM: " + capAtual.getFkAtm() + ", Valor " + capAtual.getValor() + ", Unidade: " + capAtual.getUnidade() + ", Limite: " + capAtual.getLimite() + ", Alerta: " + capAtual.getAlerta() + ", Data Hora: " + capAtual.getDataHora());
            }

        }

    }

    public static Map<String, List<Captura>> organizarDados(List<Captura> capturas) {
        Map<String, List<Captura>> capturasMap = new HashMap<>();

        for (Captura capAtual : capturas) {
            if(!capturasMap.containsKey(capAtual.getTipo())){
                capturasMap.put(capAtual.getTipo(), new ArrayList<>());
            }

            capturasMap.get(capAtual.getTipo()).add(capAtual);
        }
        return capturasMap;
    }


}
