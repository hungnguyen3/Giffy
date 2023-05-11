package com.adventuroushachi.Giffy.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Optional;

import com.adventuroushachi.Giffy.Service.S3Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.adventuroushachi.Giffy.DTO.UserDTO;
import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setUp() throws MalformedURLException {
        // Use lenient to avoid UnnecessaryStubbingException
        Mockito.lenient().when(s3Service.generatePresignedUrl(anyString())).thenReturn(new URL("http://example.com/test.jpg"));
    }

    @Test
    public void testCreateUser() {
        User user = new User();
        user.setUserName("Test User");
        user.setUserEmail("user_email");
        user.setProfileImgS3Url("http://example.com/test.jpg");
        user.setProfileImgS3Key("s3_key");
        user.setCognitoSub("cognito_sub");

        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(user);

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.createUser(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(UserDTO.fromEntity(user, s3Service), response.getBody().getData());
    }

    @Test
    public void testCreateUserWithInvalidData() {
        User user = new User();

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.createUser(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testCreateUserWithDuplicatedUserEmail() {
        User existingUser = new User();
        existingUser.setUserName("Existing User");
        existingUser.setUserEmail("user_email");
        existingUser.setProfileImgS3Url("http://example.com/existing.jpg");
        existingUser.setProfileImgS3Key("existing_s3_key");
        existingUser.setCognitoSub("existing_cognito_sub");

        User newUser = new User();
        newUser.setUserName("New User");
        newUser.setUserEmail("user_email");
        newUser.setProfileImgS3Url("http://example.com/new.jpg");
        newUser.setProfileImgS3Key("new_s3_key");
        newUser.setCognitoSub("new_cognito_sub");

        Mockito.when(userRepository.findByUserEmail(newUser.getUserEmail())).thenReturn(existingUser);

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.createUser(newUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Duplicated email found!", response.getBody().getMessage());
    }

    @Test
    public void testCreateUserWithDuplicatedCognitoIdentity() {
        User existingUser = new User();
        existingUser.setUserName("Existing User");
        existingUser.setUserEmail("existing_user_email");
        existingUser.setProfileImgS3Url("http://example.com/existing.jpg");
        existingUser.setProfileImgS3Key("s3_key");
        existingUser.setCognitoSub("cognito_sub");

        User newUser = new User();
        newUser.setUserName("New User");
        newUser.setUserEmail("new_user_email");
        newUser.setProfileImgS3Url("http://example.com/new.jpg");
        newUser.setProfileImgS3Key("new_s3_key");
        newUser.setCognitoSub("cognito_sub");

        Mockito.when(userRepository.findByCognitoSub(newUser.getCognitoSub())).thenReturn(existingUser);

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.createUser(newUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
        assertEquals("Duplicated cognito identity found!", response.getBody().getMessage());
    }

    @Test
    public void testDeleteUserById() {
        Long userId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));

        ResponseEntity<ResponseMessage<Void>> response = userController.deleteUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testDeleteUserByIdNotFound() {
        Long userId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<Void>> response = userController.deleteUserById(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testGetUserById() {
        Long userId = 1L;
        User user = new User();
        user.setUserName("Test User");
        user.setProfileImgS3Url("http://example.com/test.jpg");
        user.setProfileImgS3Key("s3_key");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.getUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(UserDTO.fromEntity(user, s3Service), response.getBody().getData());
    }

    @Test
    public void testGetUserByIdNotFound() {
        Long userId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.getUserById(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testUpdateUserById() {
        Long userId = 1L;
        User userToUpdate = new User();
        userToUpdate.setUserName("Test User");
        userToUpdate.setUserEmail("user_email");
        userToUpdate.setProfileImgS3Url("http://example.com/test.jpg");
        userToUpdate.setProfileImgS3Key("s3_key");
        userToUpdate.setCognitoSub("cognito_sub");

        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setUserEmail("updated_user_email");
        updatedUser.setProfileImgS3Url("http://example.com/updated.jpg");
        updatedUser.setProfileImgS3Key("updated_s3_key");
        updatedUser.setCognitoSub("updated_cognito_sub");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(updatedUser);

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(UserDTO.fromEntity(updatedUser, s3Service), response.getBody().getData());
    }

    @Test
    public void testUpdateUserByIdNotFound() {
        Long userId = 1L;
        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setUserEmail("user_email");
        updatedUser.setProfileImgS3Url("http://example.com/updated.jpg");
        updatedUser.setProfileImgS3Key("updated_s3_key");
        updatedUser.setCognitoSub("updated_cognito_sub");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testCreateUserWithNullFields() {
        User user = new User();
        user.setUserName(null);
        user.setProfileImgS3Url(null);
        user.setProfileImgS3Key(null);
        user.setCognitoSub(null);

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.createUser(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testDeleteUserByIdWithNullId() {
        ResponseEntity<ResponseMessage<Void>> response = userController.deleteUserById(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testGetUserByIdWithNullId() {
        ResponseEntity<ResponseMessage<UserDTO>> response = userController.getUserById(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testUpdateUserByIdWithNullId() {
        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setProfileImgS3Url("http://example.com/updated.jpg");
        updatedUser.setProfileImgS3Key("updated_s3_key");
        updatedUser.setCognitoSub("updated_cognito_sub");

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.updateUserById(null, updatedUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testUpdateUserByIdWithNullFields() {
        Long userId = 1L;
        User userToUpdate = new User();
        userToUpdate.setUserName("Test User");
        userToUpdate.setProfileImgS3Url("http://example.com/test.jpg");
        userToUpdate.setProfileImgS3Key("s3_key");
        userToUpdate.setCognitoSub("cognito_sub");

        User updatedUser = new User();
        updatedUser.setUserName(null);
        updatedUser.setProfileImgS3Url(null);
        updatedUser.setProfileImgS3Key(null);
        updatedUser.setCognitoSub(null);

        Mockito.lenient().when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

}

