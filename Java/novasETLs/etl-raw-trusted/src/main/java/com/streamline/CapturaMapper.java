package com.streamline;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.io.InputStream;

public class CapturaMapper {
    public List<Captura> mapearCapturas(InputStream inputStream) throws IOException {
        ObjectMapper mapearObj = new ObjectMapper();

        List<Captura> capturasJson = mapearObj.readValue(inputStream, new TypeReference<List<Captura>>() {
        });
        return capturasJson;
    }
}
