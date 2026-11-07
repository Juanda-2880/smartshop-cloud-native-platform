package com.smartshop.platform.infrastructure.adapter.out.persistence;

import com.smartshop.platform.domain.model.User;
import com.smartshop.platform.domain.model.UserRole;
import com.smartshop.platform.domain.port.out.UserRepositoryPort;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryUserRepositoryAdapter implements UserRepositoryPort {

    public static final UUID DEFAULT_ADMIN_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    public static final UUID DEFAULT_MANAGER_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    public static final UUID DEFAULT_CUSTOMER_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");

    private final Map<UUID, User> storage = new ConcurrentHashMap<>();

    public InMemoryUserRepositoryAdapter() {
        Instant now = Instant.now();
        save(new User(DEFAULT_ADMIN_ID, "admin.smartshop", "admin@smartshop.io", "Elena Vance (Platform Admin)", UserRole.ADMIN, true, now));
        save(new User(DEFAULT_MANAGER_ID, "manager.smartshop", "manager@smartshop.io", "Marcus Sterling (Catalog Manager)", UserRole.MANAGER, true, now));
        save(new User(DEFAULT_CUSTOMER_ID, "customer.smartshop", "customer@smartshop.io", "Sofia Chen (Enterprise Customer)", UserRole.CUSTOMER, true, now));
    }

    @Override
    public List<User> findAll() {
        return List.copyOf(storage.values());
    }

    @Override
    public Optional<User> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return storage.values().stream()
                .filter(user -> user.email().equalsIgnoreCase(email))
                .findFirst();
    }

    @Override
    public User save(User user) {
        storage.put(user.id(), user);
        return user;
    }

    @Override
    public void deleteById(UUID id) {
        storage.remove(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return storage.containsKey(id);
    }
}
