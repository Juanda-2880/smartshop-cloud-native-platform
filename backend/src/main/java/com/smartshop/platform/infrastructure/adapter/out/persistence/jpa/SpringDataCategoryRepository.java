package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataCategoryRepository extends JpaRepository<CategoryJpaEntity, UUID> {

    Optional<CategoryJpaEntity> findBySlugIgnoreCase(String slug);
}
