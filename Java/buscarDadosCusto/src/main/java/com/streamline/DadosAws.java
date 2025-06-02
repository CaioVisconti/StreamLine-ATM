package com.streamline;


import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DadosAws {
    @JsonProperty("Inicio")
    private String inicio;
    @JsonProperty("Fim")
    private String fim;
    @JsonProperty("Servico")
    private List<String> servico;
    @JsonProperty("Custo")
    private Double custo;

    public DadosAws(String inicio, String fim, Double custo) {
        this.inicio = inicio;
        this.fim = fim;
        this.servico = new ArrayList<>();
        this.custo = custo;
    }

    public DadosAws() {
    }

    public static List<DadosAws> mapearDados(S3ObjectInputStream inputStream) throws IOException {
        ObjectMapper mapearObj = new ObjectMapper();

        return mapearObj.readValue(inputStream, new TypeReference<List<DadosAws>>() {
        });
    }

    public String getInicio() {
        return inicio;
    }

    public void setInicio(String inicio) {
        this.inicio = inicio;
    }

    public String getFim() {
        return fim;
    }

    public void setFim(String fim) {
        this.fim = fim;
    }

    public List<String> getServico() {
        return servico;
    }

    public void setServico(List<String> servico) {
        this.servico = servico;
    }

    public Double getCusto() {
        return custo;
    }

    public void setCusto(Double custo) {
        this.custo = custo;
    }

    @Override
    public String toString() {
        return "DadosAws{" +
                "inicio='" + inicio + '\'' +
                ", fim='" + fim + '\'' +
                ", servico='" + servico + '\'' +
                ", custo=" + custo +
                '}';
    }
}
