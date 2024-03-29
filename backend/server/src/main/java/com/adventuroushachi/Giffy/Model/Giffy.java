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

    @Column(name = "giffy_s3_url", nullable = false)
    private String giffyS3Url;

    @Column(name = "giffy_s3_key", nullable = false)
    private String giffyS3Key;

    @Column(name = "giffy_name")
    private String giffyName;

}
