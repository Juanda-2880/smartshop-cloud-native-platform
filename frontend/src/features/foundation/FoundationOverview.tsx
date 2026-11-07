interface StackModule {
  title: string;
  description: string;
}

const CORE_MODULES: StackModule[] = [
  {
    title: 'Frontend Architecture',
    description: 'React 19, TypeScript 5, Vite, Feature-Based & Atomic Design structure.',
  },
  {
    title: 'Backend Architecture',
    description: 'Java 21 LTS, Spring Boot 3.5, Hexagonal Architecture, OpenAPI 3 & Actuator.',
  },
  {
    title: 'Cloud-Native Runtime',
    description: 'Kubernetes (Minikube v1.39), NGINX Ingress, HPA, PV/PVC & NetworkPolicies.',
  },
  {
    title: 'Observability, Logging & FinOps',
    description: 'Prometheus, Grafana, Jaeger, OpenTelemetry, ELK 9.x & Kubecost.',
  },
];

export function FoundationOverview() {
  return (
    <main>
      <section className="hero-card">
        <h1 className="hero-title">Enterprise Cloud-Native Commerce</h1>
        <p className="hero-subtitle">
          High-resilience e-commerce platform engineered with Hexagonal Architecture, Zero-Trust
          Kubernetes networking, SSO authentication, progressive delivery, and full-stack
          observability.
        </p>
      </section>

      <section className="stack-grid" aria-label="Platform capabilities">
        {CORE_MODULES.map((moduleItem) => (
          <article key={moduleItem.title} className="stack-card">
            <h3>{moduleItem.title}</h3>
            <p>{moduleItem.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
