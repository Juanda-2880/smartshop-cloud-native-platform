package com.smartshop.platform;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryCategoryRepositoryAdapter;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryProductRepositoryAdapter;
import com.smartshop.platform.infrastructure.adapter.out.persistence.InMemoryUserRepositoryAdapter;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class SmartShopApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Flyway flyway;

    @Test
    void databaseConnectionAndFlywayMigrationsShouldBeExecuted() throws Exception {
        try (var connection = dataSource.getConnection()) {
            assertThat(connection.isValid(2)).isTrue();
        }

        MigrationInfo[] appliedMigrations = flyway.info().applied();
        assertThat(appliedMigrations).hasSizeGreaterThanOrEqualTo(2);
        assertThat(appliedMigrations[0].getVersion().getVersion()).isEqualTo("1");
        assertThat(appliedMigrations[1].getVersion().getVersion()).isEqualTo("2");

        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.components.db.status").value("UP"));
    }

    @Test
    void healthChecksAndOpenApiShouldBeOperational() throws Exception {
        mockMvc.perform(get("/actuator/health/liveness"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        mockMvc.perform(get("/actuator/health/readiness"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openapi").exists())
                .andExpect(jsonPath("$.info.title").value("SmartShop Cloud-Native Platform API"))
                .andExpect(jsonPath("$.paths['/api/v1/products']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/users']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/categories']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/carts']").exists())
                .andExpect(jsonPath("$.paths['/api/v1/orders']").exists());

        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
    }

    @Test
    void fullCrudLifecycleForUsersCategoriesProductsCartsAndOrders() throws Exception {
        // 1. User CRUD
        String userPayload = """
                {
                  "username": "devops.lead",
                  "email": "devops.lead@smartshop.io",
                  "fullName": "Lucas Vance",
                  "role": "MANAGER",
                  "active": true
                }
                """;
        MvcResult createdUserResult = mockMvc.perform(post("/api/v1/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("devops.lead"))
                .andReturn();

        JsonNode createdUser = objectMapper.readTree(createdUserResult.getResponse().getContentAsString());
        String userId = createdUser.get("id").asText();

        String updatedUserPayload = """
                {
                  "username": "devops.lead",
                  "email": "devops.lead@smartshop.io",
                  "fullName": "Lucas Vance Sr.",
                  "role": "ADMIN",
                  "active": true
                }
                """;
        mockMvc.perform(put("/api/v1/users/" + userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedUserPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Lucas Vance Sr."))
                .andExpect(jsonPath("$.role").value("ADMIN"));

        // 2. Category CRUD
        String categoryPayload = """
                {
                  "name": "AI Accelerators",
                  "slug": "ai-accelerators",
                  "description": "High-throughput tensor processing PCIe cards",
                  "active": true
                }
                """;
        MvcResult createdCategoryResult = mockMvc.perform(post("/api/v1/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(categoryPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug").value("ai-accelerators"))
                .andReturn();

        String categoryId = objectMapper.readTree(createdCategoryResult.getResponse().getContentAsString())
                .get("id").asText();

        // 3. Product CRUD
        String productPayload = """
                {
                  "sku": "SKU-AI-TENSOR-01",
                  "name": "TensorCore X900 PCIe Accelerator",
                  "description": "256GB HBM3e Accelerator for LLM inference on Kubernetes",
                  "price": 4500.00,
                  "stockQuantity": 15,
                  "categoryId": "%s",
                  "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
                  "featured": true,
                  "active": true
                }
                """.formatted(categoryId);

        MvcResult createdProductResult = mockMvc.perform(post("/api/v1/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.sku").value("SKU-AI-TENSOR-01"))
                .andExpect(jsonPath("$.categoryName").value("AI Accelerators"))
                .andReturn();

        String productId = objectMapper.readTree(createdProductResult.getResponse().getContentAsString())
                .get("id").asText();

        mockMvc.perform(get("/api/v1/products/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("TensorCore X900 PCIe Accelerator"));

        // 4. Cart & Order Checkout
        String cartItemPayload = """
                {
                  "productId": "%s",
                  "quantity": 2
                }
                """.formatted(productId);

        mockMvc.perform(post("/api/v1/carts/user/" + userId + "/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(cartItemPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.totalAmount").value(9000.00));

        String checkoutPayload = """
                {
                  "shippingAddress": "500 Kubernetes Plaza, Seattle, WA"
                }
                """;
        MvcResult createdOrderResult = mockMvc.perform(post("/api/v1/orders/checkout/" + userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PAID"))
                .andExpect(jsonPath("$.totalAmount").value(9000.00))
                .andReturn();

        String orderId = objectMapper.readTree(createdOrderResult.getResponse().getContentAsString())
                .get("id").asText();

        mockMvc.perform(patch("/api/v1/orders/" + orderId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"SHIPPED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHIPPED"));

        // 5. Cleanup DELETE checks
        mockMvc.perform(delete("/api/v1/orders/" + orderId))
                .andExpect(status().isNoContent());
        mockMvc.perform(delete("/api/v1/products/" + productId))
                .andExpect(status().isNoContent());
        mockMvc.perform(delete("/api/v1/categories/" + categoryId))
                .andExpect(status().isNoContent());
        mockMvc.perform(delete("/api/v1/users/" + userId))
                .andExpect(status().isNoContent());

        // Verify seeded data from V2 Flyway migration remains intact
        mockMvc.perform(get("/api/v1/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(4))));
    }

    @Test
    void seededCatalogUsersCartsAndOrdersFromFlywayMigrationShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/api/v1/users/" + InMemoryUserRepositoryAdapter.DEFAULT_CUSTOMER_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("CUSTOMER"));

        mockMvc.perform(get("/api/v1/categories/" + InMemoryCategoryRepositoryAdapter.CAT_CLOUD_HARDWARE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("cloud-edge-hardware"));

        mockMvc.perform(get("/api/v1/products/" + InMemoryProductRepositoryAdapter.PROD_KUBE_BLADE))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sku").value("SKU-K8S-BLADE-01"));
    }
}
