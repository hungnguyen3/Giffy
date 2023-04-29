package com.adventuroushachi.Giffy.Controller;

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

import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/createUser")
    public ResponseEntity<ResponseMessage<User>> createUser(@RequestBody User user) {
        if (user == null || user.getUserName() == null || user.getCognitoSub() == null || user.getProfileImgUrl() == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }
        User createdUser = userRepository.save(user);
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User created", createdUser));
    }

    @DeleteMapping("/deleteUserById/{userId}")
    public ResponseEntity<ResponseMessage<Void>> deleteUserById(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }
        Optional<User> userToDelete = userRepository.findById(userId);
        if(userToDelete.isPresent()) {
            userRepository.deleteById(userId);
            return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User deleted", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
    }

    @GetMapping("/getUserById/{userId}")
    public ResponseEntity<ResponseMessage<User>> getUserById(@PathVariable Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }
        Optional<User> user = userRepository.findById(userId);
        if(user.isPresent()) {
            return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User found", user.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
    }

    @GetMapping("/getCurrentUser")
    public ResponseEntity<ResponseMessage<User>> getCurrentUser() {
        // code to get current user
        return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "Current user found", null));
    }

    @PutMapping("/updateUserById/{userId}")
    public ResponseEntity<ResponseMessage<User>> updateUserById(@PathVariable Long userId, @RequestBody User user) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid user ID", null));
        }
        if (user == null || user.getUserName() == null || user.getCognitoSub() == null || user.getProfileImgUrl() == null) {
            return ResponseEntity.badRequest().body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "Invalid request body", null));
        }
        Optional<User> userToUpdate = userRepository.findById(userId);
        if(userToUpdate.isPresent()) {
            User existingUser = userToUpdate.get();
            existingUser.setUserName(user.getUserName());
            existingUser.setCognitoSub(user.getCognitoSub());
            existingUser.setProfileImgUrl(user.getProfileImgUrl());
            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok().body(new ResponseMessage<>(ResponseMessageStatus.SUCCESS, "User updated", updatedUser));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage<>(ResponseMessageStatus.ERROR, "User not found", null));
        }
    }
}
