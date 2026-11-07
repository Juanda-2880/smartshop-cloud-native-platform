package com.smartshop.platform.application.service;

import com.smartshop.platform.domain.exception.BusinessRuleViolationException;
import com.smartshop.platform.domain.exception.ResourceNotFoundException;
import com.smartshop.platform.domain.model.Category;
import com.smartshop.platform.domain.port.in.CategoryUseCase;
import com.smartshop.platform.domain.port.out.CategoryRepositoryPort;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class CategoryService implements CategoryUseCase {

    private final CategoryRepositoryPort categoryRepositoryPort;

    public CategoryService(CategoryRepositoryPort categoryRepositoryPort) {
        this.categoryRepositoryPort = categoryRepositoryPort;
    }

    @Override
    public List<Category> findAllCategories() {
        return categoryRepositoryPort.findAll();
    }

    @Override
    public Category findCategoryById(UUID id) {
        return categoryRepositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }

    @Override
    public Category createCategory(Category category) {
        categoryRepositoryPort.findBySlug(category.slug()).ifPresent(existing -> {
            throw new BusinessRuleViolationException("Category with slug '" + category.slug() + "' already exists");
        });
        Category categoryToSave = new Category(
                category.id() != null ? category.id() : UUID.randomUUID(),
                category.name(),
                category.slug(),
                category.description(),
                category.active()
        );
        return categoryRepositoryPort.save(categoryToSave);
    }

    @Override
    public Category updateCategory(UUID id, Category category) {
        Category existing = findCategoryById(id);
        Category updatedCategory = new Category(
                existing.id(),
                category.name(),
                category.slug(),
                category.description(),
                category.active()
        );
        return categoryRepositoryPort.save(updatedCategory);
    }

    @Override
    public void deleteCategory(UUID id) {
        if (!categoryRepositoryPort.existsById(id)) {
            throw new ResourceNotFoundException("Category", id);
        }
        categoryRepositoryPort.deleteById(id);
    }
}

