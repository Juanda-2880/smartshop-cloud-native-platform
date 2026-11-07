package com.smartshop.platform.application.service;

import com.smartshop.platform.domain.exception.BusinessRuleViolationException;
import com.smartshop.platform.domain.exception.ResourceNotFoundException;
import com.smartshop.platform.domain.model.Cart;
import com.smartshop.platform.domain.model.Order;
import com.smartshop.platform.domain.model.OrderItem;
import com.smartshop.platform.domain.model.OrderStatus;
import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.port.in.CartUseCase;
import com.smartshop.platform.domain.port.in.OrderUseCase;
import com.smartshop.platform.domain.port.out.BusinessMetricsPort;
import com.smartshop.platform.domain.port.out.OrderRepositoryPort;
import com.smartshop.platform.domain.port.out.ProductRepositoryPort;
import com.smartshop.platform.domain.port.out.UserRepositoryPort;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class OrderService implements OrderUseCase {

    private final OrderRepositoryPort orderRepositoryPort;
    private final ProductRepositoryPort productRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;
    private final CartUseCase cartUseCase;
    private final BusinessMetricsPort businessMetricsPort;

    public OrderService(
            OrderRepositoryPort orderRepositoryPort,
            ProductRepositoryPort productRepositoryPort,
            UserRepositoryPort userRepositoryPort,
            CartUseCase cartUseCase,
            BusinessMetricsPort businessMetricsPort
    ) {
        this.orderRepositoryPort = orderRepositoryPort;
        this.productRepositoryPort = productRepositoryPort;
        this.userRepositoryPort = userRepositoryPort;
        this.cartUseCase = cartUseCase;
        this.businessMetricsPort = businessMetricsPort;
    }

    @Override
    public List<Order> findAllOrders() {
        return orderRepositoryPort.findAll();
    }

    @Override
    public Order findOrderById(UUID id) {
        return orderRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    @Override
    public List<Order> findOrdersByUserId(UUID userId) {
        return orderRepositoryPort.findByUserId(userId);
    }

    @Override
    public Order createOrder(Order order) {
        if (!userRepositoryPort.existsById(order.userId())) {
            throw new ResourceNotFoundException("User", order.userId());
        }
        if (order.items() == null || order.items().isEmpty()) {
            throw new BusinessRuleViolationException("Order must contain at least one item");
        }

        List<OrderItem> enrichedItems = order.items().stream().map(item -> {
            Product product = productRepositoryPort.findById(item.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", item.productId()));
            if (product.stockQuantity() < item.quantity()) {
                throw new BusinessRuleViolationException("Insufficient stock for product '" + product.name() + "'");
            }
            Product decremented = new Product(
                    product.id(),
                    product.sku(),
                    product.name(),
                    product.description(),
                    product.price(),
                    product.stockQuantity() - item.quantity(),
                    product.categoryId(),
                    product.categoryName(),
                    product.imageUrl(),
                    product.featured(),
                    product.active(),
                    product.createdAt()
            );
            productRepositoryPort.save(decremented);
            BigDecimal subtotal = product.price().multiply(BigDecimal.valueOf(item.quantity()));
            return new OrderItem(
                    product.id(),
                    product.name(),
                    product.sku(),
                    product.price(),
                    item.quantity(),
                    subtotal
            );
        }).toList();

        BigDecimal totalAmount = enrichedItems.stream()
                .map(OrderItem::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order orderToSave = new Order(
                order.id() != null ? order.id() : UUID.randomUUID(),
                order.orderNumber() != null ? order.orderNumber() : generateOrderNumber(),
                order.userId(),
                enrichedItems,
                totalAmount,
                order.status() != null ? order.status() : OrderStatus.PAID,
                order.shippingAddress(),
                order.createdAt() != null ? order.createdAt() : Instant.now()
        );
        Order savedOrder = orderRepositoryPort.save(orderToSave);
        businessMetricsPort.recordOrderCompleted();
        return savedOrder;
    }

    @Override
    public Order checkoutFromUserCart(UUID userId, String shippingAddress) {
        Cart cart = cartUseCase.findOrCreateCartByUserId(userId);
        if (cart.items().isEmpty()) {
            throw new BusinessRuleViolationException("Cannot checkout an empty cart");
        }
        List<OrderItem> orderItems = cart.items().stream()
                .map(item -> new OrderItem(
                        item.productId(),
                        item.productName(),
                        item.sku(),
                        item.unitPrice(),
                        item.quantity(),
                        item.subtotal()
                ))
                .toList();

        Order createdOrder = createOrder(new Order(
                UUID.randomUUID(),
                generateOrderNumber(),
                userId,
                orderItems,
                cart.totalAmount(),
                OrderStatus.PAID,
                shippingAddress,
                Instant.now()
        ));
        cartUseCase.clearCart(userId);
        return createdOrder;
    }

    @Override
    public Order updateOrderStatus(UUID id, OrderStatus status) {
        Order existing = findOrderById(id);
        Order updated = new Order(
                existing.id(),
                existing.orderNumber(),
                existing.userId(),
                existing.items(),
                existing.totalAmount(),
                status,
                existing.shippingAddress(),
                existing.createdAt()
        );
        return orderRepositoryPort.save(updated);
    }

    @Override
    public void deleteOrder(UUID id) {
        if (!orderRepositoryPort.existsById(id)) {
            throw new ResourceNotFoundException("Order", id);
        }
        orderRepositoryPort.deleteById(id);
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
