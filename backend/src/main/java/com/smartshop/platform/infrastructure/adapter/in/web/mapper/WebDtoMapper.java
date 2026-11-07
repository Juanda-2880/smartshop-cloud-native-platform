package com.smartshop.platform.infrastructure.adapter.in.web.mapper;

import com.smartshop.platform.domain.model.Category;
import com.smartshop.platform.domain.model.Order;
import com.smartshop.platform.domain.model.OrderItem;
import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.model.User;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.CartItemRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.CategoryRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.OrderRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.ProductRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.UserRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WebDtoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    User toDomain(UserRequestDto dto);

    @Mapping(target = "id", ignore = true)
    Category toDomain(CategoryRequestDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoryName", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Product toDomain(ProductRequestDto dto);

    @Mapping(target = "productName", ignore = true)
    @Mapping(target = "sku", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    OrderItem toOrderItem(CartItemRequestDto dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderNumber", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Order toDomain(OrderRequestDto dto);
}
