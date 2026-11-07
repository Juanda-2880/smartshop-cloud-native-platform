package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import com.smartshop.platform.domain.model.Order;
import com.smartshop.platform.domain.model.OrderItem;
import com.smartshop.platform.domain.port.out.OrderRepositoryPort;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaOrderRepositoryAdapter implements OrderRepositoryPort {

    private final SpringDataOrderRepository repository;

    public JpaOrderRepositoryAdapter(SpringDataOrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Order> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Order> findByUserId(UUID userId) {
        return repository.findByUserId(userId).stream().map(this::toDomain).toList();
    }

    @Override
    public Order save(Order order) {
        List<OrderItemJpaEntity> itemEntities = order.items().stream()
                .map(item -> new OrderItemJpaEntity(
                        UUID.randomUUID(),
                        item.productId(),
                        item.productName(),
                        item.sku(),
                        item.unitPrice(),
                        item.quantity(),
                        item.subtotal()
                ))
                .toList();
        OrderJpaEntity entity = new OrderJpaEntity(
                order.id(),
                order.orderNumber(),
                order.userId(),
                itemEntities,
                order.totalAmount(),
                order.status(),
                order.shippingAddress(),
                order.createdAt()
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

    private Order toDomain(OrderJpaEntity entity) {
        List<OrderItem> items = entity.getItems().stream()
                .map(item -> new OrderItem(
                        item.getProductId(),
                        item.getProductName(),
                        item.getSku(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .toList();
        return new Order(
                entity.getId(),
                entity.getOrderNumber(),
                entity.getUserId(),
                items,
                entity.getTotalAmount(),
                entity.getStatus(),
                entity.getShippingAddress(),
                entity.getCreatedAt()
        );
    }
}

