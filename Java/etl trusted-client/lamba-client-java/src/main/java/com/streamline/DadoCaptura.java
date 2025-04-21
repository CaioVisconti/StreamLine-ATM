package com.streamline;

public class DadoCaptura {
    private String hostname;
    private String componente;
    private double valor;
    private String dataHora;

    public DadoCaptura(String hostname, String componente, double valor, String dataHora) {
        this.hostname = hostname;
        this.componente = componente;
        this.valor = valor;
        this.dataHora = dataHora;
    }

    public String getHostname() {
        return hostname;
    }

    public String getComponente() {
        return componente;
    }

    public double getValor() {
        return valor;
    }

    public String getDataHora() {
        return dataHora;
    }
}