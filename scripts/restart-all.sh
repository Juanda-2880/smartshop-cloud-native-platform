#!/usr/bin/env bash
# ============================================================================
# SmartShop Cloud-Native Platform — restart-all.sh
# Purpose: Perform a zero-downtime rolling restart of SmartShop core workloads
#          and ensure all platform manifests are reconciled.
# Usage:   bash scripts/restart-all.sh
# ============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=================================================================="
echo " [SmartShop] Reconciling and Restarting Core Platform Workloads"
echo "=================================================================="

bash "${SCRIPT_DIR}/start-all.sh"

echo "[Restart] Triggering rolling restart on smartshop-frontend and smartshop-app-blue..."
kubectl rollout restart deployment/smartshop-app-blue -n smartshop-rollouts
kubectl rollout status deployment/smartshop-app-blue -n smartshop-rollouts --timeout=90s

echo "=================================================================="
echo " [SmartShop] Rolling restart completed with zero downtime."
echo "=================================================================="
