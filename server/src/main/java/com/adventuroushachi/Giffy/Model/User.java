package com.adventuroushachi.Giffy.Model;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "firebase_auth_id", nullable = false, unique = true)
    private String firebaseAuthId;

    @Column(name = "profile_img_url")
    private String profileImgUrl;
}
