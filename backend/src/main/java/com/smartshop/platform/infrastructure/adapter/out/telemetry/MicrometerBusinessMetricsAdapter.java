package com.smartshop.platform.infrastructure.adapter.out.telemetry;

import com.smartshop.platform.domain.port.out.BusinessMetricsPort;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Component;

@Component
public class MicrometerBusinessMetricsAdapter implements BusinessMetricsPort {

    private final Counter productsVisitedCounter;
    private final Counter cartsUpdatedCounter;
    private final Counter ordersCompletedCounter;
    private final AtomicLong activeUsersGauge = new AtomicLong(3L);

    public MicrometerBusinessMetricsAdapter(MeterRegistry meterRegistry) {
        this.productsVisitedCounter = Counter.builder("smartshop_products_visited_total")
                .description("Total number of product detail visits")
                .register(meterRegistry);
        this.cartsUpdatedCounter = Counter.builder("smartshop_carts_updated_total")
                .description("Total number of shopping cart modifications")
                .register(meterRegistry);
        this.ordersCompletedCounter = Counter.builder("smartshop_orders_completed_total")
                .description("Total number of completed e-commerce orders")
                .register(meterRegistry);

        Gauge.builder("smartshop_active_users", activeUsersGauge, AtomicLong::get)
                .description("Current number of active platform users")
                .register(meterRegistry);

        Gauge.builder("smartshop_conversion_rate", this, MicrometerBusinessMetricsAdapter::calculateConversionRate)
                .description("Ratio of completed orders to product visits")
                .register(meterRegistry);
    }

    @Override
    public void recordProductVisited() {
        productsVisitedCounter.increment();
    }

    @Override
    public void recordCartUpdated() {
        cartsUpdatedCounter.increment();
    }

    @Override
    public void recordOrderCompleted() {
        ordersCompletedCounter.increment();
    }

    @Override
    public void updateActiveUsersCount(long activeUsersCount) {
        activeUsersGauge.set(activeUsersCount);
    }

    private double calculateConversionRate() {
        double visits = productsVisitedCounter.count();
        if (visits <= 0.0) {
            return 0.0;
        }
        return (ordersCompletedCounter.count() / visits) * 100.0;
    }
}
