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

import com.adventuroushachi.Giffy.DTO.CollectionDTO;
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
    public ResponseEntity<ResponseMessage<CollectionDTO>> createCollectionByUser(@PathVariable("userId") Long userId, @RequestBody Collection collection) {
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

        CollectionDTO collectionDTO = CollectionDTO.fromEntity(savedCollection);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collection created", collectionDTO));
    }

    @GetMapping("/getCollectionById/{id}")
    public ResponseEntity<ResponseMessage<CollectionDTO>> getCollectionById(@PathVariable("id") Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid collection ID", null));
        }

        Optional<Collection> optionalCollection = collectionRepository.findById(id);
        if (optionalCollection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Collection not found", null));
        }

        Collection collection = optionalCollection.get();
        CollectionDTO collectionDTO = CollectionDTO.fromEntity(collection);

        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collection found", collectionDTO));
    }

    @PutMapping("/updateCollectionById/{id}")
    public ResponseEntity<ResponseMessage<CollectionDTO>> updateCollectionById(@PathVariable("id") Long id, @RequestBody Collection updatedCollection) {
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
        
        CollectionDTO collectionDTO = CollectionDTO.fromEntity(savedCollection);

        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Collection updated", collectionDTO));
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
    public ResponseEntity<ResponseMessage<List<CollectionDTO>>> getPublicCollections() {
        List<Collection> publicCollections = collectionRepository.findByIsPrivateFalse();

        List<CollectionDTO> collectionDTOs = CollectionDTO.fromEntities(publicCollections);

        ResponseMessage<List<CollectionDTO>> responseMessage = new ResponseMessage<>(
                ResponseMessageStatus.SUCCESS,
                "Public collections found",
                collectionDTOs
        );

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    @GetMapping("/getCollectionsByUserId/{userId}")
    public ResponseEntity<ResponseMessage<List<CollectionDTO>>> getCollectionsByUserId(@PathVariable("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }

        List<CollectionUserRelationship> relationships = collectionUserRelationshipRepository.findByIdUserId(userId);
        List<Collection> collections = relationships.stream()
                .map(relationship -> collectionRepository.findById(relationship.getId().getCollectionId()).orElse(null))
                .filter(collection -> collection != null)
                .collect(Collectors.toList());

        List<CollectionDTO> collectionDTOs = CollectionDTO.fromEntities(collections);

        ResponseMessage<List<CollectionDTO>> responseMessage = new ResponseMessage<>(
                ResponseMessageStatus.SUCCESS,
                "Collections retrieved successfully",
                collectionDTOs
        );

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

}
