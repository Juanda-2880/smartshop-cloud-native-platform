package com.smartshop.platform.infrastructure.adapter.in.web;

import com.smartshop.platform.domain.model.PlatformInfo;
import com.smartshop.platform.domain.port.in.GetPlatformStatusUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/status")
public class PlatformStatusController {

    private final GetPlatformStatusUseCase getPlatformStatusUseCase;

    public PlatformStatusController(GetPlatformStatusUseCase getPlatformStatusUseCase) {
        this.getPlatformStatusUseCase = getPlatformStatusUseCase;
    }

    @GetMapping
    public ResponseEntity<PlatformInfo> getStatus() {
        return ResponseEntity.ok(getPlatformStatusUseCase.getPlatformStatus());
    }
}

