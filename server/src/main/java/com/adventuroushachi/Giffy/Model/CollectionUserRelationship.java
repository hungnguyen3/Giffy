package com.adventuroushachi.Giffy.Model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("collection_id")
    @JoinColumn(name = "collection_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Collection collection;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("user_id")
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
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
