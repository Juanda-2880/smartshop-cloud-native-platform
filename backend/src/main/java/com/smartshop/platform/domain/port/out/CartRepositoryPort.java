package com.smartshop.platform.domain.port.out;

import com.smartshop.platform.domain.model.Cart;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartRepositoryPort {

    List<Cart> findAll();

    Optional<Cart> findById(UUID id);

    Optional<Cart> findByUserId(UUID userId);

    Cart save(Cart cart);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}
