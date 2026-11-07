package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataOrderRepository extends JpaRepository<OrderJpaEntity, UUID> {

    List<OrderJpaEntity> findByUserId(UUID userId);
}
