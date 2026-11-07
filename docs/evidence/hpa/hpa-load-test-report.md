# Horizontal Pod Autoscaler (HPA) Load Test Report — Scale Out & Scale In

## 1. HPA Specification (`k8s/hpa/smartshop-hpa.yaml`)
- **API Version**: `autoscaling/v2`
- **Minimum Replicas (`minReplicas`)**: `2 Pods`
- **Maximum Replicas (`maxReplicas`)**: `10 Pods`
- **Configured Metrics**:
  - **CPU Utilization Target**: `70%` (`averageUtilization: 70`)
  - **Memory (RAM) Utilization Target**: `80%` (`averageUtilization: 80`)

## 2. Scale Out Test Evidence (`2 -> 6 -> 9 Pods`)
During sustained CPU stress (`159m` and `129m` on `50m` requested CPU = `288%` average utilization > `70%` target):
- `smartshop-frontend-hpa` reported `TARGETS: cpu: 288%/70%, memory: 23%/80%`.
- The HPA controller emitted two consecutive `SuccessfulRescale` events:
  - `New size: 6; reason: cpu resource utilization (percentage of request) above target`
  - `New size: 9; reason: cpu resource utilization (percentage of request) above target`
- All `9` replicas transitioned to `1/1 Running` (`docs/evidence/hpa/scale-out-snapshot.txt`).

## 3. Scale In Test Evidence (`9 -> 8 -> 7 -> 6 -> 2 Pods`)
Once the stress load finished:
- CPU utilization returned to `2% (1m) / 70%` and Memory remained at `23% (15634Ki) / 80%`.
- Following the `stabilizationWindowSeconds: 15` policy, the HPA controller scaled down smoothly back to `minReplicas: 2`:
  - `New size: 8; reason: All metrics below target`
  - `New size: 7; reason: All metrics below target`
  - `New size: 6; reason: All metrics below target`
  - `New size: 2; reason: All metrics below target`
- Final steady state verified at `2/2` pods `1/1 Running` (`docs/evidence/hpa/scale-in-snapshot.txt`).

