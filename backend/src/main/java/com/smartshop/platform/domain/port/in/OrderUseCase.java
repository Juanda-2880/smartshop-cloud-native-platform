package com.smartshop.platform.domain.port.in;

import com.smartshop.platform.domain.model.Order;
import com.smartshop.platform.domain.model.OrderStatus;
import java.util.List;
import java.util.UUID;

public interface OrderUseCase {

    List<Order> findAllOrders();

    Order findOrderById(UUID id);

    List<Order> findOrdersByUserId(UUID userId);

    Order createOrder(Order order);

    Order checkoutFromUserCart(UUID userId, String shippingAddress);

    Order updateOrderStatus(UUID id, OrderStatus status);

    void deleteOrder(UUID id);
}

