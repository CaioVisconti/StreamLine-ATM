package com.streamline;


import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

public class Periodo {
    private final AmazonS3 client = AmazonS3ClientBuilder.defaultClient();
    public String transformarPeriodo(String sourceBucket, String arq, String[] separacao, LambdaLogger logger) throws IOException {
        String[] separado = separacao[2].split("_");
        String dir = "%s%s".formatted(separado[0], separado[1]);
        String prefix = "%s/dia/%s/Capturas_%s".formatted(arq, dir, separacao[2]);

        if(separacao[3].equals(separacao[4])) {
            UltimoDia dia =  new UltimoDia();
            return dia.transformarUltimoDia(".", sourceBucket, arq, separacao, logger);
        }

        Boolean achouInicio = false;
        Boolean achouFinal = false;

        ListObjectsRequest req = new ListObjectsRequest()
                .withBucketName(sourceBucket)
                .withPrefix(prefix);

        ObjectListing listing = client.listObjects(req);
        List<S3ObjectSummary> objetos = listing.getObjectSummaries();

        List<S3ObjectSummary> objetosOrdenados = objetos.stream()
                .sorted(Comparator.comparing(S3ObjectSummary::getLastModified).reversed())
                .collect(Collectors.toList());

        List<String> nomeTeste = new ArrayList<>();
        List<InputStream> iptTeste = new ArrayList<>();

        logger.log("%s_%s.json".formatted(prefix, separacao[4]));

        for(S3ObjectSummary obj : objetosOrdenados) {
            logger.log(String.valueOf(obj));
            if(obj.getKey().equals("%s_%s.json".formatted(prefix, separacao[3])) || achouInicio) {
                iptTeste.add(client.getObject(sourceBucket, obj.getKey()).getObjectContent());
                nomeTeste.add(obj.getKey());
                achouInicio = true;
            }

            if(obj.getKey().equals("%s_%s.json".formatted(prefix, separacao[4]))) {
                break;
            }
        }
        List<List<Captura>> capturas = new ArrayList<>();

        CapturaMapper mapper = new CapturaMapper();
        for(InputStream inputStream : iptTeste) {
            try {
                capturas.add(mapper.mapearCapturas(inputStream));
            } catch (IOException e) {
                throw e;
            }
        }

        Integer fkAtm = null;
        String dataHora = null;
        Double valorCpuPercent = 0.0, valorCPUFreq = 0.0, valorRAMDisponivel = 0.0, valorRAMPercentual = 0.0, valorDISKTotal = 0.0, valorDISKDisponivel = 0.0, valorDISKPercentual = 0.0, valorREDERecebida = 0.0, valorREDEEnviada = 0.0, valorPROCESSODesativado = 0.0, valorPROCESSOAtivos = 0.0, valorPROCESSOTotal = 0.0, limiteCPUPercent = 0.0, limiteCPUFreq = 0.0, limiteRAMPercent = 0.0, limiteDISKPercent = 0.0, limiteREDERecebida = 0.0, limiteREDEEnviada = 0.0, limitePROCESSOSDesativado = 0.0, limitePROCESSOSAtivos = 0.0;
        Boolean alertaCpuPercent = false, alertaCPUFreq = false, alertaRAMPercentual = false, alertaDISKPercentual = false, alertaREDERecebida = false, alertaREDEEnviada = false, alertaPROCESSODesativado = false, alertaPROCESSOAtivos = false;

        List<Captura> listaPeriodo = new ArrayList<>();

        Collections.reverse(capturas);

        for(List<Captura> ls : capturas) {
            Captura captura = new Captura();
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

             for(Captura c : ls) {
                 fkAtm = c.getFkAtm();
                 dataHora = c.getDataHora();

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
             }

             if (valorCpuPercent != 0.0) {
                 valorCpuPercent = valorCpuPercent / ls.size();
             }
             if (valorCPUFreq != 0.0) {
                 valorCPUFreq = valorCPUFreq / ls.size();
             }
             if (valorRAMDisponivel != 0.0) {
                 valorRAMDisponivel = valorRAMDisponivel / ls.size();
             }
             if (valorRAMPercentual != 0.0) {
                 valorRAMPercentual = valorRAMPercentual / ls.size();
             }
             if (valorDISKTotal != 0.0) {
                 valorDISKTotal = valorDISKTotal / ls.size();
             }
             if (valorDISKDisponivel != 0.0) {
                 valorDISKDisponivel = valorDISKDisponivel / ls.size();
             }
             if (valorDISKPercentual != 0.0) {
                 valorDISKPercentual = valorDISKPercentual / ls.size();
             }
             if (valorREDERecebida != 0.0) {
                 valorREDERecebida = valorREDERecebida / ls.size();
             }
             if (valorREDEEnviada != 0.0) {
                 valorREDEEnviada = valorREDEEnviada / ls.size();
             }
             if (valorPROCESSODesativado != 0.0) {
                 valorPROCESSODesativado = valorPROCESSODesativado / ls.size();
             }
             if (valorPROCESSOAtivos != 0.0) {
                 valorPROCESSOAtivos = valorPROCESSOAtivos / ls.size();
             }
             if (valorPROCESSOTotal != 0.0) {
                 valorPROCESSOTotal = valorPROCESSOTotal / ls.size();
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

             logger.log(captura.toString());

             listaPeriodo.add(captura);
        }

        StringBuilder stringBuilder = new StringBuilder();
        Formatador formatador = new Formatador();
        try (InputStreamReader isr = new InputStreamReader(formatador.formatarInputstream(listaPeriodo));
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
}
