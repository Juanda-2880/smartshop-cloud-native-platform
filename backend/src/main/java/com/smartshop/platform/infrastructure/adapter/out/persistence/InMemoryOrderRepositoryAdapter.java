package com.smartshop.platform.infrastructure.adapter.out.persistence;

import com.smartshop.platform.domain.model.Order;
import com.smartshop.platform.domain.model.OrderItem;
import com.smartshop.platform.domain.model.OrderStatus;
import com.smartshop.platform.domain.port.out.OrderRepositoryPort;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryOrderRepositoryAdapter implements OrderRepositoryPort {

    public static final UUID DEFAULT_ORDER_ID = UUID.fromString("dddddddd-dddd-dddd-dddd-ddddddddddd1");

    private final Map<UUID, Order> storage = new ConcurrentHashMap<>();

    public InMemoryOrderRepositoryAdapter() {
        OrderItem sampleItem = new OrderItem(
                InMemoryProductRepositoryAdapter.PROD_KUBE_BLADE,
                "SmartShop KubeBlade X1 Edge Server",
                "SKU-K8S-BLADE-01",
                new BigDecimal("1499.00"),
                1,
                new BigDecimal("1499.00")
        );
        save(new Order(
                DEFAULT_ORDER_ID,
                "ORD-K8S00001",
                InMemoryUserRepositoryAdapter.DEFAULT_CUSTOMER_ID,
                List.of(sampleItem),
                new BigDecimal("1499.00"),
                OrderStatus.DELIVERED,
                "742 Cloud Native Blvd, Suite 400, San Francisco, CA",
                Instant.now()
        ));
    }

    @Override
    public List<Order> findAll() {
        return List.copyOf(storage.values());
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public List<Order> findByUserId(UUID userId) {
        return storage.values().stream()
                .filter(order -> order.userId().equals(userId))
                .toList();
    }

    @Override
    public Order save(Order order) {
        storage.put(order.id(), order);
        return order;
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

