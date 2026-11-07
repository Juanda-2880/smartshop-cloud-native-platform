package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataProductRepository extends JpaRepository<ProductJpaEntity, UUID> {

    List<ProductJpaEntity> findByCategoryId(UUID categoryId);

    Optional<ProductJpaEntity> findBySkuIgnoreCase(String sku);
}

