package com.streamline;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class CapturaMapper {
    public List<Captura> mapearCapturas(InputStream inputStream) throws IOException {
        ObjectMapper mapearObj = new ObjectMapper();

        List<Captura> capturasJson = new ArrayList<>();
        capturasJson = mapearObj.readValue(inputStream, new TypeReference<List<Captura>>() {
        });
        return capturasJson;
    }
}
