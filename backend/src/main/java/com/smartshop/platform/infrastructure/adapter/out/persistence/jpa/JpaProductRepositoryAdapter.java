package com.smartshop.platform.infrastructure.adapter.out.persistence.jpa;

import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.port.out.ProductRepositoryPort;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaProductRepositoryAdapter implements ProductRepositoryPort {

    private final SpringDataProductRepository repository;

    public JpaProductRepositoryAdapter(SpringDataProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Product> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public List<Product> findByCategoryId(UUID categoryId) {
        return repository.findByCategoryId(categoryId).stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Product> findBySku(String sku) {
        return repository.findBySkuIgnoreCase(sku).map(this::toDomain);
    }

    @Override
    public Product save(Product product) {
        ProductJpaEntity entity = new ProductJpaEntity(
                product.id(),
                product.sku(),
                product.name(),
                product.description(),
                product.price(),
                product.stockQuantity(),
                product.categoryId(),
                product.categoryName(),
                product.imageUrl(),
                product.featured(),
                product.active(),
                product.createdAt()
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

    private Product toDomain(ProductJpaEntity entity) {
        return new Product(
                entity.getId(),
                entity.getSku(),
                entity.getName(),
                entity.getDescription(),
                entity.getPrice(),
                entity.getStockQuantity(),
                entity.getCategoryId(),
                entity.getCategoryName(),
                entity.getImageUrl(),
                entity.isFeatured(),
                entity.isActive(),
                entity.getCreatedAt()
        );
    }
}

