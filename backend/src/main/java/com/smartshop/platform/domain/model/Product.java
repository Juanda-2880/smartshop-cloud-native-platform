package com.smartshop.platform.domain.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record Product(
        UUID id,
        String sku,
        String name,
        String description,
        BigDecimal price,
        int stockQuantity,
        UUID categoryId,
        String categoryName,
        String imageUrl,
        boolean featured,
        boolean active,
        Instant createdAt
) {
}

