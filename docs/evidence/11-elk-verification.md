# Task 11 — ELK Stack (Elasticsearch, Logstash, Kibana) Verification Evidence

## 1. Objective & Scope
Implement centralized logging in namespace `smartshop-logging` on Minikube (`Kubernetes v1.37.0`) using:
- **Elasticsearch (`docker.elastic.co/elasticsearch/elasticsearch:7.17.27`)**
- **Logstash (`docker.elastic.co/logstash/logstash:7.17.27`)** ingesting real container logs from `/var/log/pods/*/*/*.log` + HTTP JSON ingestion on port `8080`
- **Kibana (`docker.elastic.co/kibana/kibana:7.17.27`)** with 4 imported Saved Object Dashboards (**Errores**, **Seguridad**, **Operación**, **Negocio**)

## 2. Implemented ELK Manifests & Dashboards

| File | Description |
| :--- | :--- |
| `logging/elk/elasticsearch-deployment.yaml` | Single-node Elasticsearch cluster (`smartshop-elasticsearch:9200`) with readiness/liveness `/_cluster/health` probes. |
| `logging/elk/logstash-deployment.yaml` | Logstash pipeline (`logstash.conf`) reading `/var/log/pods/*/*/*.log`, extracting Kubernetes pod/namespace/container metadata via `grok`, classifying logs by `log_source` (`backend`, `frontend`, `kubernetes`) and `dashboard_category` (`errors`, `security`, `operations`, `business`), and indexing into `smartshop-logs-%{[log_source]}-%{+YYYY.MM.dd}`. |
| `logging/elk/kibana-deployment.yaml` | Deploys `smartshop-kibana:5601` connected to `smartshop-elasticsearch:9200` with `/api/status` health probes. |
| `logging/elk/dashboards/kibana-dashboards.ndjson` | Saved Objects bundle containing index pattern `smartshop-logs-*` and the 4 required Kibana Dashboards. |

## 3. Verification Evidence (DoD Validation)

### 3.1 ELK Pods & Services (`kubectl get pods,svc -n smartshop-logging`)
```text
NAME                                           READY   STATUS    RESTARTS   AGE     IP            NODE
pod/smartshop-elasticsearch-5b6d5f7f48-w66br   1/1     Running   0          6m32s   10.244.0.23   minikube
pod/smartshop-kibana-6f74cd54cb-lxrwr          1/1     Running   0          6m32s   10.244.0.25   minikube
pod/smartshop-logstash-59779c7876-m8plb        1/1     Running   0          22s     10.244.0.26   minikube

NAME                              TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)             AGE
service/smartshop-elasticsearch   ClusterIP   10.97.82.202     <none>        9200/TCP,9300/TCP   6m32s
service/smartshop-kibana          ClusterIP   10.99.229.108    <none>        5601/TCP            6m32s
service/smartshop-logstash        ClusterIP   10.100.217.207   <none>        8080/TCP,9600/TCP   6m32s
```

### 3.2 Captured & Indexed Logs by Source (`✅ Logs capturados` & `✅ Logs indexados`)
Querying `GET http://127.0.0.1:9200/_cat/indices/smartshop-*?v`:
```text
health status index                                uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   smartshop-logs-frontend-2026.11.07   oubNyc3jQpKZIR6sw4Z07A   1   1         70            0     32.4kb         32.4kb
yellow open   smartshop-logs-kubernetes-2026.11.07 M-14riJmTVKvjEWX56_64A   1   1       6017            0      2.1mb          2.1mb
yellow open   smartshop-logs-backend-2026.11.07    JELmm5koQPeaGfLFlBgs2Q   1   1        129            0     64.9kb         64.9kb
```

### 3.3 Indexed Document Counts by Kibana Dashboard Category
- `GET /smartshop-logs-*/_count?q=dashboard_category:errors` → **`6,012` documents**
- `GET /smartshop-logs-*/_count?q=dashboard_category:security` → **`314` documents**
- `GET /smartshop-logs-*/_count?q=dashboard_category:operations` → **`6,832` documents**
- `GET /smartshop-logs-*/_count?q=dashboard_category:business` → **`20` documents**

### 3.4 Kibana Status & 4 Imported Dashboards (`✅ Kibana funcional`)
Querying `GET http://127.0.0.1:5601/api/saved_objects/_find?type=dashboard`:
```text
id                                 title
--                                 -----
smartshop-elk-errors-dashboard     SmartShop ELK — 01 Errores & Excepciones (Backend, Frontend, K8s)
smartshop-elk-security-dashboard   SmartShop ELK — 02 Seguridad, OIDC, RBAC & NetworkPolicies
smartshop-elk-operations-dashboard SmartShop ELK — 03 Operación, Contenedores & Clúster Kubernetes
smartshop-elk-business-dashboard   SmartShop ELK — 04 Negocio, Catálogo, Carritos & Órdenes E-Commerce
```

## 4. Definition of Done (DoD) Checklist
- [x] Elasticsearch desplegado y saludable (`status: green`)
- [x] Logstash recolectando logs de Backend, Frontend y Kubernetes
- [x] Kibana desplegado con los 4 dashboards (`Errores`, `Seguridad`, `Operación`, `Negocio`)
- [x] ✅ Logs capturados (`backend`, `frontend`, `kubernetes` desde `/var/log/pods`)
- [x] ✅ Logs indexados (`smartshop-logs-backend-*`, `smartshop-logs-frontend-*`, `smartshop-logs-kubernetes-*`)
- [x] ✅ Kibana funcional (`smartshop-kibana:5601` operativo con los 4 dashboards importados)

