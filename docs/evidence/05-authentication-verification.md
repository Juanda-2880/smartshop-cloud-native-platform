# Task 05 — Keycloak 26 SSO, OAuth2, OIDC y RBAC: Resumen Técnico y Evidencia de Verificación

## 1. Resumen Técnico
Se integró la capa de identidad federada y control de acceso basado en roles (**RBAC**) utilizando **Keycloak 26**, **Spring Security 6 OAuth2 Resource Server** y **OpenID Connect (OIDC)** con firmas asimétricas **RS256**.

### Componentes Implementados
1. **Configuración de Realm y Despliegue de Keycloak 26 (`authentication/keycloak/`)**:
   - [`smartshop-realm.json`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/authentication/keycloak/smartshop-realm.json): Realm `smartshop` con roles `ADMIN`, `MANAGER`, `CUSTOMER`, clientes `smartshop-frontend` (Authorization Code + PKCE `S256`) y `smartshop-backend` (Confidential Resource Server), y usuarios empresariales pre-aprovisionados (`admin@smartshop.io`, `manager@smartshop.io`, `customer@smartshop.io`).
   - [`docker-compose.keycloak.yml`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/authentication/keycloak/docker-compose.keycloak.yml): Servicio `quay.io/keycloak/keycloak:26.0` con `--import-realm`, métricas y healthchecks activos.
2. **Seguridad OAuth2 / OIDC en el Backend (`com.smartshop.platform.infrastructure.config`)**:
   - [`OidcTokenService.java`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/backend/src/main/java/com/smartshop/platform/infrastructure/config/OidcTokenService.java): Emisor y validador OIDC **RS256** (`RSA-2048` + `JWKSet`), endpoint JWKS (`/api/v1/auth/.well-known/jwks.json`), metadatos OIDC Discovery (`/api/v1/auth/.well-known/openid-configuration`) y lista de revocación de `jti` en tiempo real para invalidar tokens al hacer logout.
   - [`KeycloakRealmRoleConverter.java`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/backend/src/main/java/com/smartshop/platform/infrastructure/config/KeycloakRealmRoleConverter.java): Traduce los claims `realm_access.roles` y `roles` del JWT hacia autoridades de Spring Security (`ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_CUSTOMER`).
   - [`SecurityConfiguration.java`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/backend/src/main/java/com/smartshop/platform/infrastructure/config/SecurityConfiguration.java): Cadena de filtros Stateless OAuth2 Resource Server protegiendo `/api/v1/auth/me` y endpoints jerárquicos RBAC (`/api/v1/auth/rbac/admin`, `/api/v1/auth/rbac/manager`, `/api/v1/auth/rbac/customer`).
   - [`AuthController.java`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/backend/src/main/java/com/smartshop/platform/infrastructure/adapter/in/web/AuthController.java): Endpoints REST de Login (`/api/v1/auth/login`), Logout con revocación (`/api/v1/auth/logout`), inspección de sesión (`/api/v1/auth/me`) y verificación de roles.
3. **Portal SSO en el Frontend (`frontend/src/features/auth/LoginView.tsx`)**:
   - Inicio de sesión OIDC, cierre de sesión (`Logout`), conmutación instantánea entre `ADMIN`, `MANAGER` y `CUSTOMER`, e inspector de claims JWT RS256.

## 2. Verificación de Definition of Done (DoD) — Task 05

| Criterio DoD | Verificación | Estado |
| :--- | :--- | :---: |
| **Login funcional** | `POST /api/v1/auth/login` autentica usuarios y emite JWT RS256 con `realm_access.roles` y `scope: "openid profile email roles"` | ✅ |
| **Logout funcional** | `POST /api/v1/auth/logout` revoca el `jti` del token; peticiones posteriores con el mismo token reciben `401 Unauthorized` | ✅ |
| **Roles funcionales** | `ADMIN` accede a `/admin`, `/manager`, `/customer` (`200 OK`); `MANAGER` accede a `/manager` (`200 OK`) y recibe `403 Forbidden` en `/admin`; `CUSTOMER` accede a `/customer` (`200 OK`) y recibe `403 Forbidden` en `/manager` y `/admin` | ✅ |
| **APIs protegidas** | Peticiones sin token a `/api/v1/auth/me` y `/api/v1/auth/rbac/*` son rechazadas con `401 Unauthorized` | ✅ |
