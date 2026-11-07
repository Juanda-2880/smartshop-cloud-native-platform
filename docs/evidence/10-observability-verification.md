# Task 10 — Full-Stack Observability (Prometheus, Grafana, Alertmanager, RED & USE) Verification Evidence

## 1. Objective & Scope
Implement end-to-end observability in namespace `smartshop-observability` on Minikube (`Kubernetes v1.37.0`) covering:
- **Prometheus (`prom/prometheus:v3.2.1`)** + **Node Exporter (`v1.9.0`)** + **Kube-State-Metrics (`v2.15.0`)**
- **Grafana (`grafana/grafana:11.5.2`)** with 4 auto-provisioned dashboards separated by category
- **Alertmanager (`prom/alertmanager:v0.28.0`)** receiving active alerts
- **Jaeger & OpenTelemetry OTLP (`jaegertracing/all-in-one:1.66.0`)**
- **USE Model (Utilization, Saturation, Errors)** & **RED Model (Rate, Errors, Duration)**

## 2. Implemented Manifests & Dashboards

| File | Description |
| :--- | :--- |
| `observability/prometheus/prometheus-config.yaml` | RBAC (`ClusterRole`, `ClusterRoleBinding`, `ServiceAccount`), `prometheus.yml` scrape jobs (`smartshop-backend`, `node-exporter`, `kube-state-metrics`, `kubernetes-apiservers`, `kubernetes-cadvisor`), and `alert_rules.yml` (USE, RED, Kubernetes, and Business alert rules). |
| `observability/prometheus/prometheus-deployment.yaml` | Deploys `smartshop-prometheus`, `smartshop-node-exporter` (DaemonSet), and `smartshop-kube-state-metrics`. |
| `observability/alertmanager/alertmanager-deployment.yaml` | Deploys `smartshop-alertmanager` with routing by `alertname`, `category`, and `severity`. |
| `observability/grafana/grafana-deployment.yaml` | Deploys `smartshop-grafana` with provisioned `Prometheus` and `Alertmanager` datasources and automatic dashboard loader. |
| `observability/grafana/dashboards/01-infrastructure-use-dashboard.json` | **Category 1 — Infrastructure & USE Model**: CPU Utilization %, RAM Utilization %, Disk Utilization %, CPU Load Saturation, Network RX/TX Throughput, Network Interface Errors & Drops. |
| `observability/grafana/dashboards/02-kubernetes-cluster-dashboard.json` | **Category 2 — Kubernetes Cluster & Workloads**: Nodes Ready, Active Namespaces, Running Pods, Available Deployments, Services, Pods by Namespace, Deployment Replicas. |
| `observability/grafana/dashboards/03-application-red-dashboard.json` | **Category 3 — Application & RED Model**: Total HTTP Requests, RED Rate (Throughput req/s), RED Errors (HTTP 5xx Error Rate %), RED Duration (Mean & Max Latency ms by Endpoint). |
| `observability/grafana/dashboards/04-business-kpis-dashboard.json` | **Category 4 — Business KPIs**: Usuarios Activos (`smartshop_active_users`), Productos Visualizados (`smartshop_products_visited_total`), Carritos Creados (`smartshop_carts_updated_total`), Compras Realizadas (`smartshop_orders_completed_total`), Tasa de Conversión (`smartshop_conversion_rate`). |
| `observability/jaeger/jaeger-otel-deployment.yaml` | Deploys `smartshop-jaeger` with OTLP gRPC (`4317`) and HTTP (`4318`) receivers enabled. |

## 3. Verification Evidence (DoD Validation)

### 3.1 Observability Pods & Services (`kubectl get pods,svc -n smartshop-observability`)
```text
NAME                                                READY   STATUS    RESTARTS   AGE   IP            NODE
pod/smartshop-alertmanager-55c4bfc965-278m5         1/1     Running   0          51s   10.244.0.17   minikube
pod/smartshop-grafana-5984d744f4-s58xf              1/1     Running   0          51s   10.244.0.21   minikube
pod/smartshop-jaeger-6bf5666fbb-zx949               1/1     Running   0          51s   10.244.0.22   minikube
pod/smartshop-kube-state-metrics-76bdcf8577-kwj44   1/1     Running   0          51s   10.244.0.20   minikube
pod/smartshop-node-exporter-jjnj8                   1/1     Running   0          51s   10.244.0.19   minikube
pod/smartshop-prometheus-5f689cd7dd-9lhc8           1/1     Running   0          51s   10.244.0.18   minikube
```

### 3.2 Prometheus Active Targets (`✅ Prometheus operativo`)
All 7 scrape targets across Infrastructure, Kubernetes, and Application/Business are `up`:
```text
job                   health scrapeUrl
---                   ------ ---------
kube-state-metrics    up     http://smartshop-kube-state-metrics.smartshop-observability.svc.cluster.local:8080/metrics
kubernetes-apiservers up     https://192.168.49.2:8443/metrics
kubernetes-cadvisor   up     https://kubernetes.default.svc:443/api/v1/nodes/minikube/proxy/metrics/cadvisor
node-exporter         up     http://smartshop-node-exporter.smartshop-observability.svc.cluster.local:9100/metrics
prometheus            up     http://127.0.0.1:9090/metrics
smartshop-backend     up     http://10.244.0.14:8080/actuator/prometheus
smartshop-backend     up     http://10.244.0.13:8080/actuator/prometheus
```

### 3.3 Grafana Health & 4 Category Dashboards (`✅ Grafana operativo` & `✅ Dashboards visibles`)
- `GET http://127.0.0.1:3000/api/health` → `{"database":"ok","version":"11.5.2"}`
- `GET http://127.0.0.1:3000/api/search`:
  1. `uid: "smartshop-infra-use"` — **SmartShop — 01 Infrastructure & USE Model (CPU, RAM, Disk, Network)**
  2. `uid: "smartshop-k8s-cluster"` — **SmartShop — 02 Kubernetes Cluster & Workloads (Pods, Nodes, Deployments, Services, Namespaces)**
  3. `uid: "smartshop-app-red"` — **SmartShop — 03 Application & RED Model (Requests, Latency, Throughput, Error Rate)**
  4. `uid: "smartshop-business-kpis"` — **SmartShop — 04 Business KPIs (Active Users, Products Visited, Carts, Orders, Conversions)**

### 3.4 Prometheus & Alertmanager Active Alerts (`✅ Alertas funcionando`)
- `GET http://127.0.0.1:9090/api/v1/alerts`:
  - `SmartShopObservabilityWatchdog` (`category=observability`, `state=firing`)
  - `LowEcommerceConversionRateNotice` (`category=business`, `state=firing`)
- `GET http://127.0.0.1:9093/api/v2/alerts`:
  - Confirmed `LowEcommerceConversionRateNotice` and `SmartShopObservabilityWatchdog` received and `active` in Alertmanager.

## 4. Definition of Done (DoD) Checklist
- [x] ✅ Prometheus operativo (`7/7` targets `up`)
- [x] ✅ Grafana operativo (`v11.5.2`, `database: ok`, datasources `Prometheus` y `Alertmanager` aprovisionados)
- [x] ✅ Dashboards visibles (`4` dashboards separados por categoría en la carpeta `SmartShop Cloud-Native`)
- [x] ✅ Alertas funcionando (reglas USE, RED, Kubernetes y Negocio evaluándose en Prometheus y entregadas a Alertmanager)

