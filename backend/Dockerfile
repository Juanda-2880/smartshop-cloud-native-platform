# ============================================================================
# SmartShop Cloud-Native Platform — Backend Multi-Stage Dockerfile
# Stage 1: Build Spring Boot 3.5 + Java 21 LTS application
# Stage 2: Minimal JRE 21 Alpine non-root runtime with Actuator Healthcheck
# ============================================================================

FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

COPY pom.xml ./
RUN mvn dependency:go-offline -B

COPY src/ src/
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine AS runtime
LABEL org.opencontainers.image.title="smartshop-backend" \
      org.opencontainers.image.description="SmartShop Spring Boot 3.5 Hexagonal Backend" \
      org.opencontainers.image.version="1.0.0"

WORKDIR /app

RUN addgroup -S smartshop && adduser -S smartshop -G smartshop \
    && mkdir -p /app/data && chown -R smartshop:smartshop /app

COPY --from=builder --chown=smartshop:smartshop /workspace/target/*.jar /app/app.jar

USER smartshop

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0" \
    SERVER_PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8080/actuator/health/readiness || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
