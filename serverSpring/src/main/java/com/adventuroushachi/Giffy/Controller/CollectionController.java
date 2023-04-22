package com.adventuroushachi.Giffy.Controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.Permission;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.CollectionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserRelationshipRepository;
import com.adventuroushachi.Giffy.Repository.UserRepository;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollectionUserRelationshipRepository collectionUserRelationshipRepository;

   
    @PostMapping("/createCollectionByUser/{userId}")
    public ResponseEntity<Collection> createCollectionByUser(@PathVariable("userId") Long userId, @RequestBody Collection collection) {
        // Check if the user exists
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        User user = optionalUser.get();

        // Save the collection in the database
        Collection savedCollection = collectionRepository.save(collection);

        // Create a new relationship with admin permission
        CollectionUserRelationship relationship = new CollectionUserRelationship(savedCollection, user, Permission.ADMIN);
        collectionUserRelationshipRepository.save(relationship);

        return new ResponseEntity<>(savedCollection, HttpStatus.CREATED);
    }


    @GetMapping("/getCollectionById/{id}")
    public ResponseEntity<Collection> getCollectionById(@PathVariable("id") Long id) {
        // Check if the collection exists
        Optional<Collection> optionalCollection = collectionRepository.findById(id);
        if (optionalCollection.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Collection collection = optionalCollection.get();
        return new ResponseEntity<>(collection, HttpStatus.OK);
    }

    @PutMapping("/updateCollectionById/{id}")
    public ResponseEntity<Collection> updateCollectionById(@PathVariable("id") Long id, @RequestBody Collection updatedCollection) {
        // Check if the collection exists
        Optional<Collection> optionalCollection = collectionRepository.findById(id);
        if (optionalCollection.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Collection collection = optionalCollection.get();

        // Update the collection in the database
        collection.setCollectionName(updatedCollection.getCollectionName());
        collection.setIsPrivate(updatedCollection.getIsPrivate());
        Collection savedCollection = collectionRepository.save(collection);
        return new ResponseEntity<>(savedCollection, HttpStatus.OK);
    }

    @DeleteMapping("/deleteCollectionById/{id}")
    public ResponseEntity<Void> deleteCollectionById(@PathVariable("id") Long id) {
        // Check if the collection exists
        Optional<Collection> optionalCollection = collectionRepository.findById(id);
        if (optionalCollection.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Delete the collection from the database
        collectionRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/getPublicCollections")
    public ResponseEntity<List<Collection>> getPublicCollections() {
        List<Collection> publicCollections = collectionRepository.findByIsPrivateFalse();
        return new ResponseEntity<>(publicCollections, HttpStatus.OK);
    }

    
    @GetMapping("/getCollectionsByUserId/{userId}")
    public ResponseEntity<List<Collection>> getCollectionsByUserId(@PathVariable("userId") Long userId) {
        List<CollectionUserRelationship> relationships = collectionUserRelationshipRepository.findByIdUserId(userId);
        List<Collection> collections = relationships.stream()
                .map(relationship -> collectionRepository.findById(relationship.getId().getCollectionId()).orElse(null))
                .filter(collection -> collection != null)
                .collect(Collectors.toList());
        return new ResponseEntity<>(collections, HttpStatus.OK);
    }

}
