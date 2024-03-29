package com.adventuroushachi.Giffy.Repository;

import com.adventuroushachi.Giffy.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByCognitoSub(String cognitoSub);
    User findByUserEmail(String cognitoSub);
}
