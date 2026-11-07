import { Activity, ExternalLink, GitBranch, Layers, Shield } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export function PlatformFooter() {
  const { setActiveTab, activeDeploymentSlot, activeRolloutStrategy } = usePlatformStore();

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              SS
            </div>
            <span className="font-extrabold text-base tracking-tight">
              SmartShop Cloud-Native Platform
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed">
            Enterprise e-commerce reference platform deployed on Kubernetes (Minikube v1.39 / K8s
            1.34) with Spring Boot 3.5 Hexagonal Architecture, PostgreSQL 17, Keycloak 26 OIDC,
            Prometheus/Grafana/Jaeger observability, ELK 9.x logging, and Kubecost FinOps.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md surface-card">
              <GitBranch className="w-3 h-3 text-blue-500" aria-hidden="true" />
              Active Slot: {activeDeploymentSlot}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md surface-card">
              <Layers className="w-3 h-3 text-indigo-400" aria-hidden="true" />
              Strategy: {activeRolloutStrategy}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md surface-card">
              <Shield className="w-3 h-3 text-emerald-500" aria-hidden="true" />
              NetworkPolicies: Enforced
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
            Platform Modules
          </h2>
          <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('landing')}
                className="hover:text-blue-500 cursor-pointer"
              >
                Cloud-Native Architecture
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="hover:text-blue-500 cursor-pointer"
              >
                Enterprise Hardware Catalog
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="hover:text-blue-500 cursor-pointer"
              >
                RED / USE & FinOps Dashboard
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="hover:text-blue-500 cursor-pointer"
              >
                Keycloak 26 OIDC Portal
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
            API & Telemetry Contracts
          </h2>
          <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-mono">
            <li className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span>/actuator/health (UP)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
              <span>/swagger-ui.html (OpenAPI 3)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <span>/actuator/prometheus</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
