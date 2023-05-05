package com.adventuroushachi.Giffy.DTO;

import java.util.Objects;

import com.adventuroushachi.Giffy.Model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Long userId;
    private String userName;
    private String userEmail;
    private String profileImgUrl;

    public static UserDTO fromEntity(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUserName(user.getUserName());
        dto.setUserEmail(user.getUserEmail());
        dto.setProfileImgUrl(user.getProfileImgUrl());
        return dto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDTO that = (UserDTO) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(userName, that.userName) &&
                Objects.equals(userEmail, that.userEmail) &&
                Objects.equals(profileImgUrl, that.profileImgUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, userName, userEmail, profileImgUrl);
    }
}
