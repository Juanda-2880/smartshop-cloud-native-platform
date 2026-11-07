import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Cpu,
  DollarSign,
  GitBranch,
  Layers,
  Lock,
  Network,
  Server,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Button } from '../../components/atoms/Button';
import { StatusBadge } from '../../components/atoms/StatusBadge';
import { ProductCard } from '../../components/molecules/ProductCard';

const ARCHITECTURE_PILLARS = [
  {
    icon: Layers,
    badge: 'Spring Boot 3.5 • Java 21',
    title: 'Hexagonal Backend & OpenAPI 3',
    description:
      'Pure domain model isolated via Inbound/Outbound Ports, MapStruct mappers, Flyway migrations, and RFC 7807 ProblemDetail error contracts.',
    metric: '100% Domain Isolation',
  },
  {
    icon: GitBranch,
    badge: 'Argo Rollouts • Zero Downtime',
    title: 'Progressive Delivery & Blue/Green',
    description:
      'Instant Blue/Green traffic switching, weighted Canary rollouts, Shadow traffic mirroring, and runtime Feature Flags.',
    metric: '0ms Cutover Loss',
  },
  {
    icon: Activity,
    badge: 'Prometheus • Grafana • Jaeger',
    title: 'RED & USE Full-Stack Observability',
    description:
      'Real-time cluster, node, pod, network, application, and e-commerce conversion metrics with OpenTelemetry distributed tracing.',
    metric: 'P95 Latency < 19ms',
  },
  {
    icon: Terminal,
    badge: 'ELK 9.x • Logstash • Kibana',
    title: 'Centralized Structured Logging',
    description:
      'JSON structured application and Kubernetes audit logs ingested via Logstash, indexed in Elasticsearch 9, and visualized in Kibana.',
    metric: '14.2k logs/min',
  },
  {
    icon: Lock,
    badge: 'Keycloak 26 • OAuth2 / OIDC',
    title: 'Enterprise Federated SSO & RBAC',
    description:
      'Fine-grained role-based access control (ADMIN, MANAGER, CUSTOMER) backed by PKCE flows and Zero-Trust Kubernetes NetworkPolicies.',
    metric: '3 RBAC Personas',
  },
  {
    icon: DollarSign,
    badge: 'Kubecost • HPA Autoscaling',
    title: 'Cloud FinOps & Dynamic HPA',
    description:
      'Granular cost visibility per Namespace, Deployment, and Workload paired with CPU/Memory Horizontal Pod Autoscaling.',
    metric: '91% Cluster Efficiency',
  },
];

export function LandingView() {
  const {
    products,
    addToCart,
    setActiveTab,
    activeDeploymentSlot,
    switchDeploymentSlot,
    hpaReplicaCount,
    simulateHpaLoadSpike,
    orders,
  } = usePlatformStore();

  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="space-y-16">
      {/* Vercel / Stripe / Linear Inspired Hero */}
      <section className="relative overflow-hidden rounded-3xl surface-card bg-architectural-grid p-6 sm:p-10 lg:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-28 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-28 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge label={`Active Environment: ${activeDeploymentSlot} Slot`} tone="blue" />
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold surface-elevated text-[var(--text-secondary)]">
                Kubernetes 1.34 • Minikube v1.39
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-[var(--text-primary)]"
            >
              Cloud-Native Commerce Engineered for{' '}
              <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Zero-Downtime Scale
              </span>
            </motion.h1>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              SmartShop unifies enterprise e-commerce with production-grade Kubernetes
              orchestration. Experience Hexagonal Spring Boot 3.5 APIs, Keycloak 26 SSO, RED/USE
              Grafana telemetry, ELK 9 centralized logging, Kubecost FinOps, and instant Blue/Green
              rollouts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="accent" size="lg" onClick={() => setActiveTab('products')}>
                <span>Explore Cloud Hardware</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => setActiveTab('dashboard')}>
                <Activity className="w-4 h-4 text-blue-500" aria-hidden="true" />
                <span>Open Executive & SRE Console</span>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--border-subtle)]">
              <div>
                <span className="block text-xs text-[var(--text-muted)]">Availability SLA</span>
                <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-500">
                  99.99%
                </span>
              </div>
              <div>
                <span className="block text-xs text-[var(--text-muted)]">Active K8s Replicas</span>
                <span className="text-lg sm:text-xl font-extrabold font-mono text-blue-500">
                  {hpaReplicaCount} / 8 HPA
                </span>
              </div>
              <div>
                <span className="block text-xs text-[var(--text-muted)]">Platform GMV</span>
                <span className="text-lg sm:text-xl font-extrabold font-mono text-[var(--text-primary)]">
                  ${totalRevenue.toLocaleString('en-US')}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Grafana Cloud / Kubernetes Control Card */}
          <div className="lg:col-span-5">
            <div className="surface-elevated rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-500" aria-hidden="true" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider">
                    Live Cluster Telemetry (RED / USE)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">● Healthy</span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl surface-card">
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    Throughput (Rate)
                  </span>
                  <span className="text-base font-bold text-[var(--text-primary)]">
                    428.6 req/s
                  </span>
                  <span className="text-[11px] text-emerald-500 block">+12.4% vs 1h ago</span>
                </div>
                <div className="p-3 rounded-xl surface-card">
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    Error Rate (5xx)
                  </span>
                  <span className="text-base font-bold text-emerald-500">0.02%</span>
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    SLO Target &lt; 0.50%
                  </span>
                </div>
                <div className="p-3 rounded-xl surface-card">
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    PostgreSQL 17 PVC
                  </span>
                  <span className="text-base font-bold text-blue-400">Bound (10Gi)</span>
                  <span className="text-[11px] text-[var(--text-muted)] block">Flyway v2 Sync</span>
                </div>
                <div className="p-3 rounded-xl surface-card">
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    NetworkPolicies
                  </span>
                  <span className="text-base font-bold text-indigo-400">Ingress/Egress</span>
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    Zero-Trust Active
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)] font-medium">
                    HPA CPU Target Utilization
                  </span>
                  <span className="font-mono font-semibold text-blue-400">
                    {hpaReplicaCount > 3 ? '76% (Scaling Up)' : '44% (Nominal)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: '44%' }}
                    animate={{ width: hpaReplicaCount > 3 ? '76%' : '44%' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={switchDeploymentSlot}
                  className="flex-1"
                >
                  <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Switch Blue/Green ({activeDeploymentSlot})</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={simulateHpaLoadSpike}
                  className="flex-1"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  <span>Trigger HPA Benchmark</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cloud-Native Products Preview */}
      <section aria-labelledby="featured-catalog-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-semibold">
              Production Infrastructure Catalog
            </span>
            <h2
              id="featured-catalog-heading"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1"
            >
              Featured Cloud & Telemetry Hardware
            </h2>
          </div>
          <Button variant="outline" size="md" onClick={() => setActiveTab('products')}>
            <span>View Full Catalog ({products.length} items)</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(selected) => addToCart(selected, 1)}
            />
          ))}
        </div>
      </section>

      {/* Bento Grid: 6 Cloud-Native Architecture Pillars */}
      <section aria-labelledby="architecture-pillars-heading" className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Enterprise Reference Blueprint
          </span>
          <h2
            id="architecture-pillars-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1"
          >
            Full-Stack Cloud-Native Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARCHITECTURE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                whileHover={{ y: -3 }}
                className="surface-card rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-blue-500/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/25 flex items-center justify-center text-blue-500">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full surface-elevated text-[var(--text-secondary)]">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{pillar.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)]">Verified Metric</span>
                  <span className="text-emerald-500 font-bold">{pillar.metric}</span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Bottom Enterprise CTA */}
      <section className="surface-elevated rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-400">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Keycloak 26 SSO • Kubecost FinOps • Argo Rollouts Ready</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Inspect Real-Time RED/USE Metrics & Progressive Rollouts
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Switch between ADMIN, MANAGER, and CUSTOMER OIDC roles or simulate Blue/Green and Canary
            deployments directly from the Executive Console.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg" onClick={() => setActiveTab('dashboard')}>
            <Cpu className="w-4 h-4" aria-hidden="true" />
            <span>Launch Executive Console</span>
          </Button>
          <Button variant="outline" size="lg" onClick={() => setActiveTab('login')}>
            <Network className="w-4 h-4" aria-hidden="true" />
            <span>Configure OIDC Session</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
