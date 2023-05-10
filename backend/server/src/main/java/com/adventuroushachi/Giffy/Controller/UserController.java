package com.adventuroushachi.Giffy.Controller;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.adventuroushachi.Giffy.Service.S3Service;
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
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.adventuroushachi.Giffy.DTO.UserDTO;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.UserRepository;
import com.adventuroushachi.Giffy.Utils.Exception.InvalidAuthorizationException;
import com.adventuroushachi.Giffy.Utils.Jwt.JwtUtils;
import com.google.gson.Gson;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    @PostMapping("/createUser")
    public ResponseEntity<ResponseMessage<UserDTO>> createUser(@RequestBody User user) {
        if (user == null ||
                user.getUserName() == null ||
                user.getUserEmail() == null ||
                user.getCognitoSub() == null ||
                user.getProfileImgS3Url() == null ||
                user.getProfileImgS3Key() == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }

        User existingUserWithSameUserEmail = userRepository.findByUserEmail(user.getUserEmail());
        if (existingUserWithSameUserEmail != null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Duplicated email found!", null));
        }

        User existingUserWithSameCognitoSub = userRepository.findByCognitoSub(user.getCognitoSub());
        if (existingUserWithSameCognitoSub != null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Duplicated cognito identity found!", null));
        }

        User createdUser = userRepository.save(user);
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User created", UserDTO.fromEntity(createdUser, s3Service)));
    }

    @DeleteMapping("/deleteUserById/{userId}")
    public ResponseEntity<ResponseMessage<Void>> deleteUserById(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }
        Optional<User> userToDelete = userRepository.findById(userId);
        if (userToDelete.isPresent()) {
            userRepository.deleteById(userId);
            return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User deleted", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
    }

    @GetMapping("/getUserById/{userId}")
    public ResponseEntity<ResponseMessage<UserDTO>> getUserById(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User found", UserDTO.fromEntity(user.get(), s3Service)));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
    }

    @GetMapping("/getCurrentUser")
    public ResponseEntity<ResponseMessage<UserDTO>> getCurrentUser() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();

        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = attrs.getRequest().getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.put(headerName, attrs.getRequest().getHeader(headerName));
        }

        String cognitoSub = null;
        try {
            cognitoSub = JwtUtils.getCognitoSubFromHeader(headers, new Gson());
        } catch (InvalidAuthorizationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, e.getMessage(), null));
        }

        if (cognitoSub == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Unauthorized", null));
        }

        User existingUser = userRepository.findByCognitoSub(cognitoSub);
        if (existingUser != null) {
            return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Current user found", UserDTO.fromEntity(existingUser, s3Service)));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found in the database", null));
        }
    }

    @PutMapping("/updateUserById/{userId}")
    public ResponseEntity<ResponseMessage<UserDTO>> updateUserById(@PathVariable Long userId, @RequestBody User user) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }
        if (user == null ||
                user.getUserName() == null ||
                user.getUserEmail() == null ||
                user.getCognitoSub() == null ||
                user.getProfileImgS3Url() == null ||
                user.getProfileImgS3Key() == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }
        Optional<User> userToUpdate = userRepository.findById(userId);
        if (userToUpdate.isPresent()) {
            User existingUser = userToUpdate.get();
            existingUser.setUserName(user.getUserName());
            existingUser.setUserEmail(user.getUserEmail());
            existingUser.setCognitoSub(user.getCognitoSub());
            existingUser.setProfileImgS3Url(user.getProfileImgS3Url());
            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User updated", UserDTO.fromEntity(updatedUser, s3Service)));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
    }
}
