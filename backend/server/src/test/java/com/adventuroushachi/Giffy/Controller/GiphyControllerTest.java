package com.adventuroushachi.Giffy.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.adventuroushachi.Giffy.DTO.ExternGiffyDTO;
import com.adventuroushachi.Giffy.Model.Rating;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@ExtendWith(MockitoExtension.class)
public class GiphyControllerTest {
    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GiphyController giphyController;

    private String sampleJsonResponse;

    @BeforeEach
    public void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        ObjectNode gif1 = objectMapper.createObjectNode()
            .put("id", "1")
            .put("rating", "g")
            .put("title", "GIF 1")
            .set("images", objectMapper.createObjectNode()
                .set("original", objectMapper.createObjectNode()
                    .put("url", "https://example.com/1.gif")));
        ObjectNode gif2 = objectMapper.createObjectNode()
            .put("id", "2")
            .put("rating", "pg")
            .put("title", "GIF 2")
            .set("images", objectMapper.createObjectNode()
                .set("original", objectMapper.createObjectNode()
                    .put("url", "https://example.com/2.gif")));
        arrayNode.add(gif1);
        arrayNode.add(gif2);
        ObjectNode jsonNode = objectMapper.createObjectNode().set("data", arrayNode);            

        sampleJsonResponse = jsonNode.toString();
    }

    @Test
    public void testTrending() {
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenReturn(sampleJsonResponse);

        ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> response = giphyController.trending();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Trending GIFs retrieved successfully", response.getBody().getMessage());

        List<ExternGiffyDTO> gifs = response.getBody().getData();
        assertEquals(2, gifs.size());

        assertEquals("1", gifs.get(0).getExternGiffyId());
        assertEquals("https://example.com/1.gif", gifs.get(0).getUrl());
        assertEquals(Rating.G, gifs.get(0).getRating());
        assertEquals("GIF 1", gifs.get(0).getExternGiffyName());

        assertEquals("2", gifs.get(1).getExternGiffyId());
        assertEquals("https://example.com/2.gif", gifs.get(1).getUrl());
        assertEquals(Rating.PG, gifs.get(1).getRating());
        assertEquals("GIF 2", gifs.get(1).getExternGiffyName());
    }

    @Test
    public void testSearch() {
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenReturn(sampleJsonResponse);

        ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> response = giphyController.search("test", null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("GIFs retrieved successfully", response.getBody().getMessage());

        List<ExternGiffyDTO> gifs = response.getBody().getData();
        assertEquals(2, gifs.size());

        assertEquals("1", gifs.get(0).getExternGiffyId());
        assertEquals("https://example.com/1.gif", gifs.get(0).getUrl());
        assertEquals(Rating.G, gifs.get(0).getRating());
        assertEquals("GIF 1", gifs.get(0).getExternGiffyName());

        assertEquals("2", gifs.get(1).getExternGiffyId());
        assertEquals("https://example.com/2.gif", gifs.get(1).getUrl());
        assertEquals(Rating.PG, gifs.get(1).getRating());
        assertEquals("GIF 2", gifs.get(1).getExternGiffyName());
    }

    @Test
    public void testSearchWithInvalidRating() {
        ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> response = giphyController.search("test", "invalid");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Invalid rating", response.getBody().getMessage());
    }

    @Test
    public void testSearchWithValidRating() {
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenReturn(sampleJsonResponse);

        ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> response = giphyController.search("test", "g");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("GIFs retrieved successfully", response.getBody().getMessage());

        List<ExternGiffyDTO> gifs = response.getBody().getData();
        assertEquals(2, gifs.size());

        assertEquals("1", gifs.get(0).getExternGiffyId());
        assertEquals("https://example.com/1.gif", gifs.get(0).getUrl());
        assertEquals(Rating.G, gifs.get(0).getRating());
        assertEquals("GIF 1", gifs.get(0).getExternGiffyName());

        assertEquals("2", gifs.get(1).getExternGiffyId());
        assertEquals("https://example.com/2.gif", gifs.get(1).getUrl());
        assertEquals(Rating.PG, gifs.get(1).getRating());
        assertEquals("GIF 2", gifs.get(1).getExternGiffyName());
    }

    @Test
    public void testSearchWithEmptyQuery() {
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenReturn(sampleJsonResponse);

        ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> response = giphyController.search("", null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("GIFs retrieved successfully", response.getBody().getMessage());

        List<ExternGiffyDTO> gifs = response.getBody().getData();
        assertEquals(2, gifs.size());
    }

    @Test
    public void testSearchWithErrorResponse() {
        when(restTemplate.getForObject(anyString(), eq(String.class)))
                .thenThrow(new RuntimeException("Error happened while retrieving data from Giphy"));

        ResponseEntity<ResponseMessage<List<ExternGiffyDTO>>> response = giphyController.search("test", null);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Error happened while retrieving data from Giphy", response.getBody().getMessage());
    }
}
