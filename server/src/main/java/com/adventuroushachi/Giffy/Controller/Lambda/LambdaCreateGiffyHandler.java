package com.adventuroushachi.Giffy.Controller.Lambda;

import com.adventuroushachi.Giffy.Controller.ResponseMessage;
import com.adventuroushachi.Giffy.Controller.ResponseMessageStatus;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import net.minidev.json.JSONObject;
import org.apache.tomcat.util.http.fileupload.MultipartStream;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class LambdaCreateGiffyHandler implements RequestHandler<Map<String, Object>, ResponseEntity<ResponseMessage<Void>>> {

    public ResponseEntity<ResponseMessage<Void>> handleRequest(Map<String, Object> input, Context context) {
        Regions clientRegion = Regions.US_WEST_2;
        // Store file in giffy-bucket/giffies/useremail/nameofile.gif
        String bucketName = "giffy-bucket";

        String fileObjKeyName = "";

        Map<String, String> responseBody = new HashMap<>();
        ResponseMessage responseMessage;
        String contentType = "";

        try {
            byte[] bI = Base64.getDecoder().decode(input.get("body").toString().getBytes());
            Map<String, String> requestHeader = (Map<String, String>) input.get("headers");

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

                fileObjKeyName = getFileName(header, "fileName");

                multipartStream.readBodyData(out);
                nextPart = multipartStream.readBoundary();
            }

            InputStream fileInputStream = new ByteArrayInputStream(out.toByteArray());
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard().withRegion(clientRegion).build();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(out.toByteArray().length);

            s3Client.putObject(bucketName, fileObjKeyName, fileInputStream, metadata);
            responseBody.put("Status", "File stored in S3");
            String resBodyString = new JSONObject(responseBody).toString();
            responseMessage = new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Giffy uploaded", null);

        } catch (Exception e) {
            JSONObject errObj = new JSONObject();
            errObj.put("error", e.getMessage());
            responseMessage = new ResponseMessage<>(ResponseMessageStatus.ERROR, "Giffy not uploaded", null);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(responseMessage);
    }

    private String getFileName(String str, String field) {
        String result = null;
        int index = str.indexOf(field);

        if (index >= 0) {
            int first = str.indexOf("\"", index);
            int second = str.indexOf("\"", first + 1);
            result = str.substring(first + 1, second);
        }
        return result;
    }
}
