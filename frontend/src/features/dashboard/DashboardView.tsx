import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  DollarSign,
  GitBranch,
  Layers,
  PackageCheck,
  Server,
  ShoppingCart,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import type { OrderStatus, RolloutStrategy } from '../../types/ecommerce';
import { Button } from '../../components/atoms/Button';
import { StatusBadge } from '../../components/atoms/StatusBadge';

const ROLLOUT_STRATEGIES: { id: RolloutStrategy; label: string; desc: string }[] = [
  {
    id: 'BLUE_GREEN',
    label: 'Blue / Green',
    desc: 'Instant zero-downtime switch between active and preview Services.',
  },
  {
    id: 'CANARY',
    label: 'Canary (Argo Rollouts)',
    desc: 'Progressive traffic shifting (10% -> 50% -> 100%) with metric analysis.',
  },
  {
    id: 'ROLLING',
    label: 'Rolling Update',
    desc: 'Gradual pod replacement with maxSurge=1 and maxUnavailable=0.',
  },
  {
    id: 'RECREATE',
    label: 'Recreate',
    desc: 'Full termination of previous replica set prior to new deployment.',
  },
  {
    id: 'SHADOW',
    label: 'Shadow Mirroring',
    desc: 'Dark-launch asynchronous traffic duplication to v1.5 shadow service.',
  },
  {
    id: 'FEATURE_FLAGS',
    label: 'Feature Flags',
    desc: 'Runtime capability toggling without container redeployment.',
  },
];

export function DashboardView() {
  const {
    orders,
    products,
    cartItems,
    productsVisitedCount,
    activeDeploymentSlot,
    switchDeploymentSlot,
    activeRolloutStrategy,
    setRolloutStrategy,
    canaryWeight,
    setCanaryWeight,
    hpaReplicaCount,
    simulateHpaLoadSpike,
    featureFlags,
    toggleFeatureFlag,
    namespaceCosts,
    updateOrderStatus,
  } = usePlatformStore();

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const conversionRate =
    productsVisitedCount > 0 ? ((orders.length / productsVisitedCount) * 100).toFixed(2) : '0.00';
  const totalMonthlyCloudCost = namespaceCosts.reduce(
    (sum, ns) => sum + ns.cpuCostUsd + ns.ramCostUsd + ns.storageCostUsd,
    0,
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-semibold">
            Grafana Cloud + Kubecost + Argo Rollouts Executive Wall
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
            Executive Business, Observability & FinOps Console
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <StatusBadge label={`Active Slot: ${activeDeploymentSlot}`} tone="blue" />
          <StatusBadge label={`HPA Replicas: ${hpaReplicaCount}`} tone="emerald" />
          <StatusBadge
            label={`Monthly K8s Spend: $${totalMonthlyCloudCost.toFixed(2)}`}
            tone="indigo"
          />
        </div>
      </div>

      {/* Section 1: Business Metrics (Observability Requirements) */}
      <section aria-labelledby="business-kpi-heading" className="space-y-4">
        <h2
          id="business-kpi-heading"
          className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold"
        >
          1. Real-Time E-Commerce Business Telemetry (Micrometer / Prometheus)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="surface-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Gross Merchandise Value</span>
              <DollarSign className="w-4 h-4 text-emerald-500" aria-hidden="true" />
            </div>
            <p className="text-2xl font-extrabold font-mono">
              ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] font-mono text-emerald-500">+18.4% WoW</span>
          </div>

          <div className="surface-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Active Users (SSO)</span>
              <Users className="w-4 h-4 text-blue-500" aria-hidden="true" />
            </div>
            <p className="text-2xl font-extrabold font-mono">384</p>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              smartshop_active_users
            </span>
          </div>

          <div className="surface-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Products Visited</span>
              <Activity className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            </div>
            <p className="text-2xl font-extrabold font-mono">{productsVisitedCount}</p>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              smartshop_products_visited
            </span>
          </div>

          <div className="surface-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Active Carts / Items</span>
              <ShoppingCart className="w-4 h-4 text-amber-400" aria-hidden="true" />
            </div>
            <p className="text-2xl font-extrabold font-mono">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} units
            </p>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {products.length} SKUs in Catalog
            </span>
          </div>

          <div className="surface-card rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Conversion Rate & Orders</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="text-2xl font-extrabold font-mono">
              {conversionRate}% ({orders.length})
            </p>
            <span className="text-[11px] font-mono text-emerald-500">
              smartshop_orders_completed
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: RED & USE Observability + HPA Autoscaler */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 surface-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold">
                USE & RED Infrastructure / Cluster / Pod Telemetry
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Node CPU, RAM, Disk, Network, API Server, ETCD, and HTTP Latency percentiles
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={simulateHpaLoadSpike}>
              <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Simulate Load Spike (HPA)</span>
            </Button>
          </div>

          <div className="space-y-3.5 text-xs">
            {[
              {
                label: 'Node & Pod CPU Utilization (USE Model)',
                value: hpaReplicaCount > 3 ? '76%' : '42%',
                width: hpaReplicaCount > 3 ? '76%' : '42%',
                color: 'from-blue-500 to-cyan-400',
              },
              {
                label: 'Cluster Memory Allocation (Minikube 1.39)',
                value: '61% (4.9 GiB / 8.0 GiB)',
                width: '61%',
                color: 'from-indigo-500 to-purple-400',
              },
              {
                label: 'Persistent Volume Disk I/O (postgres-pvc)',
                value: '28% Saturation',
                width: '28%',
                color: 'from-emerald-500 to-teal-400',
              },
              {
                label: 'Network Ingress / Egress Throughput (CNI)',
                value: '340 Mbps (Zero-Trust Policy Active)',
                width: '48%',
                color: 'from-blue-600 to-indigo-400',
              },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-secondary)]">{metric.label}</span>
                  <span className="font-bold">{metric.value}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: metric.width }}
                    transition={{ duration: 0.4 }}
                    className={`h-full bg-gradient-to-r ${metric.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 rounded-xl surface-elevated">
              <span className="text-[10px] text-[var(--text-muted)] block">kube-apiserver</span>
              <span className="font-bold text-emerald-400">99.98% Healthy</span>
            </div>
            <div className="p-3 rounded-xl surface-elevated">
              <span className="text-[10px] text-[var(--text-muted)] block">etcd Raft Latency</span>
              <span className="font-bold text-blue-400">2.1 ms</span>
            </div>
            <div className="p-3 rounded-xl surface-elevated">
              <span className="text-[10px] text-[var(--text-muted)] block">Jaeger Traces</span>
              <span className="font-bold text-indigo-400">OTLP Active</span>
            </div>
          </div>
        </div>

        {/* Kubecost FinOps Panel */}
        <div className="lg:col-span-5 surface-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold">Kubecost FinOps Allocation</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Cost breakdown by Namespace, Deployment & Workload
              </p>
            </div>
            <Server className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            {namespaceCosts.map((ns) => {
              const totalNs = (ns.cpuCostUsd + ns.ramCostUsd + ns.storageCostUsd).toFixed(2);
              return (
                <div key={ns.namespace} className="p-3.5 rounded-xl surface-elevated space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-blue-400">ns/{ns.namespace}</span>
                    <span className="font-extrabold">${totalNs}/mo</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
                    <span>
                      CPU: ${ns.cpuCostUsd} • RAM: ${ns.ramCostUsd} • PVC: ${ns.storageCostUsd}
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      Eff: {ns.efficiencyScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">{ns.recommendation}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Progressive Delivery (Blue/Green, Canary, Rolling, Recreate, Shadow, Feature Flags) */}
      <section className="surface-card rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold">
              Progressive Delivery & Deployment Strategies Control Plane
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Argo Rollouts & Kubernetes deployment strategies with instant zero-downtime promotion
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={switchDeploymentSlot}>
            <GitBranch className="w-4 h-4" aria-hidden="true" />
            <span>Promote / Rollback Blue-Green ({activeDeploymentSlot})</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLLOUT_STRATEGIES.map((strategy) => {
            const active = activeRolloutStrategy === strategy.id;
            return (
              <button
                key={strategy.id}
                type="button"
                onClick={() => setRolloutStrategy(strategy.id)}
                className={`p-4 rounded-xl text-left cursor-pointer border transition-all ${
                  active
                    ? 'bg-blue-600/15 border-blue-500 text-[var(--text-primary)]'
                    : 'surface-elevated hover:border-blue-500/40 text-[var(--text-secondary)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                    {strategy.label}
                  </span>
                  {active && (
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">{strategy.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Canary Traffic Slider */}
          <div className="p-4 rounded-xl surface-elevated space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold">Canary Traffic Split Weight</span>
              <span className="text-blue-400 font-bold">
                Stable: {100 - canaryWeight}% / Canary: {canaryWeight}%
              </span>
            </div>
            <label htmlFor="canary-weight-slider" className="sr-only">
              Canary traffic percentage
            </label>
            <input
              id="canary-weight-slider"
              type="range"
              min={0}
              max={100}
              step={10}
              value={canaryWeight}
              onChange={(e) => setCanaryWeight(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Runtime Feature Flags */}
          <div className="p-4 rounded-xl surface-elevated space-y-2.5">
            <span className="text-xs font-bold font-mono block">Runtime Feature Flags</span>
            {featureFlags.map((flag) => (
              <div key={flag.key} className="flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold block">{flag.name}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">{flag.description}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={flag.enabled}
                  onClick={() => toggleFeatureFlag(flag.key)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-bold cursor-pointer transition-colors ${
                    flag.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-700/40 text-slate-400 border border-slate-600/40'
                  }`}
                >
                  {flag.enabled ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Recent Orders Management Table */}
      <section className="surface-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-500" aria-hidden="true" />
            <h2 className="text-base font-extrabold">Customer Orders & Fulfillment Pipeline</h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            {orders.length} Total Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-mono uppercase">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Shipping Destination</th>
                <th className="py-3 px-3">Total (USD)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-500/5">
                  <td className="py-3.5 px-3 font-mono font-bold text-blue-400">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    {order.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                  </td>
                  <td className="py-3.5 px-3 text-[var(--text-secondary)]">
                    {order.shippingAddress}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold">
                    ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <label htmlFor={`status-select-${order.id}`} className="sr-only">
                      Update status for order {order.orderNumber}
                    </label>
                    <select
                      id={`status-select-${order.id}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 rounded-lg surface-elevated font-mono text-xs cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lightweight CPU / Memory quick indicator */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-1">
        <span className="inline-flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
          Prometheus Scrape Interval: 15s • ELK 9 Logstash Pipeline: Healthy
        </span>
        <span>OpenTelemetry Collector: OTLP gRPC :4317</span>
      </div>
    </div>
  );
}
