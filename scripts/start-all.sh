#!/usr/bin/env bash
# ============================================================================
# SmartShop Cloud-Native Platform — start-all.sh
# Purpose: Idempotently start Minikube, build/load OCI images if needed,
#          and apply all Kubernetes manifests across all platform namespaces.
# Usage:   bash scripts/start-all.sh
# ============================================================================
set -euo pipefail

echo "=================================================================="
echo " [SmartShop] Starting Cloud-Native Platform Stack"
echo "=================================================================="

if ! minikube status >/dev/null 2>&1; then
  echo "[1/6] Starting Minikube cluster..."
  minikube start --driver=docker --cpus=4 --memory=6144
  minikube addons enable ingress
  minikube addons enable metrics-server
else
  echo "[1/6] Minikube cluster is already running."
fi

echo "[2/6] Applying Namespaces, ConfigMaps, Secrets & Persistent Storage..."
kubectl apply -f k8s/namespaces/
kubectl apply -f k8s/configmaps/ -f k8s/secrets/ -f k8s/pvc/

echo "[3/6] Applying Core Services, Deployments, Ingress, NetworkPolicies & HPA..."
kubectl apply -f k8s/services/ -f k8s/deployments/ -f k8s/ingress/
kubectl apply -f k8s/network-policies/
kubectl apply -f k8s/hpa/

echo "[4/6] Applying Observability Stack (Prometheus, Grafana, Alertmanager, Jaeger)..."
kubectl apply -f observability/alertmanager/ -f observability/prometheus/
kubectl apply -f observability/grafana/grafana-dashboards-configmap.yaml -f observability/grafana/grafana-deployment.yaml
kubectl apply -f observability/jaeger/

echo "[5/6] Applying ELK Stack & Kubecost FinOps..."
kubectl apply -f logging/elk/elasticsearch-deployment.yaml -f logging/elk/logstash-deployment.yaml -f logging/elk/kibana-deployment.yaml
kubectl apply -f cost-management/kubecost/

echo "[6/6] Applying Progressive Delivery & Blue-Green Stack..."
kubectl apply -f rollout/blue-green/ -f rollout/argo-rollouts/argo-rollout-strategies.yaml

echo "=================================================================="
echo " [SmartShop] All manifests applied successfully."
echo "=================================================================="

