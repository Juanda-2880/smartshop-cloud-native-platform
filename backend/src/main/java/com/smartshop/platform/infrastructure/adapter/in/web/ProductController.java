package com.smartshop.platform.infrastructure.adapter.in.web;

import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.port.in.ProductUseCase;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.ProductRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.mapper.WebDtoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Products", description = "CRUD operations for catalog products")
public class ProductController {

    private final ProductUseCase productUseCase;
    private final WebDtoMapper webDtoMapper;

    public ProductController(ProductUseCase productUseCase, WebDtoMapper webDtoMapper) {
        this.productUseCase = productUseCase;
        this.webDtoMapper = webDtoMapper;
    }

    @GetMapping
    @Operation(summary = "List products", description = "Retrieves all products or filters by categoryId")
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) UUID categoryId
    ) {
        if (categoryId != null) {
            return ResponseEntity.ok(productUseCase.findProductsByCategoryId(categoryId));
        }
        return ResponseEntity.ok(productUseCase.findAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieves a product by UUID and increments visit telemetry")
    public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productUseCase.findProductById(id));
    }

    @PostMapping
    @Operation(summary = "Create product", description = "Creates a new product in the catalog")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequestDto requestDto) {
        Product created = productUseCase.createProduct(webDtoMapper.toDomain(requestDto));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Updates an existing product by UUID")
    public ResponseEntity<Product> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequestDto requestDto
    ) {
        Product updated = productUseCase.updateProduct(id, webDtoMapper.toDomain(requestDto));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Deletes an existing product by UUID")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productUseCase.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
