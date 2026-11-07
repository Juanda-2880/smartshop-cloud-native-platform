package com.smartshop.platform.infrastructure.adapter.in.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Payload for creating or updating a product category")
public record CategoryRequestDto(
        @NotBlank(message = "Category name is required")
        @Schema(example = "Cloud Native Storage")
        String name,

        @NotBlank(message = "Category slug is required")
        @Schema(example = "cloud-native-storage")
        String slug,

        @NotBlank(message = "Category description is required")
        @Schema(example = "High-IOPS NVMe storage arrays for stateful Kubernetes workloads")
        String description,

        @Schema(example = "true")
        boolean active
) {
}
