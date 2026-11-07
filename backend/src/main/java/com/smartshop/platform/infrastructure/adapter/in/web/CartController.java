package com.smartshop.platform.infrastructure.adapter.in.web;

import com.smartshop.platform.domain.model.Cart;
import com.smartshop.platform.domain.port.in.CartUseCase;
import com.smartshop.platform.infrastructure.adapter.in.web.dto.CartItemRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/carts")
@Tag(name = "Carts", description = "Shopping cart management operations")
public class CartController {

    private final CartUseCase cartUseCase;

    public CartController(CartUseCase cartUseCase) {
        this.cartUseCase = cartUseCase;
    }

    @GetMapping
    @Operation(summary = "List all carts", description = "Retrieves all shopping carts")
    public ResponseEntity<List<Cart>> getAllCarts() {
        return ResponseEntity.ok(cartUseCase.findAllCarts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get cart by ID", description = "Retrieves a shopping cart by UUID")
    public ResponseEntity<Cart> getCartById(@PathVariable UUID id) {
        return ResponseEntity.ok(cartUseCase.findCartById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get or create cart for user", description = "Retrieves or initializes the active shopping cart for a user")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(cartUseCase.findOrCreateCartByUserId(userId));
    }

    @PostMapping("/user/{userId}/items")
    @Operation(summary = "Add or update cart item", description = "Adds a product or updates its quantity in the user's cart")
    public ResponseEntity<Cart> upsertCartItem(
            @PathVariable UUID userId,
            @Valid @RequestBody CartItemRequestDto requestDto
    ) {
        Cart updated = cartUseCase.upsertCartItem(userId, requestDto.productId(), requestDto.quantity());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/user/{userId}/items/{productId}")
    @Operation(summary = "Remove item from cart", description = "Removes a specific product from the user's cart")
    public ResponseEntity<Cart> removeCartItem(
            @PathVariable UUID userId,
            @PathVariable UUID productId
    ) {
        return ResponseEntity.ok(cartUseCase.removeCartItem(userId, productId));
    }

    @DeleteMapping("/user/{userId}/clear")
    @Operation(summary = "Clear user cart", description = "Removes all items from the user's cart")
    public ResponseEntity<Cart> clearCart(@PathVariable UUID userId) {
        return ResponseEntity.ok(cartUseCase.clearCart(userId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete cart by ID", description = "Deletes a shopping cart by UUID")
    public ResponseEntity<Void> deleteCart(@PathVariable UUID id) {
        cartUseCase.deleteCart(id);
        return ResponseEntity.noContent().build();
    }
}
