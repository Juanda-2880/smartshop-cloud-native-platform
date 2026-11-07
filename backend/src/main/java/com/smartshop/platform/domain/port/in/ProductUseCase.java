package com.smartshop.platform.domain.port.in;

import com.smartshop.platform.domain.model.Product;
import java.util.List;
import java.util.UUID;

public interface ProductUseCase {

    List<Product> findAllProducts();

    List<Product> findProductsByCategoryId(UUID categoryId);

    Product findProductById(UUID id);

    Product createProduct(Product product);

    Product updateProduct(UUID id, Product product);

    void deleteProduct(UUID id);
}
