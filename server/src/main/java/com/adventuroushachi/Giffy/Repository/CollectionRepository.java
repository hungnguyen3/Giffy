package com.adventuroushachi.Giffy.Repository;

import com.adventuroushachi.Giffy.Model.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByIsPrivateFalse();
}
