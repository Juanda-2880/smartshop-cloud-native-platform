# Task 04 — PostgreSQL 17, Persistencia JPA y Flyway: Resumen Técnico y Evidencia de Verificación

## 1. Resumen Técnico

Se implementó la capa de persistencia relacional para **SmartShop Cloud-Native Platform** utilizando **PostgreSQL 17**, **Spring Data JPA (Hibernate 6)** y **Flyway** como motor de migraciones versionadas de esquema y datos semilla.

### Componentes Implementados

1. **Infraestructura de Base de Datos (`database/`)**:
   - [`docker-compose.postgres.yml`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/database/docker-compose.postgres.yml): Servicio `postgres:17-alpine` con volumen persistente `smartshop_pgdata` y `healthcheck` (`pg_isready`).
   - Copias de referencia de migraciones en `database/migrations/`.
2. **Migraciones Versionadas con Flyway (`backend/src/main/resources/db/migration/`)**:
   - [`V1__create_ecommerce_schema.sql`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/backend/src/main/resources/db/migration/V1__create_ecommerce_schema.sql): Creación de tablas relacionales (`users`, `categories`, `products`, `carts`, `cart_items`, `orders`, `order_items`), claves foráneas (`ON DELETE CASCADE`) e índices de búsqueda por `category_id`, `sku`, `cart_id`, `user_id` y `order_id`.
   - [`V2__seed_enterprise_catalog.sql`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/backend/src/main/resources/db/migration/V2__seed_enterprise_catalog.sql): Inserción determinista de usuarios empresariales (`ADMIN`, `MANAGER`, `CUSTOMER`), categorías, catálogo de hardware Cloud-Native, carrito activo y orden histórica.
3. **Adaptadores de Persistencia JPA (`com.smartshop.platform.infrastructure.adapter.out.persistence.jpa`)**:
   - Entidades JPA validadas contra el esquema Flyway (`spring.jpa.hibernate.ddl-auto=validate`): `UserJpaEntity`, `CategoryJpaEntity`, `ProductJpaEntity`, `CartJpaEntity`, `CartItemJpaEntity`, `OrderJpaEntity`, `OrderItemJpaEntity`.
   - Repositorios Spring Data JPA y Adaptadores `@Primary` que implementan los puertos de salida del dominio hexagonal: `JpaUserRepositoryAdapter`, `JpaCategoryRepositoryAdapter`, `JpaProductRepositoryAdapter`, `JpaCartRepositoryAdapter`, `JpaOrderRepositoryAdapter`.

## 2. Verificación de Definition of Done (DoD) — Task 04

| Criterio DoD               | Verificación                                                                                                                                                                      | Estado |
| :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----: |
| **Base conectada**         | `DataSource` validado (`connection.isValid(2) == true`) y `/actuator/health` reporta `components.db.status = "UP"`                                                                |   ✅   |
| **Migraciones ejecutadas** | Flyway ejecuta `V1__create_ecommerce_schema.sql` y `V2__seed_enterprise_catalog.sql` (`flyway.info().applied().length >= 2`) y Hibernate valida el esquema (`ddl-auto: validate`) |   ✅   |
| **Datos persistentes**     | Almacenamiento persistente en disco y ciclo CRUD + Checkout verificado en `SmartShopApplicationTests` (`7/7` tests en verde)                                                      |   ✅   |
