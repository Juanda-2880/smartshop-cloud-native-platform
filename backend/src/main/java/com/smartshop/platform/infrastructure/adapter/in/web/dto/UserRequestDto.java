package com.smartshop.platform.infrastructure.adapter.in.web.dto;

import com.smartshop.platform.domain.model.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Payload for creating or updating a platform user")
public record UserRequestDto(
        @NotBlank(message = "Username is required")
        @Schema(example = "alex.rivera")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email address")
        @Schema(example = "alex.rivera@smartshop.io")
        String email,

        @NotBlank(message = "Full name is required")
        @Schema(example = "Alex Rivera")
        String fullName,

        @NotNull(message = "User role is required")
        @Schema(example = "CUSTOMER")
        UserRole role,

        @Schema(example = "true")
        boolean active
) {
}
