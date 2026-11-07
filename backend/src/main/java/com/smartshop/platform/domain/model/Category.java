package com.smartshop.platform.domain.model;

import java.util.UUID;

public record Category(
        UUID id,
        String name,
        String slug,
        String description,
        boolean active
) {
}

