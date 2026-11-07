package com.smartshop.platform.infrastructure.adapter.out.persistence;

import com.smartshop.platform.domain.model.Cart;
import com.smartshop.platform.domain.model.CartItem;
import com.smartshop.platform.domain.port.out.CartRepositoryPort;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryCartRepositoryAdapter implements CartRepositoryPort {

    public static final UUID DEFAULT_CART_ID = UUID.fromString("cccccccc-cccc-cccc-cccc-ccccccccccc1");

    private final Map<UUID, Cart> storage = new ConcurrentHashMap<>();

    public InMemoryCartRepositoryAdapter() {
        CartItem sampleItem = new CartItem(
                InMemoryProductRepositoryAdapter.PROD_TITAN_KEY,
                "Aegis FIDO2 OIDC Hardware Security Key",
                "SKU-SEC-OIDC-99",
                new BigDecimal("89.00"),
                2,
                new BigDecimal("178.00")
        );
        save(new Cart(
                DEFAULT_CART_ID,
                InMemoryUserRepositoryAdapter.DEFAULT_CUSTOMER_ID,
                List.of(sampleItem),
                new BigDecimal("178.00"),
                Instant.now()
        ));
    }

    @Override
    public List<Cart> findAll() {
        return List.copyOf(storage.values());
    }

    @Override
    public Optional<Cart> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public Optional<Cart> findByUserId(UUID userId) {
        return storage.values().stream()
                .filter(cart -> cart.userId().equals(userId))
                .findFirst();
    }

    @Override
    public Cart save(Cart cart) {
        storage.put(cart.id(), cart);
        return cart;
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
