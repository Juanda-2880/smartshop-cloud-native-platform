package com.smartshop.platform.infrastructure.adapter.in.web;

import com.smartshop.platform.domain.model.Order;
import com.smartshop.platform.domain.port.in.OrderUseCase;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.CheckoutRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.OrderRequestDto;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.OrderStatusUpdateDto;
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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders", description = "CRUD and checkout operations for customer orders")
public class OrderController {

    private final OrderUseCase orderUseCase;
    private final WebDtoMapper webDtoMapper;

    public OrderController(OrderUseCase orderUseCase, WebDtoMapper webDtoMapper) {
        this.orderUseCase = orderUseCase;
        this.webDtoMapper = webDtoMapper;
    }

    @GetMapping
    @Operation(summary = "List orders", description = "Retrieves all orders or filters by userId")
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam(required = false) UUID userId) {
        if (userId != null) {
            return ResponseEntity.ok(orderUseCase.findOrdersByUserId(userId));
        }
        return ResponseEntity.ok(orderUseCase.findAllOrders());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves a customer order by UUID")
    public ResponseEntity<Order> getOrderById(@PathVariable UUID id) {
        return ResponseEntity.ok(orderUseCase.findOrderById(id));
    }

    @PostMapping
    @Operation(summary = "Create direct order", description = "Creates a new order and decrements product stock")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequestDto requestDto) {
        Order created = orderUseCase.createOrder(webDtoMapper.toDomain(requestDto));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/checkout/{userId}")
    @Operation(summary = "Checkout user cart", description = "Converts a user's active cart into a paid order and clears the cart")
    public ResponseEntity<Order> checkoutFromCart(
            @PathVariable UUID userId,
            @Valid @RequestBody CheckoutRequestDto requestDto
    ) {
        Order created = orderUseCase.checkoutFromUserCart(userId, requestDto.shippingAddress());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status", description = "Updates the lifecycle status of an order")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody OrderStatusUpdateDto requestDto
    ) {
        return ResponseEntity.ok(orderUseCase.updateOrderStatus(id, requestDto.status()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", description = "Deletes an order by UUID")
    public ResponseEntity<Void> deleteOrder(@PathVariable UUID id) {
        orderUseCase.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}

