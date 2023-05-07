package com.adventuroushachi.Giffy.Model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "collection_user_relationships")
@Data
@NoArgsConstructor
public class CollectionUserRelationship {

    @EmbeddedId
    private CollectionUserId id;

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
        this.id = new CollectionUserId(collection.getCollectionId(), user.getUserId());
    }

}
