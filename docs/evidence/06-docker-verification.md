# Task 06 — Docker Multi-Stage & Container Health Verification Evidence

## 1. Objective & Scope
Package the **SmartShop Cloud-Native Platform** frontend (`React 19 + TypeScript + Vite 7`) and backend (`Java 21 LTS + Spring Boot 3.5`) into production-grade, multi-stage OCI container images with built-in healthchecks, non-root runtime execution, and full orchestration via `docker-compose.yml` connected to PostgreSQL 17.

## 2. Implemented Container Artifacts

| File | Description |
| :--- | :--- |
| `frontend/Dockerfile` | Multi-stage build (`node:24-alpine` builder → `nginx:1.27-alpine` runtime, `74.3 MB` image) with `HEALTHCHECK` on `/healthz`. |
| `frontend/nginx.conf` | Hardened SPA Nginx configuration with Gzip compression, immutable asset caching (`/assets/`), SPA fallback (`try_files`), and JSON health probe (`/healthz`). |
| `frontend/.dockerignore` | Excludes `node_modules`, `dist`, `.git`, and IDE artifacts from build context. |
| `backend/Dockerfile` | Multi-stage build (`maven:3.9.9-eclipse-temurin-21-alpine` builder → `eclipse-temurin:21-jre-alpine` runtime) running as non-root user `smartshop` with container-aware JVM flags (`-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0`) and `HEALTHCHECK` on `/actuator/health/readiness`. |
| `backend/.dockerignore` | Excludes `target/`, `.git/`, and local IDE metadata from build context. |
| `docker-compose.yml` | Full local stack orchestration (`smartshop-postgres`, `smartshop-backend`, `smartshop-frontend`) with `service_healthy` dependency ordering and persistent volume `smartshop_pgdata`. |

## 3. Verification Evidence (DoD Validation)

### 3.1 Image Build Verification (`docker build`)
- `docker build -t smartshop-frontend:1.0.0 ./frontend` → **Exit Code 0** (`74.3 MB` uncompressed, `21.1 MB` content size).
- `docker build -t smartshop-backend:1.0.0 ./backend` → **Exit Code 0** (`424 MB` uncompressed, `139 MB` content size).

### 3.2 Container Health & Readiness Probes (`docker compose up -d`)
All three containers started in dependency order and transitioned to `(healthy)`:

```text
NAMES                IMAGE                      STATUS                    PORTS
smartshop-frontend   smartshop-frontend:1.0.0   Up 11 seconds (healthy)   0.0.0.0:8088->80/tcp, [::]:8088->80/tcp
smartshop-backend    smartshop-backend:1.0.0    Up 22 seconds (healthy)   0.0.0.0:8080->8080/tcp, [::]:8080->8080/tcp
smartshop-postgres   postgres:17-alpine         Up 27 seconds (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
```

### 3.3 Live Health Probe & PostgreSQL Flyway Seed Responses
- **Frontend Healthcheck (`GET http://127.0.0.1:8088/healthz`)**:
  ```json
  {"status":"UP","service":"smartshop-frontend"}
  ```
- **Backend Readiness & PostgreSQL Healthcheck (`GET http://127.0.0.1:8080/actuator/health`)**:
  ```json
  {
    "status": "UP",
    "groups": ["liveness", "readiness"],
    "components": {
      "db": {
        "status": "UP",
        "details": {
          "database": "PostgreSQL",
          "validationQuery": "isValid()"
        }
      },
      "livenessState": { "status": "UP" },
      "readinessState": { "status": "UP" }
    }
  }
  ```
- **Flyway Seed Verification against Live PostgreSQL 17 Container**:
  - `GET http://127.0.0.1:8080/api/v1/categories` → `4` enterprise categories returned.
  - `GET http://127.0.0.1:8080/api/v1/products` → `4` enterprise products returned.

## 4. Definition of Done (DoD) Checklist
- [x] `Dockerfile` frontend multi-stage con `HEALTHCHECK` (`frontend/Dockerfile`, `frontend/nginx.conf`)
- [x] `Dockerfile` backend multi-stage con `HEALTHCHECK` y usuario no-root (`backend/Dockerfile`)
- [x] Orquestación `docker-compose.yml` con healthcheck conditions
- [x] ✅ Build exitoso (`smartshop-frontend:1.0.0` y `smartshop-backend:1.0.0`)
- [x] ✅ Containers saludables (`smartshop-postgres`, `smartshop-backend`, `smartshop-frontend` en estado `healthy`)

