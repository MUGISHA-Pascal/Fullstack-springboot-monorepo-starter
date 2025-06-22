package com.starter.backend.services;

import com.starter.backend.dtos.DashboardStatsDto;
import com.starter.backend.exceptions.ResourceNotFoundException;
import com.starter.backend.models.User;
import com.starter.backend.repository.ProductRepository;
import com.starter.backend.repository.FileRepository;
import com.starter.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FileRepository fileRepository;

    public DashboardStatsDto getDashboardStats(UUID userId) {
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        // Get real counts from repositories
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();
        long totalFiles = fileRepository.count();
        long lowStockProducts = productRepository.countByQuantityLessThan(10);

        // Calculate growth percentages (this is a simplified calculation)
        // In a real application, you would compare with previous month's data
        double productGrowth = 0.0; // TODO: Implement real growth calculation
        double userGrowth = 0.0;    // TODO: Implement real growth calculation
        double fileGrowth = 0.0;    // TODO: Implement real growth calculation

        return DashboardStatsDto.builder()
                .totalProducts((int) totalProducts)
                .totalUsers((int) totalUsers)
                .totalFiles((int) totalFiles)
                .lowStockProducts((int) lowStockProducts)
                .productGrowth(productGrowth)
                .userGrowth(userGrowth)
                .fileGrowth(fileGrowth)
                .build();
    }

    public List<DashboardStatsDto.Activity> getRecentActivity(UUID userId) {
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        List<DashboardStatsDto.Activity> activities = new ArrayList<>();

        // TODO: Implement real activity tracking
        // For now, return some sample activities
        activities.add(DashboardStatsDto.Activity.builder()
                .id("1")
                .type("product")
                .message("New product added")
                .timestamp(LocalDateTime.now().minusHours(2).toString())
                .build());

        activities.add(DashboardStatsDto.Activity.builder()
                .id("2")
                .type("user")
                .message("New user registered")
                .timestamp(LocalDateTime.now().minusHours(4).toString())
                .build());

        activities.add(DashboardStatsDto.Activity.builder()
                .id("3")
                .type("inventory")
                .message("Low stock alert")
                .timestamp(LocalDateTime.now().minusHours(6).toString())
                .build());

        return activities;
    }
} 