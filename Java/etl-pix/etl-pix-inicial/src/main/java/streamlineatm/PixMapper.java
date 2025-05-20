package streamlineatm;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class PixMapper {

    public List<Pix> mapearPix(InputStream inputStream) throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        List<Pix> capturasPix = mapper.readValue(inputStream, new TypeReference<List<Pix>>() {
        });
        return capturasPix;

    }

}
