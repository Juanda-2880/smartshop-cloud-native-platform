# Task 14 — Enterprise Blue-Green Deployment & Progressive Delivery Verification Evidence

## 1. Objective & Scope
Implement and verify an enterprise **Blue-Green Deployment** strategy (alongside Canary, Shadow, RollingUpdate, Recreate, and Feature Flags) in namespace `smartshop-rollouts` on Minikube (`Kubernetes v1.37.0`), demonstrating live version promotion (`1.0.0-blue -> 2.0.0-green`), zero downtime (`100%` HTTP `200 OK`), and immediate atomic rollback (`2.0.0-green -> 1.0.0-blue`).

## 2. Implemented Manifests & Documentation

| File | Description |
| :--- | :--- |
| `rollout/blue-green/blue-deployment.yaml` | Deploys stable `smartshop-app-blue` (`2/2` replicas, `version: 1.0.0-blue`). |
| `rollout/blue-green/green-deployment.yaml` | Deploys candidate `smartshop-app-green` (`2/2` replicas, `version: 2.0.0-green`). |
| `rollout/blue-green/services-and-ingress.yaml` | Defines `smartshop-active-service`, `smartshop-preview-service`, `smartshop-blue-service`, `smartshop-green-service`, and `smartshop-bluegreen-ingress`. |
| `rollout/argo-rollouts/argo-rollout-strategies.yaml` | Defines Canary (`20%` weight), Shadow mirroring (`mirror-target`), and Feature Flags (`smartshop-feature-flags`). |
| `rollout/argo-rollouts/argo-rollout-crd-spec.yaml` | Declarative `argoproj.io/v1alpha1` `Rollout` specifications for Blue-Green and Canary. |
| `docs/blue-green.md` | Full technical & business documentation with Mermaid architecture and sequence diagrams. |
| `docs/evidence/blue-green/*` | 5 snapshots & logs capturing Blue active, Green active, Switch, Rollback, and Zero-Downtime benchmark. |

## 3. Definition of Done (DoD) Checklist
- [x] ✅ Blue activa (`2/2` pods `1/1 Running`, `1.0.0-blue` sirviendo tráfico productivo)
- [x] ✅ Green activa (`2/2` pods `1/1 Running`, `2.0.0-green` validada en `smartshop-preview-service`)
- [x] ✅ Switch exitoso (`smartshop-active-service` conmutado a `slot=green`, sirviendo `2.0.0-green`)
- [x] ✅ Rollback exitoso (`smartshop-active-service` revertido a `slot=blue`, restaurando `1.0.0-blue`)
- [x] ✅ Sin interrupción del servicio (`30/30` peticiones HTTP `200 OK`, `0` fallos, `0 ms` downtime)
