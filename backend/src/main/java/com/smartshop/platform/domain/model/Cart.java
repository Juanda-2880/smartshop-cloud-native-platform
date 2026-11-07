package com.smartshop.platform.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record Cart(
        UUID id,
        UUID userId,
        List<CartItem> items,
        BigDecimal totalAmount,
        Instant updatedAt
) {
}

