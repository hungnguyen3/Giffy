package com.adventuroushachi.Giffy.Repository;

import com.adventuroushachi.Giffy.Model.CollectionUserRelationship;
import com.adventuroushachi.Giffy.Model.CollectionUserRelationshipId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionUserRelationshipRepository extends JpaRepository<CollectionUserRelationship, CollectionUserRelationshipId> {

    List<CollectionUserRelationship> findByIdUserId(Long userId);

}
