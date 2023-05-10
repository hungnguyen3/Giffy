package com.adventuroushachi.Giffy.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.adventuroushachi.Giffy.DTO.GiffyDTO;
import com.adventuroushachi.Giffy.Model.Giffy;
import com.adventuroushachi.Giffy.Repository.GiffyRepository;

@ExtendWith(MockitoExtension.class)
public class GiffyControllerTest {

    @InjectMocks
    private GiffyController giffyController;

    @Mock
    private GiffyRepository giffyRepository;

    private Giffy giffy;
    private GiffyDTO giffyDTO;

    @BeforeEach
    public void setUp() {
        giffy = new Giffy();
        giffy.setGiffyId(1L);
        giffy.setCollectionId(1L);
        giffy.setGiffyS3Url("https://example.com/s3url");
        giffy.setGiffyS3Key("s3Key");
        giffy.setGiffyName("Giffy Name");

        giffyDTO = GiffyDTO.fromEntity(giffy);
    }

    @Test
    public void testCreateGiffyWithInvalidInput() {
        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.createGiffy(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Invalid request body", response.getBody().getMessage());
    }

    @Test
    public void testCreateGiffyWithValidInput() {
        when(giffyRepository.save(giffy)).thenReturn(giffy);

        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.createGiffy(giffy);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Giffy created", response.getBody().getMessage());
        assertEquals(giffyDTO, response.getBody().getData());
    }

    @Test
    public void testDeleteGiffiesByIdsWithInvalidInput() {
        ResponseEntity<ResponseMessage<Void>> response = giffyController.deleteGiffiesByIds(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Invalid request body", response.getBody().getMessage());
    }

    @Test
    public void testDeleteGiffiesByIdsWithValidInput() {
        List<Long> giffyIds = Arrays.asList(1L, 2L);

        ResponseEntity<ResponseMessage<Void>> response = giffyController.deleteGiffiesByIds(giffyIds);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Giffies deleted", response.getBody().getMessage());
    }

    @Test
    public void testGetGiffyByIdWithInvalidInput() {
        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.getGiffyById(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Invalid Giffy ID", response.getBody().getMessage());
    }

    @Test
    public void testGetGiffyByIdWithNonExistentId() {
        Long giffyId = 1L;

        when(giffyRepository.findById(giffyId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.getGiffyById(giffyId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Giffy not found", response.getBody().getMessage());
    }

    @Test
    public void testGetGiffyByIdWithValidInput() {
        Long giffyId = 1L;

        when(giffyRepository.findById(giffyId)).thenReturn(Optional.of(giffy));

        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.getGiffyById(giffyId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Giffy found", response.getBody().getMessage());
        assertEquals(giffyDTO, response.getBody().getData());
    }

    @Test
    public void testUpdateGiffyByIdWithInvalidInput() {
        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.updateGiffyById(null, null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Invalid request body", response.getBody().getMessage());
    }

    @Test
    public void testUpdateGiffyByIdWithNonExistentId() {
        Long giffyId = 1L;

        when(giffyRepository.findById(giffyId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.updateGiffyById(giffyId, giffy);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Giffy not found", response.getBody().getMessage());
    }

    @Test
    public void testUpdateGiffyByIdWithValidInput() {
        Long giffyId = 1L;

        when(giffyRepository.findById(giffyId)).thenReturn(Optional.of(giffy));
        when(giffyRepository.save(giffy)).thenReturn(giffy);

        ResponseEntity<ResponseMessage<GiffyDTO>> response = giffyController.updateGiffyById(giffyId, giffy);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Giffy updated", response.getBody().getMessage());
        assertEquals(giffyDTO, response.getBody().getData());
    }
}  
