package com.adventuroushachi.Giffy.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.Permission;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.CollectionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserRelationshipRepository;
import com.adventuroushachi.Giffy.Repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
public class CollectionControllerTest {

    @Mock
    private CollectionRepository collectionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CollectionUserRelationshipRepository collectionUserRelationshipRepository;

    @InjectMocks
    private CollectionController collectionController;

    @Test
    public void testCreateCollectionByUser() {
        Long userId = 1L;
        User user = new User();
        user.setUserId(userId);

        Collection collection = new Collection();
        collection.setCollectionName("Test Collection");
        collection.setIsPrivate(false);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(collectionRepository.save(any(Collection.class))).thenReturn(collection);

        ResponseEntity<Collection> response = collectionController.createCollectionByUser(userId, collection);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(collection, response.getBody());
    }

    @Test
    public void testCreateCollectionByUserNotFound() {
        Long userId = 1L;
        Collection collection = new Collection();
        collection.setCollectionName("Test Collection");
        collection.setIsPrivate(false);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<Collection> response = collectionController.createCollectionByUser(userId, collection);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetCollectionById() {
        Long collectionId = 1L;
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setCollectionName("Test Collection");
        collection.setIsPrivate(false);

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));

        ResponseEntity<Collection> response = collectionController.getCollectionById(collectionId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(collection, response.getBody());
    }

    @Test
    public void testGetCollectionByIdNotFound() {
        Long collectionId = 1L;

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.empty());

        ResponseEntity<Collection> response = collectionController.getCollectionById(collectionId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testUpdateCollectionById() {
        Long collectionId = 1L;
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setCollectionName("Test Collection");
        collection.setIsPrivate(false);

        Collection updatedCollection = new Collection();
        updatedCollection.setCollectionName("Updated Collection");
        updatedCollection.setIsPrivate(true);

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));
        when(collectionRepository.save(any(Collection.class))).thenReturn(updatedCollection);

        ResponseEntity<Collection> response = collectionController.updateCollectionById(collectionId, updatedCollection);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedCollection, response.getBody());
    }

    @Test
    public void testUpdateCollectionByIdNotFound() {
        Long collectionId = 1L;
        Collection updatedCollection = new Collection();
        updatedCollection.setCollectionName("Updated Collection");
        updatedCollection.setIsPrivate(true);

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.empty());

        ResponseEntity<Collection> response = collectionController.updateCollectionById(collectionId, updatedCollection);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeleteCollectionById() {
        Long collectionId = 1L;
        Collection collection = new Collection();
        collection.setCollectionId(collectionId);
        collection.setCollectionName("Test Collection");
        collection.setIsPrivate(false);

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.of(collection));

        ResponseEntity<Void> response = collectionController.deleteCollectionById(collectionId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    public void testDeleteCollectionByIdNotFound() {
        Long collectionId = 1L;

        when(collectionRepository.findById(collectionId)).thenReturn(Optional.empty());

        ResponseEntity<Void> response = collectionController.deleteCollectionById(collectionId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetPublicCollections() {
        Collection collection1 = new Collection();
        collection1.setCollectionName("Public Collection 1");
        collection1.setIsPrivate(false);

        Collection collection2 = new Collection();
        collection2.setCollectionName("Public Collection 2");
        collection2.setIsPrivate(false);

        List<Collection> publicCollections = Arrays.asList(collection1, collection2);

        when(collectionRepository.findByIsPrivateFalse()).thenReturn(publicCollections);

        ResponseEntity<List<Collection>> response = collectionController.getPublicCollections();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(publicCollections, response.getBody());
    }

    @Test
    public void testGetCollectionsByUserId() {
        Long userId = 1L;
        User user = new User();
        user.setUserId(userId);

        Collection collection1 = new Collection();
        collection1.setCollectionId(1L);
        collection1.setCollectionName("User Collection 1");
        collection1.setIsPrivate(false);

        Collection collection2 = new Collection();
        collection2.setCollectionId(2L);
        collection2.setCollectionName("User Collection 2");
        collection2.setIsPrivate(true);

        CollectionUserRelationship relationship1 = new CollectionUserRelationship(collection1, user, Permission.ADMIN);
        CollectionUserRelationship relationship2 = new CollectionUserRelationship(collection2, user, Permission.ADMIN);

        List<CollectionUserRelationship> relationships = Arrays.asList(relationship1, relationship2);
        List<Collection> collections = Arrays.asList(collection1, collection2);

        when(collectionUserRelationshipRepository.findByIdUserId(userId)).thenReturn(relationships);
        when(collectionRepository.findById(1L)).thenReturn(Optional.of(collection1));
        when(collectionRepository.findById(2L)).thenReturn(Optional.of(collection2));

        ResponseEntity<List<Collection>> response = collectionController.getCollectionsByUserId(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(collections, response.getBody());
    }
}

