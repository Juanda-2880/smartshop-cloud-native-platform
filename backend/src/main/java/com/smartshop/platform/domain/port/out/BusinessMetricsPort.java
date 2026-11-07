package com.smartshop.platform.domain.port.out;

public interface BusinessMetricsPort {

    void recordProductVisited();

    void recordCartUpdated();

    void recordOrderCompleted();

    void updateActiveUsersCount(long activeUsersCount);
}
