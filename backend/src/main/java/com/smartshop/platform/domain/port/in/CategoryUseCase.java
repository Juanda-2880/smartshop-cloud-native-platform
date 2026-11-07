package com.smartshop.platform.domain.port.in;

import com.smartshop.platform.domain.model.Category;
import java.util.List;
import java.util.UUID;

public interface CategoryUseCase {

    List<Category> findAllCategories();

    Category findCategoryById(UUID id);

    Category createCategory(Category category);

    Category updateCategory(UUID id, Category category);

    void deleteCategory(UUID id);
}
