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

        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(user);

        ResponseEntity<User> response = userController.createUser(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    public void testCreateUserWithInvalidData() {
        User user = new User();

        ResponseEntity<User> response = userController.createUser(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testDeleteUserById() {
        Long userId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));

        ResponseEntity<?> response = userController.deleteUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testDeleteUserByIdNotFound() {
        Long userId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<?> response = userController.deleteUserById(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testGetUserById() {
        Long userId = 1L;
        User user = new User();
        user.setUserName("Test User");
        user.setProfileImgUrl("http://example.com/test.jpg");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ResponseEntity<User> response = userController.getUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    public void testGetUserByIdNotFound() {
        Long userId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<User> response = userController.getUserById(userId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testUpdateUserById() {
        Long userId = 1L;
        User userToUpdate = new User();
        userToUpdate.setUserName("Test User");
        userToUpdate.setProfileImgUrl("http://example.com/test.jpg");

        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(userToUpdate));
        Mockito.when(userRepository.save(Mockito.any(User.class))).thenReturn(updatedUser);

        ResponseEntity<User> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedUser, response.getBody());
    }

    @Test
    public void testUpdateUserByIdNotFound() {
        Long userId = 1L;
        User updatedUser = new User();
        updatedUser.setUserName("Updated User");
        updatedUser.setProfileImgUrl("http://example.com/updated.jpg");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ResponseEntity<User> response = userController.updateUserById(userId, updatedUser);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

}
