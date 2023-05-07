package com.adventuroushachi.Giffy.Model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionUserId implements Serializable {

    @Column(name = "collection_id")
    private Long collectionId;

    @Column(name = "user_id")
    private Long userId;

}
