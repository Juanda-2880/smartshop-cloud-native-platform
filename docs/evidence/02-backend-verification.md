# Task 02 — Backend Hexagonal E-Commerce: Resumen Técnico y Evidencia de Verificación

## 1. Resumen Técnico

Se implementó el backend e-commerce completo en `backend/` utilizando **Java 21 LTS**, **Spring Boot 3.5.0**, **MapStruct 1.6.3**, **SpringDoc OpenAPI 2.8.8 (OpenAPI 3.0)** y **Micrometer Prometheus**, siguiendo estrictamente **Arquitectura Hexagonal (Ports & Adapters)**, **SOLID** y **Clean Code**.

### Entidades de Dominio Implementadas (`com.smartshop.platform.domain.model`)

- `User` (`id`, `username`, `email`, `fullName`, `role` [`ADMIN`, `MANAGER`, `CUSTOMER`], `active`, `createdAt`)
- `Category` (`id`, `name`, `slug`, `description`, `active`)
- `Product` (`id`, `sku`, `name`, `description`, `price`, `stockQuantity`, `categoryId`, `categoryName`, `imageUrl`, `featured`, `active`, `createdAt`)
- `Cart` y `CartItem` (`id`, `userId`, `items`, `totalAmount`, `updatedAt`)
- `Order` y `OrderItem` (`id`, `orderNumber`, `userId`, `items`, `totalAmount`, `status` [`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`], `shippingAddress`, `createdAt`)

### Puertos y Adaptadores

- **Inbound Ports (`domain.port.in`)**: `UserUseCase`, `CategoryUseCase`, `ProductUseCase`, `CartUseCase`, `OrderUseCase`.
- **Outbound Ports (`domain.port.out`)**: `UserRepositoryPort`, `CategoryRepositoryPort`, `ProductRepositoryPort`, `CartRepositoryPort`, `OrderRepositoryPort`, `BusinessMetricsPort`.
- **Application Services (`application.service`)**: `UserService`, `CategoryService`, `ProductService`, `CartService`, `OrderService` (con validación de stock, cálculo de subtotales, checkout automático desde carrito y emisión de métricas de negocio).
- **Inbound Web Adapters (`infrastructure.adapter.in.web`)**:
  - Controladores REST: `UserController` (`/api/v1/users`), `CategoryController` (`/api/v1/categories`), `ProductController` (`/api/v1/products`), `CartController` (`/api/v1/carts`), `OrderController` (`/api/v1/orders`).
  - Mapeo automático con **MapStruct** (`WebDtoMapper`).
  - Manejo centralizado de errores RFC 7807 `ProblemDetail` (`GlobalExceptionHandler`).
- **Outbound Adapters (`infrastructure.adapter.out`)**:
  - Adaptadores de persistencia concurrentes con datos semilla (`persistence/*`).
  - Adaptador de métricas de negocio con Micrometer (`MicrometerBusinessMetricsAdapter`: `smartshop_active_users`, `smartshop_products_visited_total`, `smartshop_carts_updated_total`, `smartshop_orders_completed_total`, `smartshop_conversion_rate`).

## 2. Verificación de Definition of Done (DoD) — Task 02

| Criterio DoD               | Verificación                                                                                                                                      | Estado |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :----: |
| **CRUD funcional**         | Endpoints REST completos (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) para `Users`, `Categories`, `Products`, `Carts` y `Orders` + flujo de Checkout |   ✅   |
| **OpenAPI funcional**      | Especificación generada en `/v3/api-docs` e interfaz interactiva en `/swagger-ui/index.html`                                                      |   ✅   |
| **Health Check funcional** | `/actuator/health`, `/actuator/health/liveness` y `/actuator/health/readiness` respondiendo `{"status":"UP"}`                                     |   ✅   |
| **Tests exitosos**         | Tests unitarios (`HexagonalDomainServiceUnitTests`) y de integración (`SmartShopApplicationTests`) ejecutados con `0` fallos                      |   ✅   |
