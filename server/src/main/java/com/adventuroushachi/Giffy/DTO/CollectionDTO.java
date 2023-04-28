
package com.adventuroushachi.Giffy.DTO;

import com.adventuroushachi.Giffy.Model.Collection;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CollectionDTO {
    private Long collectionId;
    private String collectionName;
    private Boolean isPrivate;

    public static CollectionDTO fromEntity(Collection user) {
        CollectionDTO dto = new CollectionDTO();
        dto.setCollectionId(user.getCollectionId());
        dto.setCollectionName(user.getCollectionName());
        dto.setIsPrivate(user.getIsPrivate());
        return dto;
    }
}
