package com.smartshop.platform.application.service;

import com.smartshop.platform.domain.exception.BusinessRuleViolationException;
import com.smartshop.platform.domain.exception.ResourceNotFoundException;
import com.smartshop.platform.domain.model.Category;
import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.port.in.ProductUseCase;
import com.smartshop.platform.domain.port.out.BusinessMetricsPort;
import com.smartshop.platform.domain.port.out.CategoryRepositoryPort;
import com.smartshop.platform.domain.port.out.ProductRepositoryPort;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ProductService implements ProductUseCase {

    private final ProductRepositoryPort productRepositoryPort;
    private final CategoryRepositoryPort categoryRepositoryPort;
    private final BusinessMetricsPort businessMetricsPort;

    public ProductService(
            ProductRepositoryPort productRepositoryPort,
            CategoryRepositoryPort categoryRepositoryPort,
            BusinessMetricsPort businessMetricsPort
    ) {
        this.productRepositoryPort = productRepositoryPort;
        this.categoryRepositoryPort = categoryRepositoryPort;
        this.businessMetricsPort = businessMetricsPort;
    }

    @Override
    public List<Product> findAllProducts() {
        return productRepositoryPort.findAll();
    }

    @Override
    public List<Product> findProductsByCategoryId(UUID categoryId) {
        return productRepositoryPort.findByCategoryId(categoryId);
    }

    @Override
    public Product findProductById(UUID id) {
        Product product = productRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        businessMetricsPort.recordProductVisited();
        return product;
    }

    @Override
    public Product createProduct(Product product) {
        productRepositoryPort.findBySku(product.sku()).ifPresent(existing -> {
            throw new BusinessRuleViolationException("Product with SKU '" + product.sku() + "' already exists");
        });
        Category category = categoryRepositoryPort.findById(product.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", product.categoryId()));

        Product productToSave = new Product(
                product.id() != null ? product.id() : UUID.randomUUID(),
                product.sku(),
                product.name(),
                product.description(),
                product.price(),
                product.stockQuantity(),
                category.id(),
                category.name(),
                product.imageUrl(),
                product.featured(),
                product.active(),
                product.createdAt() != null ? product.createdAt() : Instant.now()
        );
        return productRepositoryPort.save(productToSave);
    }

    @Override
    public Product updateProduct(UUID id, Product product) {
        Product existing = productRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        Category category = categoryRepositoryPort.findById(product.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", product.categoryId()));

        Product updatedProduct = new Product(
                existing.id(),
                product.sku(),
                product.name(),
                product.description(),
                product.price(),
                product.stockQuantity(),
                category.id(),
                category.name(),
                product.imageUrl(),
                product.featured(),
                product.active(),
                existing.createdAt()
        );
        return productRepositoryPort.save(updatedProduct);
    }

    @Override
    public void deleteProduct(UUID id) {
        if (!productRepositoryPort.existsById(id)) {
            throw new ResourceNotFoundException("Product", id);
        }
        productRepositoryPort.deleteById(id);
    }
}

