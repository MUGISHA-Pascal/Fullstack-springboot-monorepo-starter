package com.starter.backend.controllers;

import com.starter.backend.dtos.SettingsDto;
import com.starter.backend.models.User;
import com.starter.backend.payload.ApiResponse;
import com.starter.backend.services.SettingsService;
import com.starter.backend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUserSettings(@PathVariable UUID userId) {
        return ResponseEntity.ok(new ApiResponse(true, "Settings retrieved successfully", settingsService.getUserSettings(userId)));
    }

    @PutMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> updateUserSettings(
            @PathVariable UUID userId,
            @Valid @RequestBody SettingsDto settingsDto) {
        return ResponseEntity.ok(new ApiResponse(true, "Settings updated successfully", settingsService.updateUserSettings(userId, settingsDto)));
    }

    @PutMapping("/user/{userId}/password")
    public ResponseEntity<ApiResponse> updatePassword(
            @PathVariable UUID userId,
            @Valid @RequestBody SettingsDto.PasswordUpdate passwordUpdate) {
        settingsService.updatePassword(userId, passwordUpdate);
        return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully"));
    }

    @PutMapping("/user/{userId}/notifications")
    public ResponseEntity<ApiResponse> updateNotificationSettings(
            @PathVariable UUID userId,
            @Valid @RequestBody SettingsDto.NotificationSettings notificationSettings) {
        return ResponseEntity.ok(new ApiResponse(true, "Notification settings updated successfully", 
            settingsService.updateNotificationSettings(userId, notificationSettings)));
    }

    @PutMapping("/user/{userId}/appearance")
    public ResponseEntity<ApiResponse> updateAppearanceSettings(
            @PathVariable UUID userId,
            @Valid @RequestBody SettingsDto.AppearanceSettings appearanceSettings) {
        return ResponseEntity.ok(new ApiResponse(true, "Appearance settings updated successfully", 
            settingsService.updateAppearanceSettings(userId, appearanceSettings)));
    }
} 