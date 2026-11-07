package com.smartshop.platform.domain.port.in;

import com.smartshop.platform.domain.model.Cart;
import java.util.List;
import java.util.UUID;

public interface CartUseCase {

    List<Cart> findAllCarts();

    Cart findCartById(UUID id);

    Cart findOrCreateCartByUserId(UUID userId);

    Cart upsertCartItem(UUID userId, UUID productId, int quantity);

    Cart removeCartItem(UUID userId, UUID productId);

    Cart clearCart(UUID userId);

    void deleteCart(UUID id);
}

