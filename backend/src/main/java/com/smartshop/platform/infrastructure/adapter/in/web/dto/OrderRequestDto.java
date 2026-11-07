package com.smartshop.platform.infrastructure.adapter.in.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@Schema(description = "Payload for creating a direct order")
public record OrderRequestDto(
        @NotNull(message = "User ID is required")
        @Schema(example = "33333333-3333-3333-3333-333333333333")
        UUID userId,

        @NotEmpty(message = "Order items cannot be empty")
        @Valid
        List<CartItemRequestDto> items,

        @NotBlank(message = "Shipping address is required")
        @Schema(example = "742 Cloud Native Blvd, Suite 400, San Francisco, CA")
        String shippingAddress
) {
}

