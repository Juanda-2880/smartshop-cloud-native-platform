package com.smartshop.platform.application.service;

import com.smartshop.platform.domain.exception.BusinessRuleViolationException;
import com.smartshop.platform.domain.exception.ResourceNotFoundException;
import com.smartshop.platform.domain.model.Cart;
import com.smartshop.platform.domain.model.CartItem;
import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.port.in.CartUseCase;
import com.smartshop.platform.domain.port.out.BusinessMetricsPort;
import com.smartshop.platform.domain.port.out.CartRepositoryPort;
import com.smartshop.platform.domain.port.out.ProductRepositoryPort;
import com.smartshop.platform.domain.port.out.UserRepositoryPort;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CartService implements CartUseCase {

    private final CartRepositoryPort cartRepositoryPort;
    private final ProductRepositoryPort productRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;
    private final BusinessMetricsPort businessMetricsPort;

    public CartService(
            CartRepositoryPort cartRepositoryPort,
            ProductRepositoryPort productRepositoryPort,
            UserRepositoryPort userRepositoryPort,
            BusinessMetricsPort businessMetricsPort
    ) {
        this.cartRepositoryPort = cartRepositoryPort;
        this.productRepositoryPort = productRepositoryPort;
        this.userRepositoryPort = userRepositoryPort;
        this.businessMetricsPort = businessMetricsPort;
    }

    @Override
    public List<Cart> findAllCarts() {
        return cartRepositoryPort.findAll();
    }

    @Override
    public Cart findCartById(UUID id) {
        return cartRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", id));
    }

    @Override
    public Cart findOrCreateCartByUserId(UUID userId) {
        if (!userRepositoryPort.existsById(userId)) {
            throw new ResourceNotFoundException("User", userId);
        }
        return cartRepositoryPort.findByUserId(userId)
                .orElseGet(() -> cartRepositoryPort.save(new Cart(
                        UUID.randomUUID(),
                        userId,
                        List.of(),
                        BigDecimal.ZERO,
                        Instant.now()
                )));
    }

    @Override
    public Cart upsertCartItem(UUID userId, UUID productId, int quantity) {
        if (quantity <= 0) {
            throw new BusinessRuleViolationException("Item quantity must be greater than zero");
        }
        Product product = productRepositoryPort.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));
        if (product.stockQuantity() < quantity) {
            throw new BusinessRuleViolationException("Insufficient stock for product '" + product.name() + "'");
        }

        Cart existingCart = findOrCreateCartByUserId(userId);
        List<CartItem> updatedItems = new ArrayList<>(existingCart.items().stream()
                .filter(item -> !item.productId().equals(productId))
                .toList());

        BigDecimal subtotal = product.price().multiply(BigDecimal.valueOf(quantity));
        updatedItems.add(new CartItem(
                product.id(),
                product.name(),
                product.sku(),
                product.price(),
                quantity,
                subtotal
        ));

        Cart savedCart = saveRecalculatedCart(existingCart, updatedItems);
        businessMetricsPort.recordCartUpdated();
        return savedCart;
    }

    @Override
    public Cart removeCartItem(UUID userId, UUID productId) {
        Cart existingCart = findOrCreateCartByUserId(userId);
        List<CartItem> updatedItems = existingCart.items().stream()
                .filter(item -> !item.productId().equals(productId))
                .toList();
        return saveRecalculatedCart(existingCart, updatedItems);
    }

    @Override
    public Cart clearCart(UUID userId) {
        Cart existingCart = findOrCreateCartByUserId(userId);
        return saveRecalculatedCart(existingCart, List.of());
    }

    @Override
    public void deleteCart(UUID id) {
        if (!cartRepositoryPort.existsById(id)) {
            throw new ResourceNotFoundException("Cart", id);
        }
        cartRepositoryPort.deleteById(id);
    }

    private Cart saveRecalculatedCart(Cart baseCart, List<CartItem> items) {
        BigDecimal total = items.stream()
                .map(CartItem::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Cart updated = new Cart(
                baseCart.id(),
                baseCart.userId(),
                List.copyOf(items),
                total,
                Instant.now()
        );
        return cartRepositoryPort.save(updated);
    }
}

