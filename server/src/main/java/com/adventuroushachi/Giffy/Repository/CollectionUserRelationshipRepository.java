package com.adventuroushachi.Giffy.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.CollectionUserId;
import com.adventuroushachi.Giffy.Model.User;

public interface CollectionUserRelationshipRepository extends JpaRepository<CollectionUserRelationship, CollectionUserId> {

    List<CollectionUserRelationship> findByIdUserId(Long userId);
    CollectionUserRelationship findByCollectionAndUser(Collection collection, User user);

}
