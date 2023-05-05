package com.adventuroushachi.Giffy.Controller;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Optional;

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

    @InjectMocks
    private UserController userController;

    @Test
    public void testCreateUser() {
        User user = new User();
        user.setUserName("Test User");
        user.setUserEmail("user_email");
        user.setProfileImgUrl("http://example.com/test.jpg");
        user.setCognitoSub("cognito_sub");

        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(user);

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.createUser(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(UserDTO.fromEntity(user), response.getBody().getData());
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
        existingUser.setProfileImgUrl("http://example.com/existing.jpg");
        existingUser.setCognitoSub("existing_cognito_sub");

        User newUser = new User();
        newUser.setUserName("New User");
        newUser.setUserEmail("user_email");
        newUser.setProfileImgUrl("http://example.com/new.jpg");
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
        existingUser.setProfileImgUrl("http://example.com/existing.jpg");
        existingUser.setCognitoSub("cognito_sub");

        User newUser = new User();
        newUser.setUserName("New User");
        newUser.setUserEmail("new_user_email");
        newUser.setProfileImgUrl("http://example.com/new.jpg");
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
        user.setProfileImgUrl("http://example.com/test.jpg");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.getUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(UserDTO.fromEntity(user), response.getBody().getData());
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
        userToUpdate.setProfileImgUrl("http://example.com/test.jpg");
        userToUpdate.setCognitoSub("cognito_sub");

        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setUserEmail("updated_user_email");
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");
        updatedUser.setCognitoSub("updated_cognito_sub");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(updatedUser);

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(UserDTO.fromEntity(updatedUser), response.getBody().getData());
    }

    @Test
    public void testUpdateUserByIdNotFound() {
        Long userId = 1L;
        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setUserEmail("user_email");
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");
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
        user.setProfileImgUrl(null);
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
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");
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
        userToUpdate.setProfileImgUrl("http://example.com/test.jpg");
        userToUpdate.setCognitoSub("cognito_sub");

        User updatedUser = new User();
        updatedUser.setUserName(null);
        updatedUser.setProfileImgUrl(null);
        updatedUser.setCognitoSub(null);

        Mockito.lenient().when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));

        ResponseEntity<ResponseMessage<UserDTO>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

}

