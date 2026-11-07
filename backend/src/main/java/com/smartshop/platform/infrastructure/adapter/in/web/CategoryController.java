package com.smartshop.platform.infrastructure.adapter.in.web;

import com.smartshop.platform.domain.model.Category;
import com.smartshop.platform.domain.port.in.CategoryUseCase;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.CategoryRequestDto;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Categories", description = "CRUD operations for product categories")
public class CategoryController {

    private final CategoryUseCase categoryUseCase;
    private final WebDtoMapper webDtoMapper;

    public CategoryController(CategoryUseCase categoryUseCase, WebDtoMapper webDtoMapper) {
        this.categoryUseCase = categoryUseCase;
        this.webDtoMapper = webDtoMapper;
    }

    @GetMapping
    @Operation(summary = "List all categories", description = "Retrieves all product categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryUseCase.findAllCategories());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieves a category by UUID")
    public ResponseEntity<Category> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryUseCase.findCategoryById(id));
    }

    @PostMapping
    @Operation(summary = "Create category", description = "Creates a new product category")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequestDto requestDto) {
        Category created = categoryUseCase.createCategory(webDtoMapper.toDomain(requestDto));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update category", description = "Updates an existing category by UUID")
    public ResponseEntity<Category> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody CategoryRequestDto requestDto
    ) {
        Category updated = categoryUseCase.updateCategory(id, webDtoMapper.toDomain(requestDto));
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete category", description = "Deletes an existing category by UUID")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryUseCase.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
