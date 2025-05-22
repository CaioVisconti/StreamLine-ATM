package com.streamline;

import java.util.ArrayList;
import java.util.List;

public class UltimaSemana {
    public List<Captura> organizarUltimaSemana(Integer tamanho, List<Captura> capturas) {
        Integer fkAtm = null;
        String dataHora = null;
        Double valorCpuPercent = 0.0, valorCPUFreq = 0.0, valorRAMDisponivel = 0.0, valorRAMPercentual = 0.0, valorDISKTotal = 0.0, valorDISKDisponivel = 0.0, valorDISKPercentual = 0.0, valorREDERecebida = 0.0, valorREDEEnviada = 0.0, valorPROCESSODesativado = 0.0, valorPROCESSOAtivos = 0.0, valorPROCESSOTotal = 0.0, limiteCPUPercent = 0.0, limiteCPUFreq = 0.0, limiteRAMPercent = 0.0, limiteDISKPercent = 0.0, limiteREDERecebida = 0.0, limiteREDEEnviada = 0.0, limitePROCESSOSDesativado = 0.0, limitePROCESSOSAtivos = 0.0;
        Boolean alertaCpuPercent = false, alertaCPUFreq = false, alertaRAMPercentual = false, alertaDISKPercentual = false, alertaREDERecebida = false, alertaREDEEnviada = false, alertaPROCESSODesativado = false, alertaPROCESSOAtivos = false;

        List<Captura> listaSemana = new ArrayList<>();

        for(int i = 0; i < tamanho; i++) {
            fkAtm = null;
            dataHora = null;
            valorCpuPercent = 0.0;
            valorCPUFreq = 0.0;
            valorRAMDisponivel = 0.0;
            valorRAMPercentual = 0.0;
            valorDISKTotal = 0.0;
            valorDISKDisponivel = 0.0;
            valorDISKPercentual = 0.0;
            valorREDERecebida = 0.0;
            valorREDEEnviada = 0.0;
            valorPROCESSODesativado = 0.0;
            valorPROCESSOAtivos = 0.0;
            valorPROCESSOTotal = 0.0;
            limiteCPUPercent = 0.0;
            limiteCPUFreq = 0.0;
            limiteRAMPercent = 0.0;
            limiteDISKPercent = 0.0;
            limiteREDERecebida = 0.0;
            limiteREDEEnviada = 0.0;
            limitePROCESSOSDesativado = 0.0;
            limitePROCESSOSAtivos = 0.0;
            alertaCpuPercent = false;
            alertaCPUFreq = false;
            alertaRAMPercentual = false;
            alertaDISKPercentual = false;
            alertaREDERecebida = false;
            alertaREDEEnviada = false;
            alertaPROCESSODesativado = false;
            alertaPROCESSOAtivos = false;

            Captura captura = new Captura();

            for(Captura c : capturas) {
                fkAtm = c.getFkAtm();
                dataHora = c.getDataHora();

                // Valores de captura
                if(c.getValorCpuPercent() != null) {
                    valorCpuPercent += c.getValorCpuPercent();
                }
                if(c.getValorCPUFreq() != null) {
                    valorCPUFreq += c.getValorCPUFreq();
                }
                if(c.getValorRAMDisponivel() != null) {
                    valorRAMDisponivel += c.getValorRAMDisponivel();
                }
                if(c.getValorRAMPercentual() != null) {
                    valorRAMPercentual += c.getValorRAMPercentual();
                }
                if(c.getValorDISKTotal() != null) {
                    valorDISKTotal += c.getValorDISKTotal();
                }
                if(c.getValorDISKDisponivel() != null) {
                    valorDISKDisponivel += c.getValorDISKDisponivel();
                }
                if(c.getValorDISKPercentual() != null) {
                    valorDISKPercentual += c.getValorDISKPercentual();
                }
                if(c.getValorREDERecebida() != null) {
                    valorREDERecebida += c.getValorREDERecebida();
                }
                if(c.getValorREDEEnviada() != null) {
                    valorREDEEnviada += c.getValorREDEEnviada();
                }
                if(c.getValorPROCESSODesativado() != null) {
                    valorPROCESSODesativado += c.getValorPROCESSODesativado();
                }
                if(c.getValorPROCESSOAtivos() != null) {
                    valorPROCESSOAtivos += c.getValorPROCESSOAtivos();
                }
                if(c.getValorPROCESSOTotal() != null) {
                    valorPROCESSOTotal += c.getValorPROCESSOTotal();
                }

                // Limites seguidos
                if(c.getLimiteCpuPercent() != null) {
                    limiteCPUPercent = c.getLimiteCpuPercent();
                }
                if(c.getLimiteCPUFreq() != null) {
                    limiteCPUFreq = c.getLimiteCPUFreq();
                }
                if(c.getLimiteRAMPercentual() != null) {
                    limiteRAMPercent = c.getLimiteRAMPercentual();
                }
                if(c.getLimiteDISKPercentual() != null) {
                    limiteDISKPercent = c.getLimiteDISKPercentual();
                }
                if(c.getLimiteREDERecebida() != null) {
                    limiteREDERecebida = c.getLimiteREDERecebida();
                }
                if(c.getLimiteREDEEnviada() != null) {
                    limiteREDEEnviada = c.getLimiteREDEEnviada();
                }
                if(c.getLimitePROCESSODesativado() != null) {
                    limitePROCESSOSDesativado = c.getLimitePROCESSODesativado();
                }
                if(c.getLimitePROCESSOAtivos() != null) {
                    limitePROCESSOSAtivos = c.getLimitePROCESSOAtivos();
                }

                // Alerta de captura
                if(c.getAlertaCpuPercent() != null && c.getAlertaCpuPercent()) {
                    alertaCpuPercent = true;
                    captura.aumentarQtd("CPUP");
                }
                if(c.getAlertaCPUFreq() != null && c.getAlertaCPUFreq()) {
                    alertaCPUFreq = true;
                    captura.aumentarQtd("CPUF");
                }
                if(c.getAlertaRAMPercentual() != null && c.getAlertaRAMPercentual()) {
                    alertaRAMPercentual = true;
                    captura.aumentarQtd("RAMP");
                }
                if(c.getAlertaDISKPercentual() != null && c.getAlertaDISKPercentual()) {
                    alertaDISKPercentual = true;
                    captura.aumentarQtd("DISKP");
                }
                if(c.getAlertaREDERecebida() != null && c.getAlertaREDERecebida()) {
                    alertaREDERecebida = true;
                    captura.aumentarQtd("REDEE");
                }
                if(c.getAlertaREDEEnviada() != null && c.getAlertaREDEEnviada()) {
                    alertaREDEEnviada = true;
                    captura.aumentarQtd("REDER");
                }
                if(c.getAlertaPROCESSODesativado() != null && c.getAlertaPROCESSODesativado()) {
                    alertaPROCESSODesativado = true;
                    captura.aumentarQtd("PROCESSOD");
                }
                if(c.getAlertaPROCESSOAtivos() != null && c.getAlertaPROCESSOAtivos()) {
                    alertaPROCESSOAtivos = true;
                    captura.aumentarQtd("PROCESSOA");
                }
            }
            if (valorCpuPercent != 0.0) {
                valorCpuPercent = valorCpuPercent / capturas.size();
            }
            if (valorCPUFreq != 0.0) {
                valorCPUFreq = valorCPUFreq / capturas.size();
            }
            if (valorRAMDisponivel != 0.0) {
                valorRAMDisponivel = valorRAMDisponivel / capturas.size();
            }
            if (valorRAMPercentual != 0.0) {
                valorRAMPercentual = valorRAMPercentual / capturas.size();
            }
            if (valorDISKTotal != 0.0) {
                valorDISKTotal = valorDISKTotal / capturas.size();
            }
            if (valorDISKDisponivel != 0.0) {
                valorDISKDisponivel = valorDISKDisponivel / capturas.size();
            }
            if (valorDISKPercentual != 0.0) {
                valorDISKPercentual = valorDISKPercentual / capturas.size();
            }
            if (valorREDERecebida != 0.0) {
                valorREDERecebida = valorREDERecebida / capturas.size();
            }
            if (valorREDEEnviada != 0.0) {
                valorREDEEnviada = valorREDEEnviada / capturas.size();
            }
            if (valorPROCESSODesativado != 0.0) {
                valorPROCESSODesativado = valorPROCESSODesativado / capturas.size();
            }
            if (valorPROCESSOAtivos != 0.0) {
                valorPROCESSOAtivos = valorPROCESSOAtivos / capturas.size();
            }
            if (valorPROCESSOTotal != 0.0) {
                valorPROCESSOTotal = valorPROCESSOTotal / capturas.size();
            }

            dataHora = (dataHora.split(" "))[0];

            captura.setFkAtm(fkAtm);
            captura.setDataHora(dataHora);
            captura.setValorCpuPercent(valorCpuPercent);
            captura.setLimiteCpuPercent(limiteCPUPercent);
            captura.setAlertaCpuPercent(alertaCpuPercent);
            captura.setValorCPUFreq(valorCPUFreq);
            captura.setLimiteCPUFreq(limiteCPUFreq);
            captura.setAlertaCPUFreq(alertaCPUFreq);
            captura.setValorRAMDisponivel(valorRAMDisponivel);
            captura.setValorRAMPercentual(valorRAMPercentual);
            captura.setLimiteRAMPercentual(limiteRAMPercent);
            captura.setAlertaRAMPercentual(alertaRAMPercentual);
            captura.setValorDISKTotal(valorDISKTotal);
            captura.setValorDISKDisponivel(valorDISKDisponivel);
            captura.setValorDISKPercentual(valorDISKPercentual);
            captura.setLimiteDISKPercentual(limiteDISKPercent);
            captura.setAlertaDISKPercentual(alertaDISKPercentual);
            captura.setValorREDERecebida(valorREDERecebida);
            captura.setLimiteREDERecebida(limiteREDERecebida);
            captura.setAlertaREDERecebida(alertaREDERecebida);
            captura.setValorREDEEnviada(valorREDEEnviada);
            captura.setLimiteREDEEnviada(limiteREDEEnviada);
            captura.setAlertaREDEEnviada(alertaREDEEnviada);
            captura.setValorPROCESSODesativado(valorPROCESSODesativado);
            captura.setLimitePROCESSODesativado(limitePROCESSOSDesativado);
            captura.setAlertaPROCESSODesativado(alertaPROCESSODesativado);
            captura.setValorPROCESSOAtivos(valorPROCESSOAtivos);
            captura.setLimitePROCESSOAtivos(limitePROCESSOSAtivos);
            captura.setAlertaPROCESSOAtivos(alertaPROCESSOAtivos);
            captura.setValorPROCESSOTotal(valorPROCESSOTotal);
            captura.setValorPROCESSOTotal(valorPROCESSOTotal);

            listaSemana.add(captura);
        }

        return listaSemana;
    }
}
