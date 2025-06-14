package com.starter.backend.services;

import com.starter.backend.dtos.SettingsDto;
import com.starter.backend.enums.ERoleType;
import com.starter.backend.exceptions.ApiRequestException;
import com.starter.backend.exceptions.ResourceNotFoundException;
import com.starter.backend.models.AppearanceSettings;
import com.starter.backend.models.NotificationSettings;
import com.starter.backend.models.User;
import com.starter.backend.models.Role;
import com.starter.backend.repository.AppearanceSettingsRepository;
import com.starter.backend.repository.NotificationSettingsRepository;
import com.starter.backend.repository.UserRepository;
import com.starter.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.HashSet;
import java.util.Set;

@Service
public class SettingsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;

    @Autowired
    private AppearanceSettingsRepository appearanceSettingsRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    public SettingsDto getUserSettings(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        SettingsDto settings = new SettingsDto();
        settings.setEmail(user.getEmail());
        settings.setFirstName(user.getFirstName());
        settings.setLastName(user.getLastName());
        settings.setMobile(user.getMobile());
        settings.setGender(user.getGender());
        settings.setStatus(user.getStatus());
        settings.setRole(user.getRoles().stream()
                .map(role -> role.getName())
                .toArray(ERoleType[]::new));

        // Get notification settings
        NotificationSettings notificationSettings = notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    NotificationSettings newSettings = new NotificationSettings();
                    newSettings.setUser(user);
                    return notificationSettingsRepository.save(newSettings);
                });

        SettingsDto.NotificationSettings dtoNotificationSettings = new SettingsDto.NotificationSettings();
        dtoNotificationSettings.setEmailNotifications(notificationSettings.isEmailNotifications());
        dtoNotificationSettings.setLowStockAlerts(notificationSettings.isLowStockAlerts());
        dtoNotificationSettings.setNewUserRegistrations(notificationSettings.isNewUserRegistrations());
        dtoNotificationSettings.setSystemUpdates(notificationSettings.isSystemUpdates());
        settings.setNotificationSettings(dtoNotificationSettings);

        // Get appearance settings
        AppearanceSettings appearanceSettings = appearanceSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    AppearanceSettings newSettings = new AppearanceSettings();
                    newSettings.setUser(user);
                    return appearanceSettingsRepository.save(newSettings);
                });

        SettingsDto.AppearanceSettings dtoAppearanceSettings = new SettingsDto.AppearanceSettings();
        dtoAppearanceSettings.setTheme(appearanceSettings.getTheme().name().toLowerCase());
        dtoAppearanceSettings.setDensity(appearanceSettings.getDensity().name().toLowerCase());
        settings.setAppearanceSettings(dtoAppearanceSettings);

        return settings;
    }

    public SettingsDto updateUserSettings(UUID userId, SettingsDto settingsDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        // Check if email is already in use by another user
        if (!settingsDto.getEmail().equals(user.getEmail()) && 
            userRepository.findByEmail(settingsDto.getEmail()).isPresent()) {
            throw new ApiRequestException("Email is already in use");
        }

        // Check if mobile number is already in use by another user
        if (!settingsDto.getMobile().equals(user.getMobile()) && 
            userRepository.existsByMobile(settingsDto.getMobile())) {
            throw new ApiRequestException("Mobile number is already in use");
        }

        user.setEmail(settingsDto.getEmail());
        user.setFirstName(settingsDto.getFirstName());
        user.setLastName(settingsDto.getLastName());
        user.setMobile(settingsDto.getMobile());
        user.setGender(settingsDto.getGender());
        user.setStatus(settingsDto.getStatus());

        // Update user role
        if (settingsDto.getRole() != null && settingsDto.getRole().length > 0) {
            Role role = roleRepository.findByName(settingsDto.getRole()[0])
                    .orElseThrow(() -> new ApiRequestException("Role " + settingsDto.getRole()[0] + " not found"));
            user.setRoles(new HashSet<>(Set.of(role)));
        }

        userRepository.save(user);
        return getUserSettings(userId);
    }

    public void updatePassword(UUID userId, SettingsDto.PasswordUpdate passwordUpdate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        if (!passwordEncoder.matches(passwordUpdate.getCurrentPassword(), user.getPassword())) {
            throw new ApiRequestException("Current password is incorrect");
        }

        if (!passwordUpdate.getNewPassword().equals(passwordUpdate.getConfirmPassword())) {
            throw new ApiRequestException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(passwordUpdate.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public SettingsDto.NotificationSettings updateNotificationSettings(UUID userId, SettingsDto.NotificationSettings notificationSettings) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        NotificationSettings settings = notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    NotificationSettings newSettings = new NotificationSettings();
                    newSettings.setUser(user);
                    return newSettings;
                });

        settings.setEmailNotifications(notificationSettings.isEmailNotifications());
        settings.setLowStockAlerts(notificationSettings.isLowStockAlerts());
        settings.setNewUserRegistrations(notificationSettings.isNewUserRegistrations());
        settings.setSystemUpdates(notificationSettings.isSystemUpdates());

        NotificationSettings savedSettings = notificationSettingsRepository.save(settings);

        SettingsDto.NotificationSettings dtoSettings = new SettingsDto.NotificationSettings();
        dtoSettings.setEmailNotifications(savedSettings.isEmailNotifications());
        dtoSettings.setLowStockAlerts(savedSettings.isLowStockAlerts());
        dtoSettings.setNewUserRegistrations(savedSettings.isNewUserRegistrations());
        dtoSettings.setSystemUpdates(savedSettings.isSystemUpdates());

        return dtoSettings;
    }

    @Transactional
    public SettingsDto.AppearanceSettings updateAppearanceSettings(UUID userId, SettingsDto.AppearanceSettings appearanceSettings) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

        AppearanceSettings settings = appearanceSettingsRepository.findByUser(user)
                .orElseGet(() -> {
                    AppearanceSettings newSettings = new AppearanceSettings();
                    newSettings.setUser(user);
                    return newSettings;
                });

        settings.setTheme(AppearanceSettings.Theme.valueOf(appearanceSettings.getTheme().toUpperCase()));
        settings.setDensity(AppearanceSettings.Density.valueOf(appearanceSettings.getDensity().toUpperCase()));

        AppearanceSettings savedSettings = appearanceSettingsRepository.save(settings);

        SettingsDto.AppearanceSettings dtoSettings = new SettingsDto.AppearanceSettings();
        dtoSettings.setTheme(savedSettings.getTheme().name().toLowerCase());
        dtoSettings.setDensity(savedSettings.getDensity().name().toLowerCase());

        return dtoSettings;
    }
} 