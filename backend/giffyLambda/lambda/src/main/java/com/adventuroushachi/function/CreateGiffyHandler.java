package com.adventuroushachi.function;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.google.gson.Gson;
import org.apache.commons.fileupload.MultipartStream;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class CreateGiffyHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        Regions clientRegion = Regions.US_WEST_2;
        String bucketName = "giffy-bucket";

        String fileObjKeyName = "";

        ResponseMessage responseMessage;
        String contentType = "";

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();

        try {
            byte[] bI = Base64.getDecoder().decode(input.getBody().getBytes());
            Map<String, String> requestHeader = input.getHeaders();

            if (requestHeader != null) {
                contentType = requestHeader.get("Content-Type");
            }

            String[] boundaryArray = contentType.split("=");
            byte[] boundary = boundaryArray[1].getBytes();

            ByteArrayInputStream content = new ByteArrayInputStream(bI);
            MultipartStream multipartStream = new MultipartStream(content, boundary, bI.length, null);
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            boolean nextPart = multipartStream.skipPreamble();

            while (nextPart) {
                String header = multipartStream.readHeaders();

                fileObjKeyName = getFileName(header);

                multipartStream.readBodyData(out);
                nextPart = multipartStream.readBoundary();
            }

            InputStream fileInputStream = new ByteArrayInputStream(out.toByteArray());
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withRegion(clientRegion).build();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(out.toByteArray().length);

            s3Client.putObject(bucketName, fileObjKeyName, fileInputStream, metadata);

            responseMessage = new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Giffy uploaded", null);

        } catch (Exception e) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Giffy not uploaded";
            responseMessage = new ResponseMessage<>(ResponseMessageStatus.ERROR, errorMessage, null);
        }

        Gson gson = new Gson();
        String responseBody = gson.toJson(responseMessage);

        response.setBody(responseBody);
        response.setStatusCode(responseMessage.getStatus().equals(ResponseMessageStatus.SUCCESS) ? 201 : 500);

        // Set CORS headers
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "https://giffy-web.adventurous-hachi.com");
        headers.put("Access-Control-Allow-Methods", "POST");
        headers.put("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        headers.put("Access-Control-Allow-Credentials", "true");

        response.setHeaders(headers);

        return response;
    }

    private String getFileName(String str) {
        String result = null;
        String searchField = "Content-Disposition";

        int index = str.indexOf(searchField);

        if (index >= 0) {
            int nameIndex = str.indexOf("filename=", index);
            if (nameIndex >= 0) {
                int first = str.indexOf("\"", nameIndex);
                int second = str.indexOf("\"", first + 1);
                result = str.substring(first + 1, second);
            }
        }
        return result;
    }
}
