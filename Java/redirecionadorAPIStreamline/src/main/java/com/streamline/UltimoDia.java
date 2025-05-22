package com.streamline;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.s3.AmazonS3;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import software.amazon.awssdk.services.s3.S3Client;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

public class UltimoDia {
    private final AmazonS3 client = AmazonS3ClientBuilder.defaultClient();
    private static final Log log = LogFactory.getLog(Main.class);
    public String transformarUltimoDia(List<Captura> listaCapturas, String sourceBucket, String arq, String[] separacao, LambdaLogger logger) {
        logger.log("entrouTranformarUltimoDia");

        arq = "%s/dia/%s/".formatted(arq, separacao[2]);

        logger.log(arq);

        S3Client s3Client = S3Client.builder().build();

        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(sourceBucket)
                .prefix(arq)
                .build();

        ListObjectsV2Iterable response = s3Client.listObjectsV2Paginator(request);

        for (ListObjectsV2Response page : response) {
            for (S3Object object : page.contents()) {
                arq = object.key();
                logger.log(arq);
                break;
            }
            break;
        }

        InputStream s3InputStream = client.getObject(sourceBucket, arq).getObjectContent();

        List<Captura> lista = new ArrayList<>();
        return "oi";
    }
}
