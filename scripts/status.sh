#!/usr/bin/env bash
# ============================================================================
# SmartShop Cloud-Native Platform — status.sh
# Purpose: Display complete operational status across all 5 SmartShop
#          namespaces (smartshop, smartshop-observability, smartshop-logging,
#          smartshop-finops, smartshop-rollouts), PV/PVC, HPA, and Ingresses.
# Usage:   bash scripts/status.sh
# ============================================================================
set -euo pipefail

echo "=================================================================="
echo " [SmartShop] Platform Operational Status Report"
echo "=================================================================="

echo ""
echo "--- 1. Platform Namespaces ---"
kubectl get namespaces | grep -E "NAME|smartshop|ingress-nginx"

echo ""
echo "--- 2. Core Application Stack (namespace: smartshop) ---"
kubectl get pods,svc,ingress,hpa,pvc -n smartshop -o wide

echo ""
echo "--- 3. Observability Stack (namespace: smartshop-observability) ---"
kubectl get pods,svc -n smartshop-observability -o wide

echo ""
echo "--- 4. ELK Logging Stack (namespace: smartshop-logging) ---"
kubectl get pods,svc -n smartshop-logging -o wide

echo ""
echo "--- 5. FinOps Stack (namespace: smartshop-finops) ---"
kubectl get pods,svc -n smartshop-finops -o wide

echo ""
echo "--- 6. Progressive Delivery / Blue-Green Stack (namespace: smartshop-rollouts) ---"
kubectl get pods,svc,ingress -n smartshop-rollouts -o wide

echo ""
echo "--- 7. Zero-Trust Network Policies (namespace: smartshop) ---"
kubectl get networkpolicy -n smartshop

echo "=================================================================="
echo " [SmartShop] Status Report Complete."
echo "=================================================================="

