package sptech.school;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;

public class Aws {
    public static S3ObjectInputStream buscarArquivo(String nomeBucket, String chaveObj) {
        AmazonS3 s3Client = AmazonS3ClientBuilder.defaultClient();
        S3Object s3Object = s3Client.getObject(new GetObjectRequest(nomeBucket, chaveObj));

        return s3Object.getObjectContent();
    }
}
