package com.starter.backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDto {
    private long totalProducts;
    private long totalUsers;
    private long totalFiles;
    private long lowStockProducts;
    private double productGrowth;
    private double userGrowth;
    private double fileGrowth;

    @Data
    @Builder
    public static class Activity {
        private String id;
        private String type;
        private String message;
        private String timestamp;
    }
} 