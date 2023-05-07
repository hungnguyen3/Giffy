package com.adventuroushachi.Giffy.DTO;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

    public static List<CollectionDTO> fromEntities(List<Collection> collections) {
        return collections.stream()
                .map(CollectionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CollectionDTO that = (CollectionDTO) o;
        return Objects.equals(collectionId, that.collectionId) &&
                Objects.equals(collectionName, that.collectionName) &&
                Objects.equals(isPrivate, that.isPrivate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(collectionId, collectionName, isPrivate);
    }
}
