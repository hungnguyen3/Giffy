package com.adventuroushachi.Giffy.Controller;

import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.Permission;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.CollectionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserRelationshipRepository;
import com.adventuroushachi.Giffy.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public ResponseEntity<ResponseMessage<Collection>> createCollectionByUser(@PathVariable("userId") Long userId, @RequestBody Collection collection) {
        if (userId == null || collection == null || collection.getCollectionName() == null || collection.getIsPrivate() == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
        User user = optionalUser.get();

        Collection savedCollection = collectionRepository.save(collection);

        CollectionUserRelationship relationship = new CollectionUserRelationship(savedCollection, user, Permission.ADMIN);
        collectionUserRelationshipRepository.save(relationship);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collection created", savedCollection));
    }

    @GetMapping("/getCollectionById/{id}")
    public ResponseEntity<ResponseMessage<Collection>> getCollectionById(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid collection ID", null));
        }

        Optional<Collection> optionalCollection = collectionRepository.findById(id);
        if (optionalCollection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Collection not found", null));
        }

        Collection collection = optionalCollection.get();
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collection found", collection));
    }

    @PutMapping("/updateCollectionById/{id}")
    public ResponseEntity<ResponseMessage<Collection>> updateCollectionById(@PathVariable("id") Long id, @RequestBody Collection updatedCollection) {
        if (id == null || updatedCollection == null || updatedCollection.getCollectionName() == null || updatedCollection.getIsPrivate() == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }

        Optional<Collection> optionalCollection = collectionRepository.findById(id);
        if (optionalCollection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Collection not found", null));
        }

        Collection collection = optionalCollection.get();

        collection.setCollectionName(updatedCollection.getCollectionName());
        collection.setIsPrivate(updatedCollection.getIsPrivate());
        Collection savedCollection = collectionRepository.save(collection);
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collection updated", savedCollection));
    }

    @DeleteMapping("/deleteCollectionById/{id}")
    public ResponseEntity<ResponseMessage<Void>> deleteCollectionById(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid collection ID", null));
        }

        Optional<Collection> optionalCollection = collectionRepository.findById(id);
        if (optionalCollection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Collection not found", null));
        }

        collectionRepository.deleteById(id);
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collection deleted", null));
    }

    @GetMapping("/getPublicCollections")
    public ResponseEntity<ResponseMessage<List<Collection>>> getPublicCollections() {
        List<Collection> publicCollections = collectionRepository.findByIsPrivateFalse();
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Public collections found", publicCollections));
    }

    @GetMapping("/getCollectionsByUserId/{userId}")
    public ResponseEntity<ResponseMessage<List<Collection>>> getCollectionsByUserId(@PathVariable("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }

        List<CollectionUserRelationship> relationships = collectionUserRelationshipRepository.findByIdUserId(userId);
        List<Collection> collections = relationships.stream()
                .map(relationship -> collectionRepository.findById(relationship.getId().getCollectionId()).orElse(null))
                .filter(collection -> collection != null)
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collections found", collections));
    }

}
