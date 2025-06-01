package com.streamline;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

public class UltimoDia {
    private final AmazonS3 client = AmazonS3ClientBuilder.defaultClient();
    private static final Log log = LogFactory.getLog(Main.class);
    public String transformarUltimoDia(String tipo, String sourceBucket, String arq, String[] separacao, LambdaLogger logger) throws IOException {

        String[] separado = separacao[2].split("_");
        logger.log(separacao[2]);
        String dir = "%s%s".formatted(separado[0], separado[1]);

        arq = "%s/dia/%s/Capturas.json".formatted(arq, dir);

        logger.log(arq);

        if(tipo.equals("ultimoDia")) {
            arq = buscarNomeArquivo(arq, separacao, logger, sourceBucket, "ultimoDia");
        } else {
            arq = "%s_%s_%s.json".formatted(arq.split("\\.")[0], separacao[2],separacao[3]);
        }

        logger.log("arq ultimoDia");
        logger.log(arq);

        InputStream s3InputStream = client.getObject(sourceBucket, arq).getObjectContent();

        CapturaMapper capturaMapper = new CapturaMapper();
        List<Captura> lista;

        try {
            lista = capturaMapper.mapearCapturas(s3InputStream);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        StringBuilder stringBuilder = new StringBuilder();
        Formatador formatador = new Formatador();
        try (InputStreamReader isr = new InputStreamReader(formatador.formatarInputstream(obterData(lista)));
             BufferedReader reader = new BufferedReader(isr)) {
            String line;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line).append("\n");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return stringBuilder.toString();
    }

    public List<Captura> obterData(List<Captura> lista) {
        Integer fkAtm = null;
        String dataHora = null;
        Double valorCpuPercent = 0.0, valorCPUFreq = 0.0, valorRAMDisponivel = 0.0, valorRAMPercentual = 0.0, valorDISKTotal = 0.0, valorDISKDisponivel = 0.0, valorDISKPercentual = 0.0, valorREDERecebida = 0.0, valorREDEEnviada = 0.0, valorPROCESSODesativado = 0.0, valorPROCESSOAtivos = 0.0, valorPROCESSOTotal = 0.0, limiteCPUPercent = 0.0, limiteCPUFreq = 0.0, limiteRAMPercent = 0.0, limiteDISKPercent = 0.0, limiteREDERecebida = 0.0, limiteREDEEnviada = 0.0, limitePROCESSOSDesativado = 0.0, limitePROCESSOSAtivos = 0.0;
        Boolean alertaCpuPercent = false, alertaCPUFreq = false, alertaRAMPercentual = false, alertaDISKPercentual = false, alertaREDERecebida = false, alertaREDEEnviada = false, alertaPROCESSODesativado = false, alertaPROCESSOAtivos = false;

        List<Captura> horas = new ArrayList<>();
        List<String> num = new ArrayList<>();
        num.add("00");
        num.add("02");
        num.add("04");
        num.add("06");
        num.add("08");
        num.add("10");
        num.add("12");
        num.add("14");
        num.add("16");
        num.add("18");
        num.add("20");
        num.add("22");


        for(String str : num) {
            Captura captura = new Captura();

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

            for(Captura c : lista) {

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

                if(!c.getDataHora().split(" ")[1].split(":")[0].equals(str)) {
                    fkAtm = c.getFkAtm();
                    dataHora = "%s %s:00:00".formatted(c.getDataHora().split(" ")[0], str);
                    if (valorCpuPercent != 0.0) {
                        valorCpuPercent = valorCpuPercent / lista.size();
                    }
                    if (valorCPUFreq != 0.0) {
                        valorCPUFreq = valorCPUFreq / lista.size();
                    }
                    if (valorRAMDisponivel != 0.0) {
                        valorRAMDisponivel = valorRAMDisponivel / lista.size();
                    }
                    if (valorRAMPercentual != 0.0) {
                        valorRAMPercentual = valorRAMPercentual / lista.size();
                    }
                    if (valorDISKTotal != 0.0) {
                        valorDISKTotal = valorDISKTotal / lista.size();
                    }
                    if (valorDISKDisponivel != 0.0) {
                        valorDISKDisponivel = valorDISKDisponivel / lista.size();
                    }
                    if (valorDISKPercentual != 0.0) {
                        valorDISKPercentual = valorDISKPercentual / lista.size();
                    }
                    if (valorREDERecebida != 0.0) {
                        valorREDERecebida = valorREDERecebida / lista.size();
                    }
                    if (valorREDEEnviada != 0.0) {
                        valorREDEEnviada = valorREDEEnviada / lista.size();
                    }
                    if (valorPROCESSODesativado != 0.0) {
                        valorPROCESSODesativado = valorPROCESSODesativado / lista.size();
                    }
                    if (valorPROCESSOAtivos != 0.0) {
                        valorPROCESSOAtivos = valorPROCESSOAtivos / lista.size();
                    }
                    if (valorPROCESSOTotal != 0.0) {
                        valorPROCESSOTotal = valorPROCESSOTotal / lista.size();
                    }

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

                    horas.add(captura);
                    break;
                }
            }
        }

        return horas;
    }

    public String buscarNomeArquivo(String arq, String[] separacao, LambdaLogger logger, String sourceBucket, String metodo) {
        String[] separado = separacao[2].split("_");
        logger.log(separacao[2]);
        String dir = "%s%s".formatted(separado[0], separado[1]);

        arq = "%s/dia/%s/Capturas.json".formatted(arq, dir);

        arq = arq.split("\\.")[0];

        ListObjectsRequest request = new ListObjectsRequest()
                .withBucketName(sourceBucket)
                .withPrefix(arq);

        ObjectListing listing = client.listObjects(request);
        List<S3ObjectSummary> objetos = listing.getObjectSummaries();

        List<S3ObjectSummary> objetosOrdenados = objetos.stream()
                .sorted(Comparator.comparing(S3ObjectSummary::getLastModified).reversed())
                .collect(Collectors.toList());

        if(metodo.equals("ultimoDia")) {
            arq = objetosOrdenados.get(0).getKey();
        } else {
            arq = objetosOrdenados.get(objetosOrdenados.size() - 1).getKey();
        }

        return arq;
    }
}
