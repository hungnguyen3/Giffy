package com.adventuroushachi.Giffy.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserInteraction;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.CollectionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserInteractionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserRelationshipRepository;
import com.adventuroushachi.Giffy.Repository.UserRepository;

@RestController
@RequestMapping("/api/collectionUserInteractions")
public class CollectionUserInteractionController {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollectionUserInteractionRepository collectionUserInteractionRepository;

    @Autowired
    private CollectionUserRelationshipRepository collectionUserRelationshipRepository;

    @PutMapping("/toggleLike/{userId}/{collectionId}")
    public ResponseEntity<ResponseMessage<String>> toggleLike(@PathVariable("userId") Long userId, @PathVariable("collectionId") Long collectionId) {
        if (userId == null || collectionId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
        User user = optionalUser.get();

        Optional<Collection> optionalCollection = collectionRepository.findById(collectionId);
        if (optionalCollection.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Collection not found", null));
        }
        Collection collection = optionalCollection.get();

        CollectionUserInteraction interaction = collectionUserInteractionRepository.findByCollectionAndUser(collection, user);
        CollectionUserRelationship relationship = collectionUserRelationshipRepository.findByCollectionAndUser(collection, user);

        if (interaction == null) {
            if (collection.getIsPrivate() && relationship == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User does not have access to this collection", null));
            } else {
                interaction = new CollectionUserInteraction(collection, user);
                interaction.setCollection(collection);
                interaction.setUser(user);
            }
        }

        boolean liked = interaction.getLiked();
        interaction.setLiked(!liked);
        collectionUserInteractionRepository.save(interaction);

        String message = liked ? "Collection unliked" : "Collection liked";
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, message, null));
    }

}
