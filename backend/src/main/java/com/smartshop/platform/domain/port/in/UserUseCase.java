package com.smartshop.platform.domain.port.in;

import com.smartshop.platform.domain.model.User;
import java.util.List;
import java.util.UUID;

public interface UserUseCase {

    List<User> findAllUsers();

    User findUserById(UUID id);

    User createUser(User user);

    User updateUser(UUID id, User user);

    void deleteUser(UUID id);
}
