package com.smartshop.platform.domain.model;

import java.time.Instant;
import java.util.UUID;

public record User(
        UUID id,
        String username,
        String email,
        String fullName,
        UserRole role,
        boolean active,
        Instant createdAt
) {
}

