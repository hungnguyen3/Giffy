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
        user.setProfileImgUrl("http://example.com/test.jpg");
        user.setCognitoSub("cognito_sub");

        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(user);

        ResponseEntity<ResponseMessage<User>> response = userController.createUser(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(user, response.getBody().getData());
    }

    @Test
    public void testCreateUserWithInvalidData() {
        User user = new User();

        ResponseEntity<ResponseMessage<User>> response = userController.createUser(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
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

        ResponseEntity<ResponseMessage<User>> response = userController.getUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(user, response.getBody().getData());
    }

    @Test
    public void testGetUserByIdNotFound() {
        Long userId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<User>> response = userController.getUserById(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testUpdateUserById() {
        Long userId = 1L;
        User userToUpdate = new User();
        userToUpdate.setUserName("Test User");
        userToUpdate.setProfileImgUrl("http://example.com/test.jpg");
        userToUpdate.setCognitoSub("cognito_sub");

        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");
        updatedUser.setCognitoSub("updated_cognito_sub");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(updatedUser);

        ResponseEntity<ResponseMessage<User>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ResponseMessageStatus.SUCCESS.getStatus(), response.getBody().getStatus());
        assertEquals(updatedUser, response.getBody().getData());
    }

    @Test
    public void testUpdateUserByIdNotFound() {
        Long userId = 1L;
        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");
        updatedUser.setCognitoSub("updated_cognito_sub");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<ResponseMessage<User>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testCreateUserWithNullFields() {
        User user = new User();
        user.setUserName(null);
        user.setProfileImgUrl(null);
        user.setCognitoSub(null);

        ResponseEntity<ResponseMessage<User>> response = userController.createUser(user);

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
        ResponseEntity<ResponseMessage<User>> response = userController.getUserById(null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

    @Test
    public void testUpdateUserByIdWithNullId() {
        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");
        updatedUser.setCognitoSub("updated_cognito_sub");

        ResponseEntity<ResponseMessage<User>> response = userController.updateUserById(null, updatedUser);

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

        ResponseEntity<ResponseMessage<User>> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(ResponseMessageStatus.ERROR.getStatus(), response.getBody().getStatus());
    }

}

