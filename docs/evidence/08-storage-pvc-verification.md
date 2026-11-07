# Task 08 — Persistent Storage (PV & PVC) Verification Evidence

## 1. Objective & Scope
Implement persistent storage in Kubernetes (`Minikube v1.39.0 / Kubernetes v1.37.0`) for **PostgreSQL 17** (`smartshop-postgres`) using an explicit `PersistentVolume` (`smartshop-postgres-pv`) and `PersistentVolumeClaim` (`smartshop-postgres-pvc`), and verify data survival across complete pod termination and recreation.

## 2. Implemented Kubernetes Storage Manifests

| File | Resource Kind | Description |
| :--- | :--- | :--- |
| `k8s/pvc/postgres-pv.yaml` | `PersistentVolume` | Provision `2Gi` volume `smartshop-postgres-pv` with `ReadWriteOnce` access mode, `Retain` reclaim policy, `storageClassName: standard`, and `hostPath: /data/smartshop-postgres`. |
| `k8s/pvc/postgres-pvc.yaml` | `PersistentVolumeClaim` | Requests `2Gi` `ReadWriteOnce` storage (`smartshop-postgres-pvc`) in namespace `smartshop` bound to `smartshop-postgres-pv`. |
| `k8s/deployments/postgres-deployment.yaml` | `Deployment` | Updates `smartshop-postgres` deployment strategy to `Recreate` and mounts `persistentVolumeClaim.claimName: smartshop-postgres-pvc` at `/var/lib/postgresql/data`. |

## 3. Verification Evidence (DoD Validation)

### 3.1 PV & PVC Binding (`kubectl get pv,pvc -n smartshop`)
```text
NAME                                     CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                              STORAGECLASS   AGE
persistentvolume/smartshop-postgres-pv   2Gi        RWO            Retain           Bound    smartshop/smartshop-postgres-pvc   standard       99s

NAME                                           STATUS   VOLUME                  CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/smartshop-postgres-pvc   Bound    smartshop-postgres-pv   2Gi        RWO            standard       99s
```

### 3.2 Data Persistence Across Pod Restart (`kubectl rollout restart deployment/smartshop-postgres -n smartshop`)
1. **Write Transaction Before Pod Termination**:
   ```sql
   INSERT INTO categories (id, name, slug, description, active)
   VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Persistent Storage Arrays', 'persistent-storage-arrays', 'Enterprise NVMe-oF persistent storage SAN arrays verified with Kubernetes PVC', TRUE);
   -- Output: INSERT 0 1
   ```
2. **Pod Termination & Recreation**:
   - Old pod `smartshop-postgres-5b98677bf9-htkt8` terminated.
   - New pod `smartshop-postgres-86f66bf94b-dj858` created and reached `1/1 Running` (`deployment "smartshop-postgres" successfully rolled out`).
3. **Query After Pod Recreation**:
   ```text
                     id                  |           name            |           slug            
   --------------------------------------+---------------------------+---------------------------
    aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1 | Cloud Edge Hardware       | cloud-edge-hardware
    aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2 | Developer Workstations    | developer-workstations
    aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3 | Zero-Trust Security       | zero-trust-security
    aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4 | Telemetry & Networking    | telemetry-networking
    aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5 | Persistent Storage Arrays | persistent-storage-arrays
   (5 rows)
   ```

## 4. Definition of Done (DoD) Checklist
- [x] `PersistentVolume` creado (`k8s/pvc/postgres-pv.yaml`)
- [x] `PersistentVolumeClaim` creado (`k8s/pvc/postgres-pvc.yaml`)
- [x] Aplicado a PostgreSQL (`k8s/deployments/postgres-deployment.yaml`)
- [x] ✅ Datos persisten (`5` filas conservadas en `categories` tras recrear el pod de PostgreSQL)
- [x] ✅ Reinicio exitoso (`deployment "smartshop-postgres" successfully rolled out`, pod `1/1 Running`)
- [x] ✅ PVC Bound (`smartshop-postgres-pvc` en estado `Bound` sobre `smartshop-postgres-pv`)

