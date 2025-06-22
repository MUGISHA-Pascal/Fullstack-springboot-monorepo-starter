package com.starter.backend.controllers;

import com.starter.backend.dtos.DashboardStatsDto;
import com.starter.backend.payload.ApiResponse;
import com.starter.backend.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats/{userId}")
    public ResponseEntity<ApiResponse> getDashboardStats(@PathVariable UUID userId) {
        return ResponseEntity.ok(new ApiResponse(true, "Dashboard stats retrieved successfully", 
            dashboardService.getDashboardStats(userId)));
    }

    @GetMapping("/activity/{userId}")
    public ResponseEntity<ApiResponse> getRecentActivity(@PathVariable UUID userId) {
        return ResponseEntity.ok(new ApiResponse(true, "Recent activity retrieved successfully", 
            dashboardService.getRecentActivity(userId)));
    }
} 