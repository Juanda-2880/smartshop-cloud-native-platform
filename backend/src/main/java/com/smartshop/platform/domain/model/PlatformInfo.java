package com.smartshop.platform.domain.model;

import java.time.Instant;

public record PlatformInfo(
        String applicationName,
        String version,
        String architecture,
        String status,
        Instant timestamp
) {
}

