# Task 07 — Kubernetes Base (Minikube) Verification Evidence

## 1. Objective & Scope
Deploy the **SmartShop Cloud-Native Platform** core stack (`smartshop-postgres`, `smartshop-backend`, `smartshop-frontend`) on a local **Minikube** (`Kubernetes v1.37.0`) cluster with isolated `Namespace`, `ConfigMap`, `Secret`, `Deployment`, `Service`, and `Ingress` (`ingress-nginx`) resources.

## 2. Implemented Kubernetes Manifests

| Directory / File | Resource Kind | Description |
| :--- | :--- | :--- |
| `k8s/namespaces/smartshop-namespaces.yaml` | `Namespace` | Creates `smartshop`, `smartshop-observability`, `smartshop-logging`, `smartshop-finops`, and `smartshop-rollouts`. |
| `k8s/configmaps/smartshop-configmap.yaml` | `ConfigMap` | Centralizes non-sensitive runtime settings (`SPRING_PROFILES_ACTIVE=postgres`, `POSTGRES_HOST=smartshop-postgres`, `POSTGRES_DB=smartshop`, `KEYCLOAK_ISSUER_URI`, `VITE_API_BASE_URL`). |
| `k8s/secrets/smartshop-secret.yaml` | `Secret` | Stores sensitive credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`, `JWT_SECRET_SALT`). |
| `k8s/deployments/postgres-deployment.yaml` | `Deployment` | Deploys `postgres:17-alpine` (`1/1` replica) with readiness/liveness `pg_isready` probes and CPU/Memory requests & limits. |
| `k8s/deployments/backend-deployment.yaml` | `Deployment` | Deploys `smartshop-backend:1.0.0` (`2/2` replicas) with Prometheus scrape annotations and Actuator readiness/liveness HTTP probes. |
| `k8s/deployments/frontend-deployment.yaml` | `Deployment` | Deploys `smartshop-frontend:1.0.0` (`2/2` replicas) with `/healthz` readiness/liveness HTTP probes. |
| `k8s/services/postgres-service.yaml` | `Service` | `ClusterIP` service exposing PostgreSQL on port `5432`. |
| `k8s/services/backend-service.yaml` | `Service` | `ClusterIP` service exposing Spring Boot API & Actuator on port `8080`. |
| `k8s/services/frontend-service.yaml` | `Service` | `ClusterIP` service exposing Nginx SPA on port `80`. |
| `k8s/ingress/smartshop-ingress.yaml` | `Ingress` | `ingressClassName: nginx` routing `/api` and `/actuator` to `smartshop-backend:8080` and `/` to `smartshop-frontend:80` for `smartshop.local`. |

## 3. Verification Evidence (DoD Validation)

### 3.1 Cluster & Namespace Verification (`kubectl get ns`)
```text
NAME                      STATUS   AGE
default                   Active   2m10s
ingress-nginx             Active   99s
kube-node-lease           Active   2m10s
kube-public               Active   2m10s
kube-system               Active   2m10s
smartshop                 Active   47s
smartshop-finops          Active   47s
smartshop-logging         Active   47s
smartshop-observability   Active   47s
smartshop-rollouts        Active   47s
```

### 3.2 Pods, Services, ConfigMaps, Secrets & Endpoints (`kubectl get pods,svc,ep,cm,secret -n smartshop`)
```text
NAME                                      READY   STATUS    RESTARTS   AGE   IP            NODE
pod/smartshop-backend-64f66fb94f-7bb84    1/1     Running   0          46s   10.244.0.7    minikube
pod/smartshop-backend-64f66fb94f-hr9df    1/1     Running   0          46s   10.244.0.9    minikube
pod/smartshop-frontend-9c7cc894b-2svph    1/1     Running   0          46s   10.244.0.10   minikube
pod/smartshop-frontend-9c7cc894b-m87rr    1/1     Running   0          46s   10.244.0.8    minikube
pod/smartshop-postgres-847f75656c-mdvkp   1/1     Running   0          46s   10.244.0.11   minikube

NAME                         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE   SELECTOR
service/smartshop-backend    ClusterIP   10.96.33.204    <none>        8080/TCP   47s   app=smartshop-backend
service/smartshop-frontend   ClusterIP   10.98.190.137   <none>        80/TCP     47s   app=smartshop-frontend
service/smartshop-postgres   ClusterIP   10.100.202.96   <none>        5432/TCP   47s   app=smartshop-postgres

NAME                           ENDPOINTS                         AGE
endpoints/smartshop-backend    10.244.0.7:8080,10.244.0.9:8080   47s
endpoints/smartshop-frontend   10.244.0.10:80,10.244.0.8:80      47s
endpoints/smartshop-postgres   10.244.0.11:5432                  47s

NAME                         DATA   AGE
configmap/smartshop-config   7      47s

NAME                      TYPE     DATA   AGE
secret/smartshop-secret   Opaque   5      47s
```

### 3.3 Ingress Controller & End-to-End Routing Verification
- **Frontend via NGINX Ingress (`Host: smartshop.local`, `GET /healthz`)**:
  ```json
  {"status":"UP","service":"smartshop-frontend"}
  ```
- **Backend Actuator via NGINX Ingress (`Host: smartshop.local`, `GET /actuator/health`)**:
  ```json
  {
    "status": "UP",
    "groups": ["liveness", "readiness"],
    "components": {
      "db": {
        "status": "UP",
        "details": { "database": "PostgreSQL", "validationQuery": "isValid()" }
      }
    }
  }
  ```
- **Catalog API via NGINX Ingress (`Host: smartshop.local`, `GET /api/v1/categories`)**:
  Returned all `4` Flyway-seeded enterprise categories from `smartshop-postgres`.

## 4. Definition of Done (DoD) Checklist
- [x] `Namespace` (`k8s/namespaces/smartshop-namespaces.yaml`)
- [x] `Deployment` (`k8s/deployments/postgres-deployment.yaml`, `backend-deployment.yaml`, `frontend-deployment.yaml`)
- [x] `Service` (`k8s/services/postgres-service.yaml`, `backend-service.yaml`, `frontend-service.yaml`)
- [x] `Ingress` (`k8s/ingress/smartshop-ingress.yaml`)
- [x] `ConfigMap` (`k8s/configmaps/smartshop-configmap.yaml`)
- [x] `Secret` (`k8s/secrets/smartshop-secret.yaml`)
- [x] ✅ Pods Running (`5/5` pods `1/1 Running` en `smartshop`)
- [x] ✅ Services funcionales (`ClusterIP` + `EndpointSlice` activos para `postgres`, `backend`, `frontend`)
- [x] ✅ Ingress funcional (`smartshop-ingress` enrutando `/`, `/api` y `/actuator` a través de `ingress-nginx-controller`)
