package com.smartshop.platform.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record Order(
        UUID id,
        String orderNumber,
        UUID userId,
        List<OrderItem> items,
        BigDecimal totalAmount,
        OrderStatus status,
        String shippingAddress,
        Instant createdAt
) {
}

