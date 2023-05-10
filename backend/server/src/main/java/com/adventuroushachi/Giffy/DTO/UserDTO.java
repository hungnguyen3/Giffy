package com.adventuroushachi.Giffy.DTO;

import java.util.Objects;

import com.adventuroushachi.Giffy.Model.User;
import com.adventuroushachi.Giffy.Service.S3Service;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Long userId;
    private String userName;
    private String userEmail;
    private String profileImgS3Url;
    private String profileImgS3Key;

    public static UserDTO fromEntity(User user, S3Service s3Service) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUserName(user.getUserName());
        dto.setUserEmail(user.getUserEmail());

        if (user.getProfileImgS3Key() != null) {
            dto.setProfileImgS3Key(user.getProfileImgS3Key());
            dto.setProfileImgS3Url(s3Service.generatePresignedUrl(user.getProfileImgS3Key()).toString());
        }

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
                Objects.equals(profileImgS3Url, that.profileImgS3Url) &&
                Objects.equals(profileImgS3Key, that.profileImgS3Key);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, userName, userEmail, profileImgS3Url, profileImgS3Url);
    }
}
