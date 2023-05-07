package com.adventuroushachi.Giffy.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.adventuroushachi.Giffy.Model.Collection;
import com.adventuroushachi.Giffy.Model.CollectionUserId;
import com.adventuroushachi.Giffy.Model.CollectionUserInteraction;
import com.adventuroushachi.Giffy.Model.User;

public interface CollectionUserInteractionRepository extends JpaRepository<CollectionUserInteraction, CollectionUserId> {

    CollectionUserInteraction findByCollectionAndUser(Collection collection, User user);

}
