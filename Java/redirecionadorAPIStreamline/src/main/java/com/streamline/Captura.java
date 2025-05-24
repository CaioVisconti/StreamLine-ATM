package com.streamline;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Captura {
    @JsonProperty("fkAtm")
    private Integer fkAtm;
    @JsonProperty("dataHora")
    private String dataHora;
    @JsonProperty("CPUPercent")
    private Double valorCpuPercent;
    @JsonProperty("limite CPUPercent")
    private Double limiteCpuPercent;
    @JsonProperty("alerta CPUPercent")
    private Boolean alertaCpuPercent;
    @JsonProperty("CPUFreq")
    private Double valorCPUFreq;
    @JsonProperty("limite CPUFreq")
    private Double limiteCPUFreq;
    @JsonProperty("alerta CPUFreq")
    private Boolean alertaCPUFreq;
    @JsonProperty("RAMDisponivel")
    private Double valorRAMDisponivel;
    @JsonProperty("RAMPercentual")
    private Double valorRAMPercentual;
    @JsonProperty("limite RAMPercentual")
    private Double limiteRAMPercentual;
    @JsonProperty("alerta RAMPercentual")
    private Boolean alertaRAMPercentual;
    @JsonProperty("DISKTotal")
    private Double valorDISKTotal;
    @JsonProperty("DISKDisponivel")
    private Double valorDISKDisponivel;
    @JsonProperty("DISKPercentual")
    private Double valorDISKPercentual;
    @JsonProperty("limite DISKPercentual")
    private Double limiteDISKPercentual;
    @JsonProperty("alerta DISKPercentual")
    private Boolean alertaDISKPercentual;
    @JsonProperty("REDERecebida")
    private Double valorREDERecebida;
    @JsonProperty("limite REDERecebida")
    private Double limiteREDERecebida;
    @JsonProperty("alerta REDERecebida")
    private Boolean alertaREDERecebida;
    @JsonProperty("REDEEnviada")
    private Double valorREDEEnviada;
    @JsonProperty("limite REDEEnviada")
    private Double limiteREDEEnviada;
    @JsonProperty("alerta REDEEnviada")
    private Boolean alertaREDEEnviada;
    @JsonProperty("PROCESSODesativado")
    private Double valorPROCESSODesativado;
    @JsonProperty("limite PROCESSODesativado")
    private Double limitePROCESSODesativado;
    @JsonProperty("alerta PROCESSODesativado")
    private Boolean alertaPROCESSODesativado;
    @JsonProperty("PROCESSOAtivos")
    private Double valorPROCESSOAtivos;
    @JsonProperty("limite PROCESSOAtivos")
    private Double limitePROCESSOAtivos;
    @JsonProperty("alerta PROCESSOAtivos")
    private Boolean alertaPROCESSOAtivos;
    @JsonProperty("PROCESSOTotal")
    private Double valorPROCESSOTotal;

    private Integer qtdAlertaCPUP;
    private Integer qtdAlertaCPUF;
    private Integer qtdAlertaRAMP;
    private Integer qtdAlertaDISKP;
    private Integer qtdAlertaREDER;
    private Integer qtdAlertaREDEE;
    private Integer qtdAlertaPROCESSOA;
    private Integer qtdAlertaPROCESSOD;

    public Captura() {
        this.qtdAlertaCPUP = 0;
        this.qtdAlertaCPUF = 0;
        this.qtdAlertaRAMP = 0;
        this.qtdAlertaDISKP = 0;
        this.qtdAlertaREDEE = 0;
        this.qtdAlertaREDER = 0;
        this.qtdAlertaPROCESSOD = 0;
        this.qtdAlertaPROCESSOA = 0;
    }

    public Integer getFkAtm() {
        return fkAtm;
    }

    public void setFkAtm(Integer fkAtm) {
        this.fkAtm = fkAtm;
    }

    public String getDataHora() {
        return dataHora;
    }

    public void setDataHora(String dataHora) {
        this.dataHora = dataHora;
    }

    public Double getValorCpuPercent() {
        return valorCpuPercent;
    }

    public void setValorCpuPercent(Double valorCpuPercent) {
        this.valorCpuPercent = valorCpuPercent;
    }

    public Double getLimiteCpuPercent() {
        return limiteCpuPercent;
    }

    public void setLimiteCpuPercent(Double limiteCpuPercent) {
        this.limiteCpuPercent = limiteCpuPercent;
    }

    public Boolean getAlertaCpuPercent() {
        return alertaCpuPercent;
    }

    public void setAlertaCpuPercent(Boolean alertaCpuPercent) {
        this.alertaCpuPercent = alertaCpuPercent;
    }

    public Double getValorCPUFreq() {
        return valorCPUFreq;
    }

    public void setValorCPUFreq(Double valorCPUFreq) {
        this.valorCPUFreq = valorCPUFreq;
    }

    public Double getLimiteCPUFreq() {
        return limiteCPUFreq;
    }

    public void setLimiteCPUFreq(Double limiteCPUFreq) {
        this.limiteCPUFreq = limiteCPUFreq;
    }

    public Boolean getAlertaCPUFreq() {
        return alertaCPUFreq;
    }

    public void setAlertaCPUFreq(Boolean alertaCPUFreq) {
        this.alertaCPUFreq = alertaCPUFreq;
    }

    public Double getValorRAMDisponivel() {
        return valorRAMDisponivel;
    }

    public void setValorRAMDisponivel(Double valorRAMDisponivel) {
        this.valorRAMDisponivel = valorRAMDisponivel;
    }

    public Double getValorRAMPercentual() {
        return valorRAMPercentual;
    }

    public void setValorRAMPercentual(Double valorRAMPercentual) {
        this.valorRAMPercentual = valorRAMPercentual;
    }

    public Double getLimiteRAMPercentual() {
        return limiteRAMPercentual;
    }

    public void setLimiteRAMPercentual(Double limiteRAMPercentual) {
        this.limiteRAMPercentual = limiteRAMPercentual;
    }

    public Boolean getAlertaRAMPercentual() {
        return alertaRAMPercentual;
    }

    public void setAlertaRAMPercentual(Boolean alertaRAMPercentual) {
        this.alertaRAMPercentual = alertaRAMPercentual;
    }

    public Double getValorDISKTotal() {
        return valorDISKTotal;
    }

    public void setValorDISKTotal(Double valorDISKTotal) {
        this.valorDISKTotal = valorDISKTotal;
    }

    public Double getValorDISKDisponivel() {
        return valorDISKDisponivel;
    }

    public void setValorDISKDisponivel(Double valorDISKDisponivel) {
        this.valorDISKDisponivel = valorDISKDisponivel;
    }

    public Double getValorDISKPercentual() {
        return valorDISKPercentual;
    }

    public void setValorDISKPercentual(Double valorDISKPercentual) {
        this.valorDISKPercentual = valorDISKPercentual;
    }

    public Double getLimiteDISKPercentual() {
        return limiteDISKPercentual;
    }

    public void setLimiteDISKPercentual(Double limiteDISKPercentual) {
        this.limiteDISKPercentual = limiteDISKPercentual;
    }

    public Boolean getAlertaDISKPercentual() {
        return alertaDISKPercentual;
    }

    public void setAlertaDISKPercentual(Boolean alertaDISKPercentual) {
        this.alertaDISKPercentual = alertaDISKPercentual;
    }

    public Double getValorREDERecebida() {
        return valorREDERecebida;
    }

    public void setValorREDERecebida(Double valorREDERecebida) {
        this.valorREDERecebida = valorREDERecebida;
    }

    public Double getLimiteREDERecebida() {
        return limiteREDERecebida;
    }

    public void setLimiteREDERecebida(Double limiteREDERecebida) {
        this.limiteREDERecebida = limiteREDERecebida;
    }

    public Boolean getAlertaREDERecebida() {
        return alertaREDERecebida;
    }

    public void setAlertaREDERecebida(Boolean alertaREDERecebida) {
        this.alertaREDERecebida = alertaREDERecebida;
    }

    public Double getValorREDEEnviada() {
        return valorREDEEnviada;
    }

    public void setValorREDEEnviada(Double valorREDEEnviada) {
        this.valorREDEEnviada = valorREDEEnviada;
    }

    public Double getLimiteREDEEnviada() {
        return limiteREDEEnviada;
    }

    public void setLimiteREDEEnviada(Double limiteREDEEnviada) {
        this.limiteREDEEnviada = limiteREDEEnviada;
    }

    public Boolean getAlertaREDEEnviada() {
        return alertaREDEEnviada;
    }

    public void setAlertaREDEEnviada(Boolean alertaREDEEnviada) {
        this.alertaREDEEnviada = alertaREDEEnviada;
    }

    public Double getValorPROCESSODesativado() {
        return valorPROCESSODesativado;
    }

    public void setValorPROCESSODesativado(Double valorPROCESSODesativado) {
        this.valorPROCESSODesativado = valorPROCESSODesativado;
    }

    public Double getLimitePROCESSODesativado() {
        return limitePROCESSODesativado;
    }

    public void setLimitePROCESSODesativado(Double limitePROCESSODesativado) {
        this.limitePROCESSODesativado = limitePROCESSODesativado;
    }

    public Boolean getAlertaPROCESSODesativado() {
        return alertaPROCESSODesativado;
    }

    public void setAlertaPROCESSODesativado(Boolean alertaPROCESSODesativado) {
        this.alertaPROCESSODesativado = alertaPROCESSODesativado;
    }

    public Double getValorPROCESSOAtivos() {
        return valorPROCESSOAtivos;
    }

    public void setValorPROCESSOAtivos(Double valorPROCESSOAtivos) {
        this.valorPROCESSOAtivos = valorPROCESSOAtivos;
    }

    public Double getLimitePROCESSOAtivos() {
        return limitePROCESSOAtivos;
    }

    public void setLimitePROCESSOAtivos(Double limitePROCESSOAtivos) {
        this.limitePROCESSOAtivos = limitePROCESSOAtivos;
    }

    public Boolean getAlertaPROCESSOAtivos() {
        return alertaPROCESSOAtivos;
    }

    public void setAlertaPROCESSOAtivos(Boolean alertaPROCESSOAtivos) {
        this.alertaPROCESSOAtivos = alertaPROCESSOAtivos;
    }

    public Double getValorPROCESSOTotal() {
        return valorPROCESSOTotal;
    }

    public void setValorPROCESSOTotal(Double valorPROCESSOTotal) {
        this.valorPROCESSOTotal = valorPROCESSOTotal;
    }

    public Integer getQtdAlertaCPUP() {
        return qtdAlertaCPUP;
    }

    public Integer getQtdAlertaCPUF() {
        return qtdAlertaCPUF;
    }

    public Integer getQtdAlertaRAMP() {
        return qtdAlertaRAMP;
    }

    public Integer getQtdAlertaDISKP() {
        return qtdAlertaDISKP;
    }

    public Integer getQtdAlertaREDER() {
        return qtdAlertaREDER;
    }

    public Integer getQtdAlertaREDEE() {
        return qtdAlertaREDEE;
    }

    public Integer getQtdAlertaPROCESSOA() {
        return qtdAlertaPROCESSOA;
    }

    public Integer getQtdAlertaPROCESSOD() {
        return qtdAlertaPROCESSOD;
    }

    public void aumentarQtd(String tipo) {
        if(tipo.equals("CPUP")) {
            this.qtdAlertaCPUP++;
        } else if(tipo.equals("CPUF")) {
            this.qtdAlertaCPUF++;
        } else if(tipo.equals("RAMP")) {
            this.qtdAlertaRAMP++;
        } else if(tipo.equals("DISKP")) {
            this.qtdAlertaDISKP++;
        } else if(tipo.equals("REDEE")) {
            this.qtdAlertaREDEE++;
        } else if(tipo.equals("REDER")) {
            this.qtdAlertaREDER++;
        } else if(tipo.equals("PROCESSOD")) {
            this.qtdAlertaPROCESSOD++;
        } else {
            this.qtdAlertaPROCESSOA++;
        }
    }

    @Override
    public String toString() {
        return "Captura{" +
                "fkAtm=" + fkAtm +
                ", dataHora='" + dataHora + '\'' +
                ", valorCpuPercent=" + valorCpuPercent +
                ", limiteCpuPercent=" + limiteCpuPercent +
                ", alertaCpuPercent=" + alertaCpuPercent +
                ", valorCPUFreq=" + valorCPUFreq +
                ", limiteCPUFreq=" + limiteCPUFreq +
                ", alertaCPUFreq=" + alertaCPUFreq +
                ", valorRAMDisponivel=" + valorRAMDisponivel +
                ", valorRAMPercentual=" + valorRAMPercentual +
                ", limiteRAMPercentual=" + limiteRAMPercentual +
                ", alertaRAMPercentual=" + alertaRAMPercentual +
                ", valorDISKTotal=" + valorDISKTotal +
                ", valorDISKDisponivel=" + valorDISKDisponivel +
                ", valorDISKPercentual=" + valorDISKPercentual +
                ", limiteDISKPercentual=" + limiteDISKPercentual +
                ", alertaDISKPercentual=" + alertaDISKPercentual +
                ", valorREDERecebida=" + valorREDERecebida +
                ", limiteREDERecebida=" + limiteREDERecebida +
                ", alertaREDERecebida=" + alertaREDERecebida +
                ", valorREDEEnviada=" + valorREDEEnviada +
                ", limiteREDEEnviada=" + limiteREDEEnviada +
                ", alertaREDEEnviada=" + alertaREDEEnviada +
                ", valorPROCESSODesativado=" + valorPROCESSODesativado +
                ", limitePROCESSODesativado=" + limitePROCESSODesativado +
                ", alertaPROCESSODesativado=" + alertaPROCESSODesativado +
                ", valorPROCESSOAtivos=" + valorPROCESSOAtivos +
                ", limitePROCESSOAtivos=" + limitePROCESSOAtivos +
                ", alertaPROCESSOAtivos=" + alertaPROCESSOAtivos +
                ", valorPROCESSOTotal=" + valorPROCESSOTotal +
                '}';
    }
}
