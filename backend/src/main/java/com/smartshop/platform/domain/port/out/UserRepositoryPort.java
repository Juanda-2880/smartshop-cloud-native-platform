package com.smartshop.platform.domain.port.out;

import com.smartshop.platform.domain.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryPort {

    List<User> findAll();

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    User save(User user);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}
