package com.adventuroushachi.Giffy.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adventuroushachi.Giffy.Controller.Response.ResponseMessage;
import com.adventuroushachi.Giffy.Controller.Response.ResponseMessageStatus;
import com.adventuroushachi.Giffy.DTO.UserDTO;
import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Repository.CollectionRepository;
import com.adventuroushachi.Giffy.Repository.CollectionUserRelationshipRepository;
import com.adventuroushachi.Giffy.Service.S3Service;

@RestController
@RequestMapping("/api/collectionUserRelationships")
public class CollectionUserRelationshipController {

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private CollectionUserRelationshipRepository collectionUserRelationshipRepository;

    @Autowired
    private S3Service s3Service;

    @GetMapping("/getUsersByCollectionId/{collectionId}")
    public ResponseEntity<ResponseMessage<List<UserDTO>>> getUsersByCollectionId(
            @PathVariable("collectionId") Long collectionId) {
        if (collectionId == null) {
            return ResponseEntity.badRequest()
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request parameter", null));
        }

        Collection collection = collectionRepository.findById(collectionId).orElse(null);
        if (collection == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Collection not found", null));
        }

        List<UserDTO> users = collectionUserRelationshipRepository.findByIdCollectionId(collectionId).stream()
                .map(collectionUserRelationship -> UserDTO.fromEntity(collectionUserRelationship.getUser(), s3Service))
                .collect(Collectors.toList());

        return ResponseEntity.ok()
                .body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Users retrieved successfully", users));
    }
}
