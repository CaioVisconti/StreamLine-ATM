package com.streamline;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        FileInputStream inputStream = null;
        CapturaMapper capturaMapper = new CapturaMapper();
        List<Captura> listaCaptura = new ArrayList<>();

        try{
            inputStream = new FileInputStream("Capturas.json");
        } catch (FileNotFoundException e){
            System.out.println("Arquivo não encontrado! " + e.getMessage());
        }

        try {
            listaCaptura = capturaMapper.mapearCapturas(inputStream);
        } catch (IOException e){
            System.out.println("Erro ao tentar mapear JSON de capturas " + e.getMessage());
        } finally {
            try{
                inputStream.close();
            } catch (IOException e) {
                System.out.println("Erro ao tentar fechar JSON de capturas " + e.getMessage());
            } catch (NullPointerException e) {
                System.out.println(e.getMessage());
            } catch (Exception e){
                System.out.println("Erro! " + e.getMessage());
            }
        }

        for(Captura capturaAtual : listaCaptura){
            System.out.println(capturaAtual);
        }
    }
}