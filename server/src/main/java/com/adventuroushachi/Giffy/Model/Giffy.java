package com.adventuroushachi.Giffy.Model;

import jakarta.persistence.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "giffies")
public class Giffy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "giffy_id")
    private Long giffyId;

    @Column(name = "collection_id", nullable = false)
    private Long collectionId;

    @Column(name = "firebase_url", nullable = false)
    private String firebaseUrl;

    @Column(name = "firebase_ref", nullable = false)
    private String firebaseRef;

    @Column(name = "giffy_name")
    private String giffyName;

    @Column(name = "likes", nullable = false)
    private int likes;

}
