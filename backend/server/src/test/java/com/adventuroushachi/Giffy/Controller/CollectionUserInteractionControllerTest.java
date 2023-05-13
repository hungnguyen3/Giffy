package com.adventuroushachi.Giffy.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.adventuroushachi.Giffy.Controller.Response.ResponseMessage;
import com.adventuroushachi.Giffy.Controller.Response.ResponseMessageStatus;
import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserInteraction;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.CollectionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserInteractionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserRelationshipRepository;
import com.adventuroushachi.Giffy.Repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class CollectionUserInteractionControllerTest {

    @InjectMocks
    private CollectionUserInteractionController collectionController;

    @Mock
    private CollectionRepository collectionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CollectionUserInteractionRepository collectionUserInteractionRepository;

    @Mock
    private CollectionUserRelationshipRepository collectionUserRelationshipRepository;

    private CollectionUserInteraction interaction;

    @BeforeEach
    public void setUp() {
        interaction = new CollectionUserInteraction();
        interaction.setLiked(false);
    }

    @Test
    public void testToggleLikeWithNullIds() {
        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(null, null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Invalid request body", response.getBody().getMessage());
    }

    @Test
    public void testToggleLikeWithNonExistentUser() {
        Long userId = 1L;
        Long collectionId = 1L;

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(userId, collectionId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("User not found", response.getBody().getMessage());
    }

    @Test
    public void testToggleLikeWithNonExistentCollection() {
        Long userId = 1L;
        Long collectionId = 1L;
        User user = new User();
        user.setUserId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(collectionRepository.findById(collectionId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(userId, collectionId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Collection not found", response.getBody().getMessage());
    }

    @Test
    public void testToggleLikeForNonPrivateCollectionWithoutExistingInteraction() {
        Long userId = 1L;
        Long collectionId = 1L;
        User user = new User();
        user.setUserId(userId);
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setIsPrivate(false);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(collectionUserInteractionRepository.findByCollectionAndUser(collection, user)).thenReturn(null);

        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(userId, collectionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Collection liked", response.getBody().getMessage());
    }

    @Test
    public void testToggleLikeForNonPrivateCollectionWithExistingInteraction() {
        Long userId = 1L;
        Long collectionId = 1L;
        User user = new User();
        user.setUserId(userId);
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setIsPrivate(false);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(collectionUserInteractionRepository.findByCollectionAndUser(collection, user)).thenReturn(interaction);

        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(userId, collectionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Collection liked", response.getBody().getMessage());
    }

    @Test
    public void testToggleLikeForPrivateCollectionWithExistingInteraction() {
        Long userId = 1L;
        Long collectionId = 1L;
        User user = new User();
        user.setUserId(userId);
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setIsPrivate(true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(collectionUserInteractionRepository.findByCollectionAndUser(collection, user)).thenReturn(interaction);

        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(userId, collectionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Collection liked", response.getBody().getMessage());
    }

    @Test
    public void testToggleLikeForPrivateCollectionWithoutExistingInteractionAndNoRelationship() {
        Long userId = 1L;
        Long collectionId = 1L;
        User user = new User();
        user.setUserId(userId);
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setIsPrivate(true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(collectionUserInteractionRepository.findByCollectionAndUser(collection, user)).thenReturn(null);
        when(collectionUserRelationshipRepository.findByCollectionAndUser(collection, user)).thenReturn(null);

        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(userId, collectionId);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("User does not have access to this collection", response.getBody().getMessage());
    }

    @Test
    public void testToggleLikeForPrivateCollectionWithoutExistingInteractionWithRelationship() {
        Long userId = 1L;
        Long collectionId = 1L;
        User user = new User();
        user.setUserId(userId);
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setIsPrivate(true);
        CollectionUserRelationship relationship = new CollectionUserRelationship();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(collectionUserInteractionRepository.findByCollectionAndUser(collection, user)).thenReturn(null);
        when(collectionUserRelationshipRepository.findByCollectionAndUser(collection, user)).thenReturn(relationship);

        ResponseEntity<ResponseMessage<String>> response = collectionController.toggleLike(userId, collectionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals("Collection liked", response.getBody().getMessage());
    }
}
