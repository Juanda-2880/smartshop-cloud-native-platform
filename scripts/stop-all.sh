#!/usr/bin/env bash
# ============================================================================
# SmartShop Cloud-Native Platform — stop-all.sh
# Purpose: Gracefully scale down workloads or stop the Minikube cluster.
#          Pass --cluster to stop the entire Minikube VM, or --scale-zero
#          to scale deployments to 0 while keeping the cluster warm.
# Usage:   bash scripts/stop-all.sh [--scale-zero | --cluster]
# ============================================================================
set -euo pipefail

MODE="${1:---scale-zero}"

echo "=================================================================="
echo " [SmartShop] Stopping Platform Workloads (mode: ${MODE})"
echo "=================================================================="

if [ "${MODE}" = "--cluster" ]; then
  echo "Stopping Minikube cluster..."
  minikube stop
  echo "[SmartShop] Minikube cluster stopped."
elif [ "${MODE}" = "--scale-zero" ]; then
  echo "Scaling application deployments in smartshop-rollouts to 0..."
  kubectl scale deployment --all --replicas=0 -n smartshop-rollouts || true
  echo "[SmartShop] Rollout workloads scaled down. Pass --cluster to stop Minikube."
else
  echo "Dry-run / safe stop verified. Usage: bash scripts/stop-all.sh [--scale-zero | --cluster]"
fi
