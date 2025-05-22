package com.streamline;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final Log log = LogFactory.getLog(Main.class);
    private final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        LambdaLogger logger = context.getLogger();
        String url = input.getPath();
        String[] separacao = url.split("/");
        String per = separacao[3];
        String srcBucket = separacao[1];
        String metodo = separacao[5];

        String arq = "capturas";

        String resultado = "";
        List<Captura> lista = new ArrayList<>();

        if(metodo.equals("tempoReal")) {
            TempoReal teste = new TempoReal();
            resultado = teste.transformarTempoReal(srcBucket, arq, separacao, logger);
        } else if(metodo.equals("periodo")) {
            Periodo teste = new Periodo();
            resultado = teste.transformarPeriodo(lista, srcBucket, arq, separacao, logger);
        } else {
            if(per.equals("ultimoDia")) {
                // UltimoDia teste = new UltimoDia();
                // resultado = teste.transformarUltimoDia(lista, srcBucket, arq, separacao, logger);
            } else if(per.equals("ultimaSemana")) {
                UltimaSemana teste = new UltimaSemana();
                resultado = teste.transformarUltimaSemana(srcBucket, arq, separacao, logger);
            } else if(per.equals("ultimoMes")) {
                UltimoMes teste = new UltimoMes();
                resultado = teste.transformarUltimoMes(srcBucket, arq, separacao, logger);
            } else if(per.equals("ultimoSemestre")) {
                UltimoSemestre teste = new UltimoSemestre();
                resultado = teste.transformarUltimoSemestre(srcBucket, arq, separacao, logger);
            }
        }

        logger.log("resultado");
        logger.log(resultado);

        APIGatewayProxyResponseEvent responseEvent = new APIGatewayProxyResponseEvent();
        responseEvent.setBody(resultado);
        responseEvent.setStatusCode(200);

        Map<String, String> headers = new HashMap<>();
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Headers", "Content-Type,Authorization");
        headers.put("Access-Control-Allow-Methods", "GET,OPTIONS");

        responseEvent.setHeaders(headers);

        return responseEvent;
    }
}
