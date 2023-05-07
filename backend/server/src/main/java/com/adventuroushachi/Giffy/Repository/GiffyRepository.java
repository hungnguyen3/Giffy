package com.adventuroushachi.Giffy.Repository;

import com.adventuroushachi.Giffy.Model.Giffy;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GiffyRepository extends JpaRepository<Giffy, Long> {

    List<Giffy> findByCollectionId(Long collectionId);

}
