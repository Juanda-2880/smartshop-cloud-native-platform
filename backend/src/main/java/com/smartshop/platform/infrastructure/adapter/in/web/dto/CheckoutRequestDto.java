package com.smartshop.platform.infrastructure.adapter.in.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Payload for checking out a user's shopping cart into an order")
public record CheckoutRequestDto(
        @NotBlank(message = "Shipping address is required")
        @Schema(example = "742 Cloud Native Blvd, Suite 400, San Francisco, CA")
        String shippingAddress
) {
}

