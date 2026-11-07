#!/usr/bin/env bash
# ==============================================================================
# SmartShop Cloud-Native Platform — Dashboards Port-Forward Launcher
# Starts background port-forwards for all Observability, ELK & FinOps Dashboards
# ==============================================================================
set -euo pipefail

start_tunnel() {
  local name="$1"
  local namespace="$2"
  local svc="$3"
  local local_port="$4"
  local remote_port="$5"

  # Check if port is already listening
  if curl -s --max-time 1 "http://127.0.0.1:${local_port}" >/dev/null 2>&1; then
    echo " [ACTIVE]  ${name} already listening on http://localhost:${local_port}"
  else
    kubectl port-forward -n "${namespace}" "svc/${svc}" "${local_port}:${remote_port}" --address 127.0.0.1 >/dev/null 2>&1 &
    sleep 1
    echo " [STARTED] ${name} forwarded -> http://localhost:${local_port}"
  fi
}

echo "================================================================================"
echo " [SmartShop] Starting Port-Forwards for All Platform Dashboards"
echo "================================================================================"

start_tunnel "Grafana (4 Dashboards)"       "smartshop-observability" "smartshop-grafana"       "3000"  "3000"
start_tunnel "Prometheus UI"                "smartshop-observability" "smartshop-prometheus"    "9090"  "9090"
start_tunnel "Alertmanager UI"              "smartshop-observability" "smartshop-alertmanager"  "9093"  "9093"
start_tunnel "Jaeger Distributed Tracing"   "smartshop-observability" "smartshop-jaeger"        "16686" "16686"
start_tunnel "Kibana ELK (4 Dashboards)"    "smartshop-logging"       "smartshop-kibana"        "5601"  "5601"
start_tunnel "Elasticsearch REST API"       "smartshop-logging"       "smartshop-elasticsearch" "9200"  "9200"
start_tunnel "Kubecost FinOps Dashboard"    "smartshop-finops"        "smartshop-kubecost"      "9095"  "9090"

sleep 2

echo ""
echo "================================================================================"
echo " [SmartShop] DASHBOARDS — URLS DE ACCESO & CREDENCIALES"
echo "================================================================================"
echo ""
echo " 1. GRAFANA (Métricas USE, RED, Kubernetes & Negocio)"
echo "    - Portal Principal:          http://localhost:3000"
echo "    - Login (Opcional Admin):    http://localhost:3000/login"
echo "    - Dashboard Infra (USE):     http://localhost:3000/d/smartshop-infra-use"
echo "    - Dashboard Kubernetes:      http://localhost:3000/d/smartshop-k8s-cluster"
echo "    - Dashboard App (RED):       http://localhost:3000/d/smartshop-app-red"
echo "    - Dashboard Negocio KPIs:    http://localhost:3000/d/smartshop-business-kpis"
echo "    - Usuario:                   admin"
echo "    - Contraseña:                admin_password"
echo "    - Comando Manual:            kubectl port-forward -n smartshop-observability svc/smartshop-grafana 3000:3000"
echo ""
echo " 2. KIBANA — ELK STACK (4 Dashboards: Errores, Seguridad, Operación, Negocio)"
echo "    - Portal Dashboards:         http://localhost:5601/app/dashboards"
echo "    - Discover Logs:             http://localhost:5601/app/discover"
echo "    - Credenciales:              Acceso directo (Sin contraseña en clúster interno)"
echo "    - Comando Manual:            kubectl port-forward -n smartshop-logging svc/smartshop-kibana 5601:5601"
echo ""
echo " 3. KUBECOST — FINOPS & GOBERNANZA DE COSTOS CLOUD"
echo "    - Dashboard FinOps UI:       http://localhost:9095"
echo "    - API Allocation Namespace:  http://localhost:9095/model/allocation?window=7d&aggregate=namespace"
echo "    - API Recomendaciones:       http://localhost:9095/model/savings/recommendations"
echo "    - Credenciales:              Acceso directo (Sin contraseña)"
echo "    - Comando Manual:            kubectl port-forward -n smartshop-finops svc/smartshop-kubecost 9095:9090"
echo ""
echo " 4. PROMETHEUS — MOTOR DE MÉTRICAS & REGLAS DE ALERTA"
echo "    - Prometheus Web UI:         http://localhost:9090"
echo "    - Targets Activos:           http://localhost:9090/targets"
echo "    - Reglas de Alerta:          http://localhost:9090/alerts"
echo "    - Credenciales:              Acceso directo (Sin contraseña)"
echo "    - Comando Manual:            kubectl port-forward -n smartshop-observability svc/smartshop-prometheus 9090:9090"
echo ""
echo " 5. ALERTMANAGER — GESTIÓN DE INCIDENTES SRE"
echo "    - Alertmanager UI:           http://localhost:9093"
echo "    - Credenciales:              Acceso directo (Sin contraseña)"
echo "    - Comando Manual:            kubectl port-forward -n smartshop-observability svc/smartshop-alertmanager 9093:9093"
echo ""
echo " 6. JAEGER — TRAZABILIDAD DISTRIBUIDA (OPENTELEMETRY)"
echo "    - Jaeger Tracing UI:         http://localhost:16686"
echo "    - Credenciales:              Acceso directo (Sin contraseña)"
echo "    - Comando Manual:            kubectl port-forward -n smartshop-observability svc/smartshop-jaeger 16686:16686"
echo ""
echo " 7. ELASTICSEARCH — MOTOR DE BÚSQUEDA DE LOGS"
echo "    - Health & Cluster Info:     http://localhost:9200/_cluster/health?pretty"
echo "    - Índices de Logs:           http://localhost:9200/_cat/indices?v"
echo "    - Comando Manual:            kubectl port-forward -n smartshop-logging svc/smartshop-elasticsearch 9200:9200"
echo "================================================================================"

if [[ "${1:-}" == "--keep-alive" ]]; then
  echo " [RUNNING] Keeping all dashboard port-forwards active (Press Ctrl+C to stop)..."
  wait
fi
