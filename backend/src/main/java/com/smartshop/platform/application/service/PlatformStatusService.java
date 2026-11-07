package com.smartshop.platform.application.service;

import com.smartshop.platform.domain.model.PlatformInfo;
import com.smartshop.platform.domain.port.in.GetPlatformStatusUseCase;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class PlatformStatusService implements GetPlatformStatusUseCase {

    @Override
    public PlatformInfo getPlatformStatus() {
        return new PlatformInfo(
                "smartshop-backend",
                "0.1.0",
                "Hexagonal Architecture (Ports & Adapters)",
                "UP",
                Instant.now()
        );
    }
}

