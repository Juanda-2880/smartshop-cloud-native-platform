# Task 13 — Horizontal Pod Autoscaler (HPA) Verification Evidence

## 1. Objective & Scope
Implement `HorizontalPodAutoscaler` (`autoscaling/v2`) in namespace `smartshop` on Minikube (`Kubernetes v1.37.0`) with:
- **Minimum Replicas**: `2 Pods`
- **Maximum Replicas**: `10 Pods`
- **Metrics**: **CPU `70%`** and **RAM `80%`**
- **Load Test Evidence**: Captured in `docs/evidence/hpa/` (`scale-out-snapshot.txt`, `scale-in-snapshot.txt`, `hpa-load-test-report.md`)

## 2. Implemented HPA Manifests & Evidence Files

| File | Description |
| :--- | :--- |
| `k8s/hpa/smartshop-hpa.yaml` | Defines `smartshop-backend-hpa` and `smartshop-frontend-hpa` (`minReplicas: 2`, `maxReplicas: 10`, CPU `70%`, Memory `80%`, `scaleUp`/`scaleDown` behavior policies). |
| `docs/evidence/hpa/scale-out-snapshot.txt` | Raw `kubectl top pods`, `kubectl get hpa`, and `kubectl get pods` output showing Scale Out to `9` pods at `288%/70%` CPU. |
| `docs/evidence/hpa/scale-in-snapshot.txt` | Raw `kubectl get hpa` and `kubectl describe hpa` output showing Scale In back to `2` pods at `2%/70%` CPU. |
| `docs/evidence/hpa/hpa-load-test-report.md` | Technical analysis of the Scale Out (`2 → 6 → 9`) and Scale In (`9 → 8 → 7 → 6 → 2`) transitions. |

## 3. Verification Summary (DoD Validation)
- **✅ Escala arriba (Scale Out)**: Verified live transition `2 → 6 → 9` pods (`1/1 Running`) when CPU hit `288%/70%`.
- **✅ Escala abajo (Scale In)**: Verified live transition `9 → 8 → 7 → 6 → 2` pods when CPU returned to `2%/70%` and Memory remained at `23%/80%`.
- **✅ Evidencia capturada**: Stored in `docs/evidence/hpa/` and `docs/evidence/13-hpa-verification.md`.

