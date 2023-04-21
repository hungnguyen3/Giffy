package com.adventuroushachi.Giffy.Repository;

import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationshipId;
import com.adventuroushachi.Giffy.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionUserRelationshipRepository extends JpaRepository<CollectionUserRelationship, CollectionUserRelationshipId> {

    List<CollectionUserRelationship> findByUser(User user);

    List<CollectionUserRelationship> findByCollection(Collection collection);

    CollectionUserRelationship findByCollectionAndUser(Collection collection, User user);
}
