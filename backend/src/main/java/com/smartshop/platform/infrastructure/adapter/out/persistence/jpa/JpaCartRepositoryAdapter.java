package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import com.smartshop.platform.domain.model.Cart;
import com.smartshop.platform.domain.model.CartItem;
import com.smartshop.platform.domain.port.out.CartRepositoryPort;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaCartRepositoryAdapter implements CartRepositoryPort {

    private final SpringDataCartRepository repository;

    public JpaCartRepositoryAdapter(SpringDataCartRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Cart> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Cart> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Cart> findByUserId(UUID userId) {
        return repository.findByUserId(userId).map(this::toDomain);
    }

    @Override
    public Cart save(Cart cart) {
        List<CartItemJpaEntity> itemEntities = cart.items().stream()
                .map(item -> new CartItemJpaEntity(
                        UUID.randomUUID(),
                        item.productId(),
                        item.productName(),
                        item.sku(),
                        item.unitPrice(),
                        item.quantity(),
                        item.subtotal()
                ))
                .toList();
        CartJpaEntity entity = new CartJpaEntity(
                cart.id(),
                cart.userId(),
                itemEntities,
                cart.totalAmount(),
                cart.updatedAt()
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

    private Cart toDomain(CartJpaEntity entity) {
        List<CartItem> items = entity.getItems().stream()
                .map(item -> new CartItem(
                        item.getProductId(),
                        item.getProductName(),
                        item.getSku(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .toList();
        return new Cart(
                entity.getId(),
                entity.getUserId(),
                items,
                entity.getTotalAmount(),
                entity.getUpdatedAt()
        );
    }
}

