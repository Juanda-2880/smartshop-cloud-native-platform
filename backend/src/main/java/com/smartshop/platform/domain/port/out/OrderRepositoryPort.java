package com.smartshop.platform.domain.port.out;

import com.smartshop.platform.domain.model.Order;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepositoryPort {

    List<Order> findAll();

    Optional<Order> findById(UUID id);

    List<Order> findByUserId(UUID userId);

    Order save(Order order);

    void deleteById(UUID id);

    boolean existsById(UUID id);
}
