package streamlineatm;

import java.io.*;
import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class Main implements RequestHandler<S3Event, String> {

    private final AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
    private static final String DESTINATION_BUCKET = "trusted-streamlineatm";

    @Override
    public String handleRequest(S3Event s3Event, Context context) {

        String sourceBucket = s3Event.getRecords().getFirst().getS3().getBucket().getName();
        String sourceKey = s3Event.getRecords().getFirst().getS3().getObject().getKey();

        context.getLogger().log("Iniciando processamento de arquivo: " + sourceKey);
        context.getLogger().log("Bucket de origem: " + sourceBucket);

        if(sourceKey.startsWith("pix/") ) {

            try{

                context.getLogger().log("Arquivo válido, iniciando leitura S3");

                InputStream s3InputStream = s3Client.getObject(sourceBucket, sourceKey).getObjectContent();

                PixMapper pixMapper = new PixMapper();
                List<Pix> lista = pixMapper.mapearPix(s3InputStream);

                context.getLogger().log("Dados mapeados, registros: " + lista.size());

                if (lista.isEmpty()) {
                    context.getLogger().log("Lista de transações PIX vazia");
                    return "Arquivo JSON sem dados válidos";
                }

                Pix.separarAnoEMes(lista);
                Pix.calcularTotal(lista);

                CsvWriter writer = new CsvWriter();

                ByteArrayOutputStream csvOutputStream = writer.escreverCsv(lista);

                InputStream csvInputStream = new ByteArrayInputStream(csvOutputStream.toByteArray());

                context.getLogger().log("Salvando CSV em: " + DESTINATION_BUCKET);

                s3Client.putObject(DESTINATION_BUCKET, sourceKey.replace(".json", ".csv"), csvInputStream, null);

                return "Sucesso ao processar";

            } catch (IOException e) {
                context.getLogger().log("Erro ao tentar mapear capturas: " + e.getMessage());
                return "Erro no processamento";
            } catch (Exception e) {
                context.getLogger().log("Erro: " + e.getMessage());
                return "Erro no processamento";
            }

        }

        return "Arquivo ignorado (não está na pasta pix/)";

    }

}
