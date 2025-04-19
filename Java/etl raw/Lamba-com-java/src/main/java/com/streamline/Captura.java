package com.streamline;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Captura {
    @JsonProperty("fkAtm")
    private Integer fkAtm;
    @JsonProperty("tipo")
    private String tipo;
    @JsonProperty("unidade")
    private String unidade;
    @JsonProperty("valor")
    private Double valor;
    @JsonProperty("limite")
    private Double limite;
    @JsonProperty("alerta")
    private Boolean alerta;
    @JsonProperty("dataHora")
    private String dataHora;


    public Captura() {
    }

    public Integer getFkAtm() {
        return fkAtm;
    }

    public void setFkAtm(Integer fkAtm) {
        this.fkAtm = fkAtm;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getUnidade() {
        return unidade;
    }

    public void setUnidade(String unidade) {
        this.unidade = unidade;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Double getLimite() {
        return limite;
    }

    public void setLimite(Double limite) {
        this.limite = limite;
    }

    public Boolean getAlerta() {
        return alerta;
    }

    public void setAlerta(Boolean alerta) {
        this.alerta = alerta;
    }

    public String getDataHora() {
        return dataHora;
    }

    public void setDataHora(String dataHora) {
        this.dataHora = dataHora;
    }

    @Override
    public String toString() {
        return "Captura{" +
                "fkAtm=" + fkAtm +
                ", tipo='" + tipo + '\'' +
                ", unidade='" + unidade + '\'' +
                ", valor=" + valor +
                ", limite=" + limite +
                ", alerta=" + alerta +
                ", dataHora=" + dataHora +
                '}';
    }
}
