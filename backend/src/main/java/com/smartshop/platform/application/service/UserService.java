package com.smartshop.platform.application.service;

import com.smartshop.platform.domain.exception.BusinessRuleViolationException;
import com.smartshop.platform.domain.exception.ResourceNotFoundException;
import com.smartshop.platform.domain.model.User;
import com.smartshop.platform.domain.port.in.UserUseCase;
import com.smartshop.platform.domain.port.out.BusinessMetricsPort;
import com.smartshop.platform.domain.port.out.UserRepositoryPort;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final BusinessMetricsPort businessMetricsPort;

    public UserService(UserRepositoryPort userRepositoryPort, BusinessMetricsPort businessMetricsPort) {
        this.userRepositoryPort = userRepositoryPort;
        this.businessMetricsPort = businessMetricsPort;
    }

    @Override
    public List<User> findAllUsers() {
        List<User> users = userRepositoryPort.findAll();
        long activeCount = users.stream().filter(User::active).count();
        businessMetricsPort.updateActiveUsersCount(activeCount);
        return users;
    }

    @Override
    public User findUserById(UUID id) {
        return userRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    @Override
    public User createUser(User user) {
        userRepositoryPort.findByEmail(user.email()).ifPresent(existing -> {
            throw new BusinessRuleViolationException("A user with email '" + user.email() + "' already exists");
        });
        User userToSave = new User(
                user.id() != null ? user.id() : UUID.randomUUID(),
                user.username(),
                user.email(),
                user.fullName(),
                user.role(),
                user.active(),
                user.createdAt() != null ? user.createdAt() : Instant.now()
        );
        User savedUser = userRepositoryPort.save(userToSave);
        refreshActiveUserMetric();
        return savedUser;
    }

    @Override
    public User updateUser(UUID id, User user) {
        User existing = findUserById(id);
        User updatedUser = new User(
                existing.id(),
                user.username(),
                user.email(),
                user.fullName(),
                user.role(),
                user.active(),
                existing.createdAt()
        );
        User savedUser = userRepositoryPort.save(updatedUser);
        refreshActiveUserMetric();
        return savedUser;
    }

    @Override
    public void deleteUser(UUID id) {
        if (!userRepositoryPort.existsById(id)) {
            throw new ResourceNotFoundException("User", id);
        }
        userRepositoryPort.deleteById(id);
        refreshActiveUserMetric();
    }

    private void refreshActiveUserMetric() {
        long activeCount = userRepositoryPort.findAll().stream().filter(User::active).count();
        businessMetricsPort.updateActiveUsersCount(activeCount);
    }
}

