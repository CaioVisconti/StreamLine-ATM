package com.streamline;

import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.google.gson.Gson;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class Formatador {
    public String formatarNomeArquivo(S3Event s3Event, String periodo) {

        String nomeArquivoRecebido = s3Event.getRecords().get(0).getS3().getObject().getKey();
        String[] nomeTotal = nomeArquivoRecebido.split("/");
        String caminho = "%s/%s/%s/".formatted(nomeTotal[0], periodo, nomeTotal[2]);
        String nomeEnviado = "%sCapturas.json".formatted(caminho);

        return nomeEnviado;
    }

    public InputStream formatarInputstream(List<Captura> lista) {
        Gson gson = new Gson();
        String json = gson.toJson(lista);
        return new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
    }
}
