package com.smartshop.platform.infrastructure.adapter.out.persistence;

import com.smartshop.platform.domain.model.Category;
import com.smartshop.platform.domain.port.out.CategoryRepositoryPort;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryCategoryRepositoryAdapter implements CategoryRepositoryPort {

    public static final UUID CAT_CLOUD_HARDWARE = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1");
    public static final UUID CAT_DEV_WORKSTATIONS = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2");
    public static final UUID CAT_SECURITY_KEYS = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3");
    public static final UUID CAT_OBSERVABILITY_GEAR = UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4");

    private final Map<UUID, Category> storage = new ConcurrentHashMap<>();

    public InMemoryCategoryRepositoryAdapter() {
        save(new Category(CAT_CLOUD_HARDWARE, "Cloud Edge Hardware", "cloud-edge-hardware", "High-density compute nodes and edge appliances for Kubernetes clusters", true));
        save(new Category(CAT_DEV_WORKSTATIONS, "Developer Workstations", "developer-workstations", "Ultra-fast engineering laptops, mechanical keyboards, and 5K displays", true));
        save(new Category(CAT_SECURITY_KEYS, "Zero-Trust Security", "zero-trust-security", "FIDO2 hardware tokens and biometric authentication modules", true));
        save(new Category(CAT_OBSERVABILITY_GEAR, "Telemetry & Networking", "telemetry-networking", "10GbE managed switches and hardware telemetry sensors", true));
    }

    @Override
    public List<Category> findAll() {
        return List.copyOf(storage.values());
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public Optional<Category> findBySlug(String slug) {
        return storage.values().stream()
                .filter(cat -> cat.slug().equalsIgnoreCase(slug))
                .findFirst();
    }

    @Override
    public Category save(Category category) {
        storage.put(category.id(), category);
        return category;
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

