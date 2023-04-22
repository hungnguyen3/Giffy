package com.adventuroushachi.Giffy.Model;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "collection_user_relationships")
@Data
@NoArgsConstructor
public class CollectionUserRelationship {

    @EmbeddedId
    private CollectionUserRelationshipId id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @MapsId("collection_id")
    @JoinColumn(name = "collection_id")
    private Collection collection;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @MapsId("user_id")
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "permission", nullable = false)
    private Permission permission;

    public CollectionUserRelationship(Collection collection, User user, Permission permission) {
        this.collection = collection;
        this.user = user;
        this.permission = permission;
        this.id = new CollectionUserRelationshipId(collection.getCollectionId(), user.getUserId());
    }
}
