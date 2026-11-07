# ============================================================================
# SmartShop Cloud-Native Platform — Frontend Multi-Stage Dockerfile
# Stage 1: Build React 19 + TypeScript + Vite 7 SPA with Node 24 LTS
# Stage 2: Serve static bundle via Nginx Alpine with Healthcheck
# ============================================================================

FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
LABEL org.opencontainers.image.title="smartshop-frontend" \
      org.opencontainers.image.description="SmartShop React 19 + Vite 7 Enterprise Frontend" \
      org.opencontainers.image.version="1.0.0"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

