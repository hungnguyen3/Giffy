package com.adventuroushachi.Giffy.Controller;

import java.util.List;
import java.util.Optional;

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

import com.adventuroushachi.Giffy.Controller.Response.ResponseMessage;
import com.adventuroushachi.Giffy.Controller.Response.ResponseMessageStatus;
import com.adventuroushachi.Giffy.DTO.GiffyDTO;
import com.adventuroushachi.Giffy.Model.Giffy;
import com.adventuroushachi.Giffy.Repository.GiffyRepository;
import com.adventuroushachi.Giffy.Service.S3Service;

@RestController
@RequestMapping("/api/giffies")
public class GiffyController {

    @Autowired
    private GiffyRepository giffyRepository;

    @Autowired
    private S3Service s3Service;

    @PostMapping("/createGiffy")
    public ResponseEntity<ResponseMessage<GiffyDTO>> createGiffy(@RequestBody Giffy giffy) {
        if (giffy == null || giffy.getCollectionId() == null || giffy.getGiffyS3Url() == null
                || giffy.getGiffyS3Key() == null) {
            return ResponseEntity.badRequest()
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }

        Giffy savedGiffy = giffyRepository.save(giffy);
        GiffyDTO giffyDTO = GiffyDTO.fromEntity(savedGiffy, s3Service);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Giffy created", giffyDTO));
    }

    @DeleteMapping("/deleteGiffiesByIds")
    public ResponseEntity<ResponseMessage<Void>> deleteGiffiesByIds(@RequestBody List<Long> giffyIds) {
        if (giffyIds == null || giffyIds.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }

        giffyRepository.deleteAllById(giffyIds);
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Giffies deleted", null));
    }

    @GetMapping("/getGiffyById/{id}")
    public ResponseEntity<ResponseMessage<GiffyDTO>> getGiffyById(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest()
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid Giffy ID", null));
        }

        Optional<Giffy> optionalGiffy = giffyRepository.findById(id);
        if (optionalGiffy.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Giffy not found", null));
        }

        Giffy giffy = optionalGiffy.get();
        GiffyDTO giffyDTO = GiffyDTO.fromEntity(giffy, s3Service);

        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Giffy found", giffyDTO));
    }

    @PutMapping("/updateGiffyById/{id}")
    public ResponseEntity<ResponseMessage<GiffyDTO>> updateGiffyById(@PathVariable Long id,
            @RequestBody Giffy updatedGiffyBody) {
        if (id == null || updatedGiffyBody == null || updatedGiffyBody.getGiffyName() == null) {
            return ResponseEntity.badRequest()
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }

        Optional<Giffy> optionalGiffy = giffyRepository.findById(id);
        if (optionalGiffy.isPresent()) {
            Giffy giffy = optionalGiffy.get();
            giffy.setCollectionId(updatedGiffyBody.getCollectionId());
            giffy.setGiffyS3Url(updatedGiffyBody.getGiffyS3Url());
            giffy.setGiffyS3Key(updatedGiffyBody.getGiffyS3Key());
            giffy.setGiffyName(updatedGiffyBody.getGiffyName());
            Giffy updatedGiffy = giffyRepository.save(giffy);
            GiffyDTO updatedGiffyDTO = GiffyDTO.fromEntity(updatedGiffy, s3Service);

            return ResponseEntity.ok()
                    .body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Giffy updated", updatedGiffyDTO));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Giffy not found", null));
        }
    }

    @GetMapping("/byCollectionId/{collectionId}")
    public ResponseEntity<ResponseMessage<List<GiffyDTO>>> getGiffiesByCollectionId(@PathVariable Long collectionId) {
        if (collectionId == null) {
            return ResponseEntity.badRequest()
                    .body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid collection ID", null));
        }

        List<Giffy> giffies = giffyRepository.findByCollectionId(collectionId);
        List<GiffyDTO> giffyDTOs = GiffyDTO.fromEntities(giffies, s3Service);

        ResponseMessage<List<GiffyDTO>> responseMessage = new ResponseMessage<>(
                ResponseMessageStatus.SUCCESS,
                "Giffies retrieved successfully",
                giffyDTOs);

        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }
}
