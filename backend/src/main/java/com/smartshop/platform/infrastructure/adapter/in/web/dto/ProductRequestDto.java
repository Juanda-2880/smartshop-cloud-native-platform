package com.smartshop.platform.infrastructure.adapter.in.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

@Schema(description = "Payload for creating or updating a catalog product")
public record ProductRequestDto(
        @NotBlank(message = "SKU is required")
        @Schema(example = "SKU-NVME-ARRAY-01")
        String sku,

        @NotBlank(message = "Product name is required")
        @Schema(example = "HyperVault NVMe Gen5 Storage Node")
        String name,

        @NotBlank(message = "Description is required")
        @Schema(example = "Enterprise storage blade for PostgreSQL 17 and StatefulSets")
        String description,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        @Schema(example = "1999.00")
        BigDecimal price,

        @Min(value = 0, message = "Stock quantity cannot be negative")
        @Schema(example = "25")
        int stockQuantity,

        @NotNull(message = "Category ID is required")
        @Schema(example = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1")
        UUID categoryId,

        @NotBlank(message = "Image URL is required")
        @Schema(example = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80")
        String imageUrl,

        @Schema(example = "true")
        boolean featured,

        @Schema(example = "true")
        boolean active
) {
}
