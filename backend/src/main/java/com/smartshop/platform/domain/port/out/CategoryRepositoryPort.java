package com.smartshop.platform.domain.port.out;

import com.smartshop.platform.domain.model.Category;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepositoryPort {

    List<Category> findAll();

    Optional<Category> findById(UUID id);

    Optional<Category> findBySlug(String slug);

    Category save(Category category);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}

