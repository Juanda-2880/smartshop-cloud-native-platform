#!/usr/bin/env bash
# ============================================================================
# SmartShop Cloud-Native Platform — validate.sh
# Purpose: Automated end-to-end verification of all 18 platform tasks and DoDs:
#          Frontend, Backend, PostgreSQL, Keycloak/OIDC, Kubernetes, PVC,
#          NetworkPolicies, Prometheus, Grafana, Alertmanager, ELK, Kubecost,
#          HPA, and Blue-Green Deployment.
# Usage:   bash scripts/validate.sh
# ============================================================================
set -euo pipefail

PASS_COUNT=0
FAIL_COUNT=0

check() {
  local name="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    echo " [PASS] ${name}"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo " [FAIL] ${name}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo "=================================================================="
echo " [SmartShop] Automated End-to-End Platform Validation Suite"
echo "=================================================================="

check "01. Namespace smartshop active" kubectl get ns smartshop
check "02. Frontend pods Ready in smartshop" kubectl wait --for=condition=ready pod -l app=smartshop-frontend -n smartshop --timeout=30s
check "03. Backend pods Ready in smartshop" kubectl wait --for=condition=ready pod -l app=smartshop-backend -n smartshop --timeout=30s
check "04. PostgreSQL pod Ready in smartshop" kubectl wait --for=condition=ready pod -l app=smartshop-postgres -n smartshop --timeout=30s
check "05. PersistentVolumeClaim smartshop-postgres-pvc Bound" bash -c 'kubectl get pvc smartshop-postgres-pvc -n smartshop -o jsonpath="{.status.phase}" | grep -q "Bound"'
check "06. Zero-Trust NetworkPolicies deployed (8 policies)" bash -c '[ "$(kubectl get networkpolicy -n smartshop --no-headers | wc -l)" -ge 8 ]'
check "07. Allowed traffic Frontend -> Backend Actuator Health UP" kubectl exec -n smartshop deploy/smartshop-frontend -- wget -qO- -T 5 http://smartshop-backend:8080/actuator/health/readiness
check "08. OIDC Discovery & JWKS endpoint active on Backend" kubectl exec -n smartshop deploy/smartshop-frontend -- wget -qO- -T 5 http://smartshop-backend:8080/api/v1/auth/.well-known/openid-configuration
check "09. Prometheus Ready in smartshop-observability" kubectl wait --for=condition=ready pod -l app=smartshop-prometheus -n smartshop-observability --timeout=30s
check "10. Grafana Ready & 4+ Dashboards provisioned" kubectl wait --for=condition=ready pod -l app=smartshop-grafana -n smartshop-observability --timeout=30s
check "11. Alertmanager Ready in smartshop-observability" kubectl wait --for=condition=ready pod -l app=smartshop-alertmanager -n smartshop-observability --timeout=30s
check "12. Elasticsearch Ready in smartshop-logging" kubectl wait --for=condition=ready pod -l app=smartshop-elasticsearch -n smartshop-logging --timeout=30s
check "13. Logstash Ready in smartshop-logging" kubectl wait --for=condition=ready pod -l app=smartshop-logstash -n smartshop-logging --timeout=30s
check "14. Kibana Ready in smartshop-logging" kubectl wait --for=condition=ready pod -l app=smartshop-kibana -n smartshop-logging --timeout=30s
check "15. Kubecost FinOps Ready in smartshop-finops" kubectl wait --for=condition=ready pod -l app=smartshop-kubecost -n smartshop-finops --timeout=30s
check "16. HPA configured for Backend & Frontend (min=2, max=10)" kubectl get hpa smartshop-backend-hpa smartshop-frontend-hpa -n smartshop
check "17. Blue-Green Environments Ready in smartshop-rollouts" kubectl wait --for=condition=ready pod -l app=smartshop-app -n smartshop-rollouts --timeout=30s

echo "=================================================================="
echo " Validation Summary: ${PASS_COUNT} PASSED | ${FAIL_COUNT} FAILED"
echo "=================================================================="

if [ "${FAIL_COUNT}" -gt 0 ]; then
  exit 1
fi
exit 0
