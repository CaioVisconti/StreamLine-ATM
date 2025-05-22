package com.streamline;

import com.amazonaws.services.lambda.runtime.LambdaLogger;

import java.util.ArrayList;
import java.util.List;

public class UltimoMes {

    public List<Captura> organizarUltimoMes(List<Captura> listaDias, List<Captura> capturas, LambdaLogger logger) {
        Integer fkAtm = null;
        String dataHora = null;
        Double valorCpuPercent = 0.0, valorCPUFreq = 0.0, valorRAMDisponivel = 0.0, valorRAMPercentual = 0.0, valorDISKTotal = 0.0, valorDISKDisponivel = 0.0, valorDISKPercentual = 0.0, valorREDERecebida = 0.0, valorREDEEnviada = 0.0, valorPROCESSODesativado = 0.0, valorPROCESSOAtivos = 0.0, valorPROCESSOTotal = 0.0, limiteCPUPercent = 0.0, limiteCPUFreq = 0.0, limiteRAMPercent = 0.0, limiteDISKPercent = 0.0, limiteREDERecebida = 0.0, limiteREDEEnviada = 0.0, limitePROCESSOSDesativado = 0.0, limitePROCESSOSAtivos = 0.0;
        Boolean alertaCpuPercent = false, alertaCPUFreq = false, alertaRAMPercentual = false, alertaDISKPercentual = false, alertaREDERecebida = false, alertaREDEEnviada = false, alertaPROCESSODesativado = false, alertaPROCESSOAtivos = false;

        Captura captura = new Captura();
        List<Captura> listaMes = new ArrayList<>();

        List<Captura> lista = new ArrayList<>();
        for(Captura c : listaDias) {
            lista.add(c);
            logger.log(c.toString());
            if(lista.size() % 7 == 0) {
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

                for(Captura c2 : lista) {
                    fkAtm = c2.getFkAtm();
                    dataHora = c2.getDataHora();
                    if(c2.getValorCpuPercent() != null) {
                        valorCpuPercent += c2.getValorCpuPercent();
                    }
                    if(c2.getValorCPUFreq() != null) {
                        valorCPUFreq += c2.getValorCPUFreq();
                    }
                    if(c2.getValorRAMDisponivel() != null) {
                        valorRAMDisponivel += c2.getValorRAMDisponivel();
                    }
                    if(c2.getValorRAMPercentual() != null) {
                        valorRAMPercentual += c2.getValorRAMPercentual();
                    }
                    if(c2.getValorDISKTotal() != null) {
                        valorDISKTotal += c2.getValorDISKTotal();
                    }
                    if(c2.getValorDISKDisponivel() != null) {
                        valorDISKDisponivel += c2.getValorDISKDisponivel();
                    }
                    if(c2.getValorDISKPercentual() != null) {
                        valorDISKPercentual += c2.getValorDISKPercentual();
                    }
                    if(c2.getValorREDERecebida() != null) {
                        valorREDERecebida += c2.getValorREDERecebida();
                    }
                    if(c2.getValorREDEEnviada() != null) {
                        valorREDEEnviada += c2.getValorREDEEnviada();
                    }
                    if(c2.getValorPROCESSODesativado() != null) {
                        valorPROCESSODesativado += c2.getValorPROCESSODesativado();
                    }
                    if(c2.getValorPROCESSOAtivos() != null) {
                        valorPROCESSOAtivos += c2.getValorPROCESSOAtivos();
                    }
                    if(c2.getValorPROCESSOTotal() != null) {
                        valorPROCESSOTotal += c2.getValorPROCESSOTotal();
                    }

                    // Limites seguidos
                    if(c2.getLimiteCpuPercent() != null) {
                        limiteCPUPercent = c2.getLimiteCpuPercent();
                    }
                    if(c2.getLimiteCPUFreq() != null) {
                        limiteCPUFreq = c2.getLimiteCPUFreq();
                    }
                    if(c2.getLimiteRAMPercentual() != null) {
                        limiteRAMPercent = c2.getLimiteRAMPercentual();
                    }
                    if(c2.getLimiteDISKPercentual() != null) {
                        limiteDISKPercent = c2.getLimiteDISKPercentual();
                    }
                    if(c2.getLimiteREDERecebida() != null) {
                        limiteREDERecebida = c2.getLimiteREDERecebida();
                    }
                    if(c2.getLimiteREDEEnviada() != null) {
                        limiteREDEEnviada = c2.getLimiteREDEEnviada();
                    }
                    if(c2.getLimitePROCESSODesativado() != null) {
                        limitePROCESSOSDesativado = c2.getLimitePROCESSODesativado();
                    }
                    if(c2.getLimitePROCESSOAtivos() != null) {
                        limitePROCESSOSAtivos = c2.getLimitePROCESSOAtivos();
                    }

                    // Alerta de captura
                    if(c2.getAlertaCpuPercent() != null && c2.getAlertaCpuPercent()) {
                        alertaCpuPercent = true;
                        captura.aumentarQtd("CPUP");
                    }
                    if(c2.getAlertaCPUFreq() != null && c2.getAlertaCPUFreq()) {
                        alertaCPUFreq = true;
                        captura.aumentarQtd("CPUF");
                    }
                    if(c2.getAlertaRAMPercentual() != null && c2.getAlertaRAMPercentual()) {
                        alertaRAMPercentual = true;
                        captura.aumentarQtd("RAMP");
                    }
                    if(c2.getAlertaDISKPercentual() != null && c2.getAlertaDISKPercentual()) {
                        alertaDISKPercentual = true;
                        captura.aumentarQtd("DISKP");
                    }
                    if(c2.getAlertaREDERecebida() != null && c2.getAlertaREDERecebida()) {
                        alertaREDERecebida = true;
                        captura.aumentarQtd("REDEE");
                    }
                    if(c2.getAlertaREDEEnviada() != null && c2.getAlertaREDEEnviada()) {
                        alertaREDEEnviada = true;
                        captura.aumentarQtd("REDER");
                    }
                    if(c2.getAlertaPROCESSODesativado() != null && c2.getAlertaPROCESSODesativado()) {
                        alertaPROCESSODesativado = true;
                        captura.aumentarQtd("PROCESSOD");
                    }
                    if(c2.getAlertaPROCESSOAtivos() != null && c2.getAlertaPROCESSOAtivos()) {
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

                dataHora = "Semana %d".formatted(listaMes.size() + 1);

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

                listaMes.add(captura);
            }
        }

        return listaMes;
    }
}
