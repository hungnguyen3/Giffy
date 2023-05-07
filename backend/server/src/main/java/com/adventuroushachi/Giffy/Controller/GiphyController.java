package com.adventuroushachi.Giffy.Controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.adventuroushachi.Giffy.DTO.ExternGiffyDTO;
import com.adventuroushachi.Giffy.Model.Rating;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/giphy")
public class GiphyController {

    @Value("${giphy.apiKey}")
    private String giphyApiKey;

    @Autowired
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();
  
    @GetMapping("/trending")
    public ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> trending() {
        String url = "https://api.giphy.com/v1/gifs/trending";

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url)
                .queryParam("api_key", giphyApiKey);

        String jsonResponse = null;
        try {
            jsonResponse = this.restTemplate.getForObject(builder.toUriString(), String.class);
        } catch (Exception e) {
            System.err.println("Error happened at Giphy API: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Error happened while retrieving data from Giphy", null));
        }

        List<ExternGiffyDTO> gifs = new ArrayList<>();
        try {
            JsonNode response = objectMapper.readTree(jsonResponse);
            List<JsonNode> data = Arrays.asList(objectMapper.readValue(response.get("data").traverse(), JsonNode[].class));
            gifs = data.stream()
                    .map(jsonNode -> new ExternGiffyDTO(
                            jsonNode.get("id").asText(),
                            jsonNode.get("images").get("original").get("url").asText(),
                            Rating.fromValue(jsonNode.get("rating").asText()),
                            jsonNode.get("title").asText()
                    ))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid rating value in Giphy API response", null));
        } catch (IOException e) {
            System.err.println("Error while processing Giphy API response: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Error while processing Giphy API response", null));
        } catch (Exception e) {
            System.err.println("Uncaught Exception, need more investigation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Please report this uncaught error, more investigation is needed", null));
        }

        ResponseMessage<List<ExternGiffyDTO>> responseMessage = new ResponseMessage<>(
                ResponseMessageStatus.SUCCESS,
                "Trending GIFs retrieved successfully",
                gifs
        );

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> search(@RequestParam("q") String query, @RequestParam(value = "rating", required = false) String rating) {
        String url = "https://api.giphy.com/v1/gifs/search";

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(url)
                .queryParam("api_key", giphyApiKey)
                .queryParam("q", query);

        if (rating != null) {
            try {
                Rating.valueOf(rating.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid rating", null));
            }

            builder.queryParam("rating", rating);
        }
        
        String jsonResponse = null;
        try {
            jsonResponse = this.restTemplate.getForObject(builder.toUriString(), String.class);
        } catch (Exception e) {
            System.err.println("Error happened at Giphy API: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Error happened while retrieving data from Giphy", null));
        }

        List<ExternGiffyDTO> gifs = new ArrayList<>();
        try {
            JsonNode response = objectMapper.readTree(jsonResponse);
            List<JsonNode> data = Arrays.asList(objectMapper.readValue(response.get("data").traverse(), JsonNode[].class));
            gifs = data.stream()
                    .map(jsonNode -> new ExternGiffyDTO(
                            jsonNode.get("id").asText(),
                            jsonNode.get("images").get("original").get("url").asText(),
                            Rating.fromValue(jsonNode.get("rating").asText()),
                            jsonNode.get("title").asText()
                    ))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid rating value in Giphy API response", null));
        } catch (IOException e) {
            System.err.println("Error while processing Giphy API response: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Error while processing Giphy API response", null));
        } catch (Exception e) {
            System.err.println("Uncaught Exception, need more investigation: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Please report this uncaught error, more investigation is needed", null));
        } 

        ResponseMessage<List<ExternGiffyDTO>> responseMessage = new ResponseMessage<>(
                ResponseMessageStatus.SUCCESS,
                "GIFs retrieved successfully",
                gifs
        );

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }
}
