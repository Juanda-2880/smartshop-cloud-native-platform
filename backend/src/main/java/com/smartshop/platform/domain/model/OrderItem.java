package com.smartshop.platform.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItem(
        UUID productId,
        String productName,
        String sku,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal subtotal
) {
}
