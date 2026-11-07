package com.smartshop.platform.domain.port.out;

import com.smartshop.platform.domain.model.Product;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepositoryPort {

    List<Product> findAll();

    List<Product> findByCategoryId(UUID categoryId);

    Optional<Product> findById(UUID id);

    Optional<Product> findBySku(String sku);

    Product save(Product product);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}

