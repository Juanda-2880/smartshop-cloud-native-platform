#!/usr/bin/env bash
# ==============================================================================
# SmartShop Cloud-Native Platform — Application & Full Stack Port-Forward Launcher
# Starts port-forwards for Web App, Backend API, Blue-Green, DB, and Dashboards
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

start_tunnel() {
  local name="$1"
  local namespace="$2"
  local svc="$3"
  local local_port="$4"
  local remote_port="$5"

  if curl -s --max-time 1 "http://127.0.0.1:${local_port}" >/dev/null 2>&1; then
    echo " [ACTIVE] ${name} already listening on http://localhost:${local_port}"
  else
    nohup kubectl port-forward -n "${namespace}" "svc/${svc}" "${local_port}:${remote_port}" --address 127.0.0.1 >/dev/null 2>&1 &
    sleep 1
    echo " [STARTED] ${name} forwarded -> http://localhost:${local_port}"
  fi
}

echo "================================================================================"
echo " [SmartShop] Starting Port-Forwards for Web Page, Backend, Blue-Green & DB"
echo "================================================================================"

start_tunnel "SmartShop Web Page (Frontend)"  "smartshop"          "smartshop-frontend"       "5173" "80"
start_tunnel "SmartShop Web Page (Alt Port)"  "smartshop"          "smartshop-frontend"       "8088" "80"
start_tunnel "SmartShop Backend API/Swagger"  "smartshop"          "smartshop-backend"        "8080" "8080"
start_tunnel "Blue-Green Production (Active)" "smartshop-rollouts" "smartshop-active-service"  "8091" "80"
start_tunnel "Blue-Green Candidate (Preview)" "smartshop-rollouts" "smartshop-preview-service" "8092" "80"

# Forward PostgreSQL TCP port 5432
nohup kubectl port-forward -n smartshop svc/smartshop-postgres 5432:5432 --address 127.0.0.1 >/dev/null 2>&1 &
echo " [STARTED] PostgreSQL 17 Database forwarded -> localhost:5432"

echo ""
# Also ensure all Dashboards are forwarded
bash "${SCRIPT_DIR}/forward-dashboards.sh"

echo ""
echo "================================================================================"
echo " [SmartShop] PÁGINA WEB, API, BLUE-GREEN & CREDENCIALES COMPLETAS"
echo "================================================================================"
echo ""
echo " A. PÁGINA WEB PRINCIPAL E-COMMERCE (React 19 + Tailwind CSS 4)"
echo "    - URL Principal:             http://localhost:5173"
echo "    - URL Alternativa:           http://localhost:8088"
echo "    - Comando Manual:            kubectl port-forward -n smartshop svc/smartshop-frontend 5173:80"
echo ""
echo "    CREDENCIALES DE USUARIOS EN LA PÁGINA WEB / KEYCLOAK OIDC (Realm: smartshop):"
echo "    ----------------------------------------------------------------------------"
echo "    1) Rol ADMIN (Acceso Total a Catálogo, Órdenes y Dashboard Ejecutivo):"
echo "       - Email:                  admin@smartshop.io"
echo "       - Usuario:                admin.smartshop"
echo "       - Contraseña:             SmartShopAdmin2026!"
echo ""
echo "    2) Rol MANAGER (Gestión de Catálogo e Inventario):"
echo "       - Email:                  manager@smartshop.io"
echo "       - Usuario:                manager.smartshop"
echo "       - Contraseña:             SmartShopManager2026!"
echo ""
echo "    3) Rol CUSTOMER (Cliente Comprador — Carrito y Checkout):"
echo "       - Email:                  customer@smartshop.io"
echo "       - Usuario:                customer.smartshop"
echo "       - Contraseña:             SmartShopCustomer2026!"
echo ""
echo " B. BACKEND API, SWAGGER UI & OIDC / ACTUATOR (Spring Boot 3.5 / Java 21)"
echo "    - Swagger UI Interactivo:    http://localhost:8080/swagger-ui.html"
echo "    - OpenAPI 3 JSON:            http://localhost:8080/v3/api-docs"
echo "    - API Productos:             http://localhost:8080/api/v1/products"
echo "    - API Categorías:            http://localhost:8080/api/v1/categories"
echo "    - OIDC Discovery:            http://localhost:8080/api/v1/auth/.well-known/openid-configuration"
echo "    - JWKS Claves Públicas:      http://localhost:8080/api/v1/auth/.well-known/jwks.json"
echo "    - Actuator Health:           http://localhost:8080/actuator/health"
echo "    - Actuator Prometheus:       http://localhost:8080/actuator/prometheus"
echo "    - Comando Manual:            kubectl port-forward -n smartshop svc/smartshop-backend 8080:8080"
echo ""
echo " C. ENTORNOS BLUE-GREEN DEPLOYMENT (Progressive Delivery)"
echo "    - Producción Activa (Blue):  http://localhost:8091"
echo "    - Candidata Preview (Green): http://localhost:8092"
echo "    - Comando Manual Blue:       kubectl port-forward -n smartshop-rollouts svc/smartshop-active-service 8091:80"
echo "    - Comando Manual Green:      kubectl port-forward -n smartshop-rollouts svc/smartshop-preview-service 8092:80"
echo ""
echo " D. BASE DE DATOS POSTGRESQL 17"
echo "    - Host / Puerto:             localhost:5432"
echo "    - Base de Datos:             smartshop_db"
echo "    - Usuario:                   smartshop_user"
echo "    - Contraseña:                smartshop_password"
echo "    - Comando Manual:            kubectl port-forward -n smartshop svc/smartshop-postgres 5432:5432"
echo "================================================================================"

if [[ "${1:-}" == "--keep-alive" ]]; then
  echo " [RUNNING] Keeping all platform & dashboard port-forwards active (Press Ctrl+C to stop)..."
  wait
fi
