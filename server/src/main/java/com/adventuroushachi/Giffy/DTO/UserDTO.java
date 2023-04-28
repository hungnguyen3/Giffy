package com.adventuroushachi.Giffy.DTO;

import com.adventuroushachi.Giffy.Model.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Long userId;
    private String userName;
    private String profileImgUrl;

    public static UserDTO fromEntity(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUserName(user.getUserName());
        dto.setProfileImgUrl(user.getProfileImgUrl());
        return dto;
    }
}
