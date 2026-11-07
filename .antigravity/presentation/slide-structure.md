# Slide Structure

# SmartShop Cloud Native Platform

# CloudSight Consulting Group Audit

Total Slides: 35
Target Duration: 20-25 Minutes

---

# Slide 1 - Cover

Title:
Cloud Native Observability, Security & FinOps Assessment

Subtitle:
SmartShop Cloud Native Platform

Owner:
Juan

Goal:
Captar la atención inmediatamente.

Visual:
Hero visual con una arquitectura moderna Kubernetes.
Dashboard integrado en segundo plano.
Indicadores de disponibilidad, costos y seguridad.

Message:
Las empresas modernas necesitan más que infraestructura; necesitan visibilidad, seguridad y control financiero.

---

# Slide 2 - The Business Problem

Owner:
Juan

Goal:
Introducir la problemática.

Visual:
Gráfico de crecimiento de usuarios vs complejidad operativa.

Mostrar:

- Incremento de usuarios
- Incremento de tráfico
- Incremento de costos
- Incremento de riesgos

Business Insight:

Más tráfico implica más complejidad.

Pregunta detonante:

¿Cómo garantizamos disponibilidad, seguridad y control de costos?

---

# Slide 3 - Consulting Team

Owner:
Juan

Visual:

Fotos del equipo.

Juan David Pacheco Vargas
CloudOps Engineer Junior

Angela
Cybersecurity Engineer Junior

Incluir:

- responsabilidades
- especialidades
- áreas lideradas

---

# Slide 4 - Engagement Scope

Owner:
Juan

Goal:
Mostrar qué se auditó.

Visual:
Roadmap tipo consulting project.

Items:

- Kubernetes
- Seguridad
- Observabilidad
- FinOps
- Logging
- Escalabilidad
- Blue Green Deployment

---

# Slide 5 - Executive Summary

Owner:
Juan

Visual:
4 KPI Cards

Disponibilidad
Seguridad
Observabilidad
Costos

Mensaje:

La plataforma fue diseñada para escalar, proteger información crítica y optimizar recursos.

---

# Slide 6 - SmartShop Platform Overview

Owner:
Juan

Visual:
Vista funcional del e-commerce.

Componentes:

- Usuarios
- Productos
- Carrito
- Pedidos
- Administración

Objetivo:

Entender qué protege y monitorea la plataforma.

---

# Slide 7 - High Level Architecture

Owner:
Juan

Visual:

Diagrama simplificado.

Frontend
Backend
PostgreSQL
Keycloak
Prometheus
Grafana
ELK
Kubecost
Kubernetes

---

# Slide 8 - Why Kubernetes

Owner:
Juan

Visual:
Comparativa

Traditional Infrastructure
vs
Kubernetes

Comparar:

- Escalabilidad
- Recuperación
- Automatización
- Disponibilidad

---

# Slide 9 - Kubernetes Cluster Architecture

Owner:
Juan

Visual:

Cluster Diagram

Node
Pods
Services
Ingress

Explicar flujo completo.

---

# Slide 10 - Storage Architecture

Owner:
Juan

Topic:
PVC

Visual:

PostgreSQL + PVC

Explicar:

Qué ocurriría sin persistencia.

Business Value:

Protección de datos.

---

# Slide 11 - Security Strategy

Owner:
Angela

Visual:

Seguridad como capas.

- Usuarios
- Aplicación
- Kubernetes
- Red
- Datos

Introducir:

Defense in Depth

---

# Slide 12 - Identity Management

Owner:
Angela

Topic:

Keycloak

Visual:

Flujo SSO

Usuario
Keycloak
Backend
Frontend

Conceptos:

OAuth2
OIDC
SSO

---

# Slide 13 - Role Based Access Control

Owner:
Angela

Visual:

RBAC Matrix

Roles:

Admin
Manager
Customer

Explicar:

Principio de mínimo privilegio.

---

# Slide 14 - Network Policies

Owner:
Angela

Visual:

Tráfico permitido
vs
Tráfico bloqueado

Mostrar:

Pods
Namespaces
Reglas

Business Impact:

Reducción de superficie de ataque.

---

# Slide 15 - Security Risk Analysis

Owner:
Angela

Visual:

Risk Matrix

Columnas:

Amenaza
Impacto
Probabilidad
Mitigación

Ejemplos:

- Credential Theft
- Data Leakage
- Unauthorized Access

---

# Slide 16 - Why Observability Matters

Owner:
Juan

Visual:

Observability Pyramid

Capas:

Infrastructure
Cluster
Application
Business

Mensaje:

No se puede operar lo que no se puede observar.

---

# Slide 17 - USE Methodology

Owner:
Juan

Visual:

Diagrama USE

Utilization
Saturation
Errors

Explicar:

Cómo ayuda a identificar problemas.

---

# Slide 18 - RED Methodology

Owner:
Juan

Visual:

RED Diagram

Rate
Errors
Duration

Aplicado a SmartShop.

---

# Slide 19 - Prometheus Architecture

Owner:
Juan

Visual:

Prometheus Architecture

Mostrar:

Nodes
Pods
Exporters
Metrics Server
Prometheus

---

# Slide 20 - Grafana Dashboards

Owner:
Juan

Visual:

Capturas reales del dashboard.

Mostrar:

- CPU
- Memoria
- Red
- Pods

---

# Slide 21 - Infrastructure Metrics

Owner:
Juan

Visual:

Panel ejecutivo.

Métricas:

CPU
RAM
Disk
Network

Business Insight:

Mantener estabilidad del servicio.

---

# Slide 22 - Kubernetes Metrics

Owner:
Juan

Visual:

Dashboard Cluster Health.

Mostrar:

- Nodes
- Pods
- Deployments
- Services

---

# Slide 23 - Business Metrics

Owner:
Juan

Visual:

KPIs de negocio.

Ejemplos:

Usuarios Activos

Productos Vistos

Compras

Conversión

Ingresos

---

# Slide 24 - ELK Overview

Owner:
Juan

Visual:

Elastic
Logstash
Kibana

Mostrar pipeline completo.

---

# Slide 25 - Log Pipeline

Owner:
Juan

Visual:

Log Flow Diagram

Application
Logstash
Elastic
Kibana

Business Value:

Investigación rápida de incidentes.

---

# Slide 26 - Kubecost Overview

Owner:
Juan

Visual:

Kubecost Dashboard

Mostrar:

Namespaces
Deployments
Workloads

---

# Slide 27 - FinOps Analysis

Owner:
Juan

Visual:

Dashboard Financiero

Métricas:

CPU Cost
Memory Cost
Storage Cost
Network Cost

Mensaje:

La observabilidad también debe ser financiera.

---

# Slide 28 - Cloud Cost Comparison

Owner:
Juan

Visual:

Comparativo

AWS
Azure
GCP
On-Premise

Mostrar:

CAPEX
OPEX

Costo mensual estimado.

Usar:

Bar Charts
Radar Charts

---

# Slide 29 - HPA Overview

Owner:
Juan

Visual:

Escalamiento dinámico.

Mostrar:

1 Pod
3 Pods
5 Pods

según carga.

---

# Slide 30 - HPA Results

Owner:
Juan

Visual:

Gráfica de carga.

Usuarios
vs
Pods

Mostrar:

Scale Out
Scale In

Beneficios:

Eficiencia operativa.

---

# Slide 31 - Blue Green Deployment

Owner:
Juan

Visual:

Blue
Green

Traffic Routing Diagram

Mostrar:

Switch de tráfico.

---

# Slide 32 - Why Blue Green

Owner:
Juan

Visual:

Comparison Table

Rolling
Recreate
Blue Green

Evaluar:

Downtime
Rollback
Risk
Complexity

Justificar la selección.

---

# Slide 33 - Results & Findings

Owner:
Juan

Visual:

Executive Scorecard

Disponibilidad

Seguridad

Observabilidad

Costos

Escalabilidad

---

# Slide 34 - Future Roadmap

Owner:
Angela y Juan

Visual:

Roadmap Timeline

Futuras mejoras:

- Tracing
- GitOps
- Multi Cluster
- DR Strategy
- Security Automation

---

# Slide 35 - Conclusions & Questions

Owners:
Juan + Angela

Visual:

Minimalista

Resumen:

La auditoría demuestra que la plataforma:

- Escala correctamente
- Está protegida
- Es observable
- Tiene gobernanza financiera

Mensaje final:

La combinación de Kubernetes, Observabilidad, FinOps y Seguridad permite construir plataformas sostenibles, resilientes y preparadas para crecer.

Pantalla final:

Questions?
