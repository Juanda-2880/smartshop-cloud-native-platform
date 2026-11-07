package com.smartshop.platform.infrastructure.adapter.in.web.dto;

import com.smartshop.platform.domain.model.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Payload for updating the status of an order")
public record OrderStatusUpdateDto(
        @NotNull(message = "Order status is required")
        @Schema(example = "SHIPPED")
        OrderStatus status
) {
}

