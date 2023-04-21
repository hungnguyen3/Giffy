package com.adventuroushachi.Giffy.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionUserRelationshipId implements Serializable {

    @Column(name = "collection_id")
    private Long collectionId;

    @Column(name = "user_id")
    private Long userId;

}
