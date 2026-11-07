# Task 09 — Zero-Trust Kubernetes Network Policies Verification Evidence

## 1. Objective & Scope
Implement Zero-Trust micro-segmentation (`Ingress` and `Egress` `NetworkPolicy` resources) in the `smartshop` namespace on Minikube (`Kubernetes v1.37.0`) enforced at the packet level via `registry.k8s.io/networking/kube-network-policies:v0.7.0`.

## 2. Implemented Network Policy Manifests

| File | Policy Name(s) | Policy Types | Description |
| :--- | :--- | :--- | :--- |
| `k8s/network-policies/00-network-policy-enforcer.yaml` | `kube-network-policies` (DaemonSet) | Kernel NFQueue Enforcer | Official Kubernetes SIG-Network controller enforcing L3/L4 `NetworkPolicy` rules on `kindnet` CNI. |
| `k8s/network-policies/default-deny-all.yaml` | `default-deny-all`, `allow-dns-egress` | `Ingress`, `Egress` | Default Zero-Trust deny-all baseline for all pods in `smartshop` + explicit UDP/TCP port `53` DNS resolution to `kube-system`. |
| `k8s/network-policies/ingress-policies.yaml` | `frontend-ingress-policy`, `backend-ingress-policy`, `postgres-ingress-policy` | `Ingress` | Restricts inbound connections: `frontend:80` from `ingress-nginx`, `backend:8080` from `ingress-nginx` & `smartshop-frontend`, and `postgres:5432` **exclusively** from `smartshop-backend`. |
| `k8s/network-policies/egress-policies.yaml` | `frontend-egress-policy`, `backend-egress-policy`, `authorized-client-egress-policy` | `Egress` | Restricts outbound connections: `smartshop-frontend` can only reach `smartshop-backend:8080`; `smartshop-backend` can only reach `smartshop-postgres:5432` and telemetry namespaces. |

## 3. Verification Evidence (DoD Validation)

### 3.1 Active NetworkPolicies in Cluster (`kubectl get networkpolicy -n smartshop`)
```text
NAME                              POD-SELECTOR             AGE
allow-dns-egress                  <none>                   5s
authorized-client-egress-policy   role=authorized-client   5s
backend-egress-policy             app=smartshop-backend    5s
backend-ingress-policy            app=smartshop-backend    5s
default-deny-all                  <none>                   5s
frontend-egress-policy            app=smartshop-frontend   5s
frontend-ingress-policy           app=smartshop-frontend   5s
postgres-ingress-policy           app=smartshop-postgres   5s
```

### 3.2 Allowed Traffic Verification (`✅ Tráfico permitido funciona`)
1. **Frontend Pod → Backend Service (`8080/TCP`)**:
   ```powershell
   kubectl exec -n smartshop deploy/smartshop-frontend -- wget -qO- -T 3 http://smartshop-backend:8080/actuator/health/readiness
   # Output: {"status":"UP"}
   ```
2. **NGINX Ingress Controller → Backend Service → PostgreSQL (`5432/TCP`)**:
   ```powershell
   kubectl exec -n ingress-nginx deploy/ingress-nginx-controller -- wget -qO- -T 3 --header="Host: smartshop.local" http://127.0.0.1/actuator/health
   # Output: {"status":"UP","groups":["liveness","readiness"],"components":{"db":{"status":"UP","details":{"database":"PostgreSQL","validationQuery":"isValid()"}}}}
   ```

### 3.3 Unauthorized Traffic Blocked (`✅ Tráfico no permitido bloqueado`)
1. **Frontend Pod attempting direct connection to PostgreSQL (`5432/TCP`)**:
   ```powershell
   kubectl exec -n smartshop deploy/smartshop-frontend -- nc -zv -w 3 smartshop-postgres 5432
   # Output: nc: smartshop-postgres (10.100.202.96:5432): Operation timed out (ExitCode: 1)
   ```
2. **Kernel NFQueue Enforcer Audit Log (`kubectl logs -n kube-system ds/kube-network-policies`)**:
   ```text
   I1107 20:27:05.628020 1 controller.go:525] "Evaluating packet" packet=< [9] 10.244.0.10:42207 10.244.0.16:5432 TCP >
   I1107 20:27:05.628084 1 networkpolicy.go:218] "Pod is not allowed to connect to port" pod="smartshop/smartshop-frontend-9c7cc894b-2svph" port=5432
   I1107 20:27:05.628182 1 controller.go:555] "Egress NetworkPolicies" id=9 npolicies=4 allowed=false
   I1107 20:27:05.628252 1 controller.go:458] "Finished syncing packet" id=9 duration="285.589µs" verdict="drop"
   ```

## 4. Definition of Done (DoD) Checklist
- [x] `Ingress Policy` (`k8s/network-policies/ingress-policies.yaml`)
- [x] `Egress Policy` (`k8s/network-policies/egress-policies.yaml`, `default-deny-all.yaml`)
- [x] ✅ Tráfico permitido funciona (`ingress-nginx → frontend/backend`, `frontend → backend:8080`, `backend → postgres:5432`)
- [x] ✅ Tráfico no permitido bloqueado (`frontend → postgres:5432` bloqueado con `verdict="drop"` y `Operation timed out`)
- [x] ✅ Evidencia documentada (`docs/evidence/09-network-policies-verification.md`)
