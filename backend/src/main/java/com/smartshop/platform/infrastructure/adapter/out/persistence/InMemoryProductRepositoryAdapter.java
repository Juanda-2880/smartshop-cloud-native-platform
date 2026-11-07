package com.smartshop.platform.infrastructure.adapter.out.persistence;

import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.port.out.ProductRepositoryPort;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryProductRepositoryAdapter implements ProductRepositoryPort {

    public static final UUID PROD_KUBE_BLADE = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1");
    public static final UUID PROD_NEURAL_WORKSTATION = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2");
    public static final UUID PROD_TITAN_KEY = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3");
    public static final UUID PROD_PACKET_SWITCH = UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4");

    private final Map<UUID, Product> storage = new ConcurrentHashMap<>();

    public InMemoryProductRepositoryAdapter() {
        Instant now = Instant.now();
        save(new Product(
                PROD_KUBE_BLADE,
                "SKU-K8S-BLADE-01",
                "SmartShop KubeBlade X1 Edge Server",
                "Compact 16-core ARM64/x86 hybrid bare-metal node pre-tuned for Kubernetes 1.34 & eBPF.",
                new BigDecimal("1499.00"),
                45,
                InMemoryCategoryRepositoryAdapter.CAT_CLOUD_HARDWARE,
                "Cloud Edge Hardware",
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
                true,
                true,
                now
        ));
        save(new Product(
                PROD_NEURAL_WORKSTATION,
                "SKU-DEV-PRO-16",
                "LinearBook Pro 16 M-Ultra Workstation",
                "64GB unified memory, 2TB NVMe Gen5 SSD, nano-texture OLED display for cloud architects.",
                new BigDecimal("2899.00"),
                20,
                InMemoryCategoryRepositoryAdapter.CAT_DEV_WORKSTATIONS,
                "Developer Workstations",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
                true,
                true,
                now
        ));
        save(new Product(
                PROD_TITAN_KEY,
                "SKU-SEC-OIDC-99",
                "Aegis FIDO2 OIDC Hardware Security Key",
                "FIPS 140-3 Level 3 certified USB-C & NFC cryptographic key with native Keycloak 26 passkey support.",
                new BigDecimal("89.00"),
                150,
                InMemoryCategoryRepositoryAdapter.CAT_SECURITY_KEYS,
                "Zero-Trust Security",
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
                false,
                true,
                now
        ));
        save(new Product(
                PROD_PACKET_SWITCH,
                "SKU-NET-10G-08",
                "PulseCore 10GbE L3 Managed Telemetry Switch",
                "8-port 10G SFP+ switch with native Prometheus OpenMetrics exporter and sFlow streaming.",
                new BigDecimal("649.00"),
                32,
                InMemoryCategoryRepositoryAdapter.CAT_OBSERVABILITY_GEAR,
                "Telemetry & Networking",
                "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80",
                true,
                true,
                now
        ));
    }

    @Override
    public List<Product> findAll() {
        return List.copyOf(storage.values());
    }

    @Override
    public List<Product> findByCategoryId(UUID categoryId) {
        return storage.values().stream()
                .filter(product -> product.categoryId().equals(categoryId))
                .toList();
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public Optional<Product> findBySku(String sku) {
        return storage.values().stream()
                .filter(product -> product.sku().equalsIgnoreCase(sku))
                .findFirst();
    }

    @Override
    public Product save(Product product) {
        storage.put(product.id(), product);
        return product;
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
