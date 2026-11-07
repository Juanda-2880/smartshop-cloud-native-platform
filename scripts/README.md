# SmartShop Cloud-Native Platform — Operational Scripts Guide

This directory contains the 6 enterprise operational scripts (`bash`) used to manage, inspect, validate, and benchmark the **SmartShop Cloud-Native Platform** on Kubernetes (Minikube).

## Scripts Inventory

| Script | Permission | Description | Usage |
| :--- | :---: | :--- | :--- |
| [`start-all.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/start-all.sh) | `755 (+x)` | Starts Minikube (if not running), enables `ingress` and `metrics-server`, and reconciles all Kubernetes manifests across all 5 namespaces. | `bash scripts/start-all.sh` |
| [`stop-all.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/stop-all.sh) | `755 (+x)` | Gracefully scales down rollout workloads (`--scale-zero`, default) or stops the Minikube cluster (`--cluster`). | `bash scripts/stop-all.sh [--scale-zero \| --cluster]` |
| [`restart-all.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/restart-all.sh) | `755 (+x)` | Reconciles all manifests via `start-all.sh` and performs a zero-downtime rolling restart of the active deployment. | `bash scripts/restart-all.sh` |
| [`status.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/status.sh) | `755 (+x)` | Prints a structured report of all Namespaces, Pods, Services, Ingresses, PVCs, HPAs, and NetworkPolicies. | `bash scripts/status.sh` |
| [`validate.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/validate.sh) | `755 (+x)` | Runs 17 automated end-to-end health, readiness, security, observability, logging, FinOps, HPA, and Blue-Green checks. Returns exit code `0` when 100% pass. | `bash scripts/validate.sh` |
| [`benchmark.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/benchmark.sh) | `755 (+x)` | Executes sequential HTTP reliability and latency benchmarks against Frontend `/healthz`, Backend `/api/v1/products`, and Blue-Green `smartshop-active-service`. | `bash scripts/benchmark.sh [ITERATIONS]` |
| [`forward-dashboards.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/forward-dashboards.sh) | `755 (+x)` | Starts `kubectl port-forward` tunnels for all Observability, ELK, and FinOps Dashboards (Grafana, Kibana, Kubecost, Prometheus, Alertmanager, Jaeger, Elasticsearch) and prints URLs & credentials. | `bash scripts/forward-dashboards.sh` |
| [`forward-app.sh`](file:///c:/Users/juand/Documents/Plataformas%20II/SmartShop/smartshop-cloud-native-platform/scripts/forward-app.sh) | `755 (+x)` | Starts `kubectl port-forward` tunnels for the SmartShop Web Page, Backend API/Swagger, Blue-Green slots, PostgreSQL, and all Dashboards, printing all URLs & RBAC credentials. | `bash scripts/forward-app.sh` |

