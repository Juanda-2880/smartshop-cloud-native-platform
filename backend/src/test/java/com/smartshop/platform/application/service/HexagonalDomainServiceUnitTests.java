package com.smartshop.platform.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.smartshop.platform.domain.exception.BusinessRuleViolationException;
import com.smartshop.platform.domain.exception.ResourceNotFoundException;
import com.smartshop.platform.domain.model.Cart;
import com.smartshop.platform.domain.model.Order;
import com.smartshop.platform.domain.model.OrderStatus;
import com.smartshop.platform.domain.model.Product;
import com.smartshop.platform.domain.port.out.BusinessMetricsPort;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryCartRepositoryAdapter;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryCategoryRepositoryAdapter;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryOrderRepositoryAdapter;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryProductRepositoryAdapter;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryUserRepositoryAdapter;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import com.smartshop.platform.infrastructure.adapter.out.telemetry.MicrometerBusinessMetricsAdapter;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HexagonalDomainServiceUnitTests {

    private InMemoryUserRepositoryAdapter userRepository;
    private InMemoryCategoryRepositoryAdapter categoryRepository;
    private InMemoryProductRepositoryAdapter productRepository;
    private InMemoryCartRepositoryAdapter cartRepository;
    private InMemoryOrderRepositoryAdapter orderRepository;
    private BusinessMetricsPort businessMetricsPort;

    private ProductService productService;
    private CartService cartService;
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        userRepository = new InMemoryUserRepositoryAdapter();
        categoryRepository = new InMemoryCategoryRepositoryAdapter();
        productRepository = new InMemoryProductRepositoryAdapter();
        cartRepository = new InMemoryCartRepositoryAdapter();
        orderRepository = new InMemoryOrderRepositoryAdapter();
        businessMetricsPort = new MicrometerBusinessMetricsAdapter(new SimpleMeterRegistry());

        productService = new ProductService(productRepository, categoryRepository, businessMetricsPort);
        cartService = new CartService(cartRepository, productRepository, userRepository, businessMetricsPort);
        orderService = new OrderService(orderRepository, productRepository, userRepository, cartService, businessMetricsPort);
    }

    @Test
    void shouldRejectDuplicateProductSku() {
        Product duplicateSkuProduct = new Product(
                null,
                "SKU-K8S-BLADE-01",
                "Duplicate Blade",
                "Description",
                new BigDecimal("999.00"),
                10,
                InMemoryCategoryRepositoryAdapter.CAT_CLOUD_HARDWARE,
                null,
                "https://example.com/image.png",
                false,
                true,
                null
        );

        assertThatThrownBy(() -> productService.createProduct(duplicateSkuProduct))
                .isInstanceOf(BusinessRuleViolationException.class)
                .hasMessageContaining("SKU-K8S-BLADE-01");
    }

    @Test
    void shouldThrowResourceNotFoundWhenProductDoesNotExist() {
        UUID unknownId = UUID.randomUUID();
        assertThatThrownBy(() -> productService.findProductById(unknownId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(unknownId.toString());
    }

    @Test
    void shouldAddCartItemsCalculateTotalAndCheckoutIntoOrder() {
        UUID userId = InMemoryUserRepositoryAdapter.DEFAULT_MANAGER_ID;
        UUID productId = InMemoryProductRepositoryAdapter.PROD_KUBE_BLADE;

        int initialStock = productService.findProductById(productId).stockQuantity();

        Cart updatedCart = cartService.upsertCartItem(userId, productId, 2);
        assertThat(updatedCart.items()).hasSize(1);
        assertThat(updatedCart.totalAmount()).isEqualByComparingTo(new BigDecimal("2998.00"));

        Order createdOrder = orderService.checkoutFromUserCart(userId, "100 Enterprise Way, Austin, TX");
        assertThat(createdOrder.status()).isEqualTo(OrderStatus.PAID);
        assertThat(createdOrder.totalAmount()).isEqualByComparingTo(new BigDecimal("2998.00"));

        int remainingStock = productService.findProductById(productId).stockQuantity();
        assertThat(remainingStock).isEqualTo(initialStock - 2);

        Cart clearedCart = cartService.findOrCreateCartByUserId(userId);
        assertThat(clearedCart.items()).isEmpty();
        assertThat(clearedCart.totalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}

