package sptech.school;

import software.amazon.awssdk.services.cloudwatchlogs.CloudWatchLogsClient;
import software.amazon.awssdk.services.cloudwatchlogs.model.*;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

import java.util.ArrayList;
import java.util.List;

public class Aws {
    public static S3ObjectInputStream buscarArquivo(String nomeBucket, String chaveObj) {
        System.out.println("Buscando Arquivo JSON do " + nomeBucket);
        AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
        S3Object s3Object = s3Client.getObject(new GetObjectRequest(nomeBucket, chaveObj));

        System.out.println("Arquivo JSON encontrado com sucesso!");
        return s3Object.getObjectContent();
    }
}
