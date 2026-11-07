package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import com.smartshop.platform.domain.model.Category;
import com.smartshop.platform.domain.port.out.CategoryRepositoryPort;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaCategoryRepositoryAdapter implements CategoryRepositoryPort {

    private final SpringDataCategoryRepository repository;

    public JpaCategoryRepositoryAdapter(SpringDataCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Category> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Category> findBySlug(String slug) {
        return repository.findBySlugIgnoreCase(slug).map(this::toDomain);
    }

    @Override
    public Category save(Category category) {
        CategoryJpaEntity entity = new CategoryJpaEntity(
                category.id(),
                category.name(),
                category.slug(),
                category.description(),
                category.active()
        );
        return toDomain(repository.save(entity));
    }

    @Override
    public void deleteById(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID id) {
        return repository.existsById(id);
    }

    private Category toDomain(CategoryJpaEntity entity) {
        return new Category(
                entity.getId(),
                entity.getName(),
                entity.getSlug(),
                entity.getDescription(),
                entity.isActive()
        );
    }
}
