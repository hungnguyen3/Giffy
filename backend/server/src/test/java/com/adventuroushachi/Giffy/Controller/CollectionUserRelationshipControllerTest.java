package com.adventuroushachi.Giffy.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyLong;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.adventuroushachi.Giffy.Controller.Response.ResponseMessage;
import com.adventuroushachi.Giffy.Controller.Response.ResponseMessageStatus;
import com.adventuroushachi.Giffy.DTO.UserDTO;
import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.CollectionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserRelationshipRepository;
import com.adventuroushachi.Giffy.Service.S3Service;

@ExtendWith(MockitoExtension.class)
public class CollectionUserRelationshipControllerTest {

    @Mock
    private CollectionRepository collectionRepository;

    @Mock
    private CollectionUserRelationshipRepository collectionUserRelationshipRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private CollectionUserRelationshipController collectionUserRelationshipController;

    @BeforeEach
    public void setUp() {
        // No setup required for now
    }

    @Test
    public void testGetUsersByCollectionId() {
        Long collectionId = 1L;

        Collection collection = new Collection();
        CollectionUserRelationship relation = new CollectionUserRelationship();
        User user = new User();
        user.setUserName("Test User");

        relation.setUser(user);
        relation.setCollection(collection);

        List<CollectionUserRelationship> relations = Arrays.asList(relation);

        Mockito.when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        Mockito.when(collectionUserRelationshipRepository.findByIdCollectionId(collectionId)).thenReturn(relations);

        UserDTO userDTOExpected = UserDTO.fromEntity(user, s3Service);
        List<UserDTO> usersDTOExpected = Arrays.asList(userDTOExpected);

        ResponseEntity<ResponseMessage<List<UserDTO>>> response = collectionUserRelationshipController
                .getUsersByCollectionId(collectionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(usersDTOExpected, response.getBody().getData());
    }

    @Test
    public void testGetUsersByCollectionIdWithNullId() {
        ResponseEntity<ResponseMessage<List<UserDTO>>> response = collectionUserRelationshipController
                .getUsersByCollectionId(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testGetUsersByCollectionIdWithInvalidId() {
        Long collectionId = -1L;

        Mockito.when(collectionRepository.findById(collectionId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<List<UserDTO>>> response = collectionUserRelationshipController
                .getUsersByCollectionId(collectionId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testGetUsersByCollectionIdWithNoRelationship() {
        Long collectionId = 1L;

        Collection collection = new Collection();

        Mockito.when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        Mockito.when(collectionUserRelationshipRepository.findByIdCollectionId(collectionId))
                .thenReturn(Arrays.asList());

        ResponseEntity<ResponseMessage<List<UserDTO>>> response = collectionUserRelationshipController
                .getUsersByCollectionId(collectionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(0, response.getBody().getData().size());
    }
}
