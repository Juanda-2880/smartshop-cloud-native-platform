package com.smartshop.platform.infrastructure.adapter.in.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(description = "Payload for adding or updating an item in a user's shopping cart")
public record CartItemRequestDto(
        @NotNull(message = "Product ID is required")
        @Schema(example = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1")
        UUID productId,

        @Min(value = 1, message = "Quantity must be at least 1")
        @Schema(example = "2")
        int quantity
) {
}

