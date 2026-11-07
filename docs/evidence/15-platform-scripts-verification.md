# Task 15 — Operational Platform Scripts Verification Evidence

## 1. Objective & Scope

Implement, document, and verify the 6 operational platform scripts in `scripts/` (`start-all.sh`, `stop-all.sh`, `restart-all.sh`, `status.sh`, `validate.sh`, `benchmark.sh`) with executable permissions (`100755`) and LF line endings enforced via `.gitattributes`.

## 2. Implemented Scripts & Documentation

| File                     |   Mode   | Description                                                                                                                                           |
| :----------------------- | :------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/start-all.sh`   | `100755` | Idempotently starts Minikube, enables addons, and reconciles all platform manifests across all 5 namespaces.                                          |
| `scripts/stop-all.sh`    | `100755` | Scales down workloads (`--scale-zero`) or stops the Minikube VM (`--cluster`).                                                                        |
| `scripts/restart-all.sh` | `100755` | Reconciles manifests and performs a zero-downtime rolling restart.                                                                                    |
| `scripts/status.sh`      | `100755` | Displays health and resource status across `smartshop`, `smartshop-observability`, `smartshop-logging`, `smartshop-finops`, and `smartshop-rollouts`. |
| `scripts/validate.sh`    | `100755` | Runs 17 automated end-to-end checks verifying every platform component and DoD.                                                                       |
| `scripts/benchmark.sh`   | `100755` | Runs sequential HTTP performance and reliability benchmarks across Frontend, Backend API, and Blue-Green services.                                    |
| `scripts/README.md`      | `100644` | Complete operational runbook and command reference for `scripts/`.                                                                                    |
| `.gitattributes`         | `100644` | Enforces `*.sh text eol=lf` across Windows, Linux, and macOS.                                                                                         |

## 3. Verification Evidence (DoD Validation)

### 3.1 `scripts/validate.sh` Execution Output (`17 PASSED | 0 FAILED`)

```text
==================================================================
 [SmartShop] Automated End-to-End Platform Validation Suite
==================================================================
 [PASS] 01. Namespace smartshop active
 [PASS] 02. Frontend pods Ready in smartshop
 [PASS] 03. Backend pods Ready in smartshop
 [PASS] 04. PostgreSQL pod Ready in smartshop
 [PASS] 05. PersistentVolumeClaim smartshop-postgres-pvc Bound
 [PASS] 06. Zero-Trust NetworkPolicies deployed (8 policies)
 [PASS] 07. Allowed traffic Frontend -> Backend Actuator Health UP
 [PASS] 08. OIDC Discovery & JWKS endpoint active on Backend
 [PASS] 09. Prometheus Ready in smartshop-observability
 [PASS] 10. Grafana Ready & 4+ Dashboards provisioned
 [PASS] 11. Alertmanager Ready in smartshop-observability
 [PASS] 12. Elasticsearch Ready in smartshop-logging
 [PASS] 13. Logstash Ready in smartshop-logging
 [PASS] 14. Kibana Ready in smartshop-logging
 [PASS] 15. Kubecost FinOps Ready in smartshop-finops
 [PASS] 16. HPA configured for Backend & Frontend (min=2, max=10)
 [PASS] 17. Blue-Green Environments Ready in smartshop-rollouts
==================================================================
 Validation Summary: 17 PASSED | 0 FAILED
==================================================================
```

### 3.2 `scripts/benchmark.sh` Execution Output (`0% Error Rate`)

```text
==================================================================
 [SmartShop] Cloud-Native Performance & Reliability Benchmark
 Iterations per target: 10
==================================================================

[1/3] Benchmarking Frontend SPA Health Endpoint (/healthz)...
  -> Frontend Results: Total=10 | HTTP_200=10 | Errors=0 | Elapsed=0s

[2/3] Benchmarking Backend Catalog API (/api/v1/products)...
  -> Backend API Results: Total=10 | HTTP_200=10 | Errors=0 | Elapsed=3s

[3/3] Benchmarking Blue-Green Production Service (smartshop-active-service)...
  -> Blue-Green Service Results: Total=10 | HTTP_200=10 | Errors=0 | Elapsed=1s
==================================================================
 [SmartShop] Benchmark Completed Successfully (0% Error Rate).
==================================================================
```

## 4. Definition of Done (DoD) Checklist

- [x] ✅ Scripts ejecutables (`100755` permisos Git y terminaciones `LF` vía `.gitattributes`)
- [x] ✅ Scripts documentados (`scripts/README.md`, docblocks en cada script y `docs/evidence/15-platform-scripts-verification.md`)
- [x] ✅ Scripts funcionales (`validate.sh` `17/17 PASS`, `benchmark.sh` `0% errors`, `status.sh` verificados en vivo)
