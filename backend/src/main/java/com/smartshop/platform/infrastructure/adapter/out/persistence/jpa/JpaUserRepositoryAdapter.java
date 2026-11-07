package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import com.smartshop.platform.domain.model.User;
import com.smartshop.platform.domain.port.out.UserRepositoryPort;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaUserRepositoryAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository repository;

    public JpaUserRepositoryAdapter(SpringDataUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<User> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return repository.findByEmailIgnoreCase(email).map(this::toDomain);
    }

    @Override
    public User save(User user) {
        UserJpaEntity entity = new UserJpaEntity(
                user.id(),
                user.username(),
                user.email(),
                user.fullName(),
                user.role(),
                user.active(),
                user.createdAt()
        );
        return toDomain(repository.save(entity));
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return repository.existsById(id);
    }

    private User toDomain(UserJpaEntity entity) {
        return new User(
                entity.getId(),
                entity.getUsername(),
                entity.getEmail(),
                entity.getFullName(),
                entity.getRole(),
                entity.isActive(),
                entity.getCreatedAt()
        );
    }
}
