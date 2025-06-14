package com.starter.backend.dtos;

import com.starter.backend.enums.EGender;
import com.starter.backend.enums.ERoleType;
import com.starter.backend.enums.EStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SettingsDto {
    @Size(max=100)
    @Email
    private String email;
    @NotBlank
    @Size(min=4,max=20)
    private String firstName;
    @NotBlank
    @Size(min=4,max=40)
    private String lastName;
    @NotBlank
    @Size(min = 4,max=40)
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Mobile number must be in international format (e.g., +1234567890)")
    private String mobile;
    private EGender gender;
    private EStatus status = EStatus.ACTIVE;
    private ERoleType[] role;
    private NotificationSettings notificationSettings;
    private AppearanceSettings appearanceSettings;

    @Getter
    @Setter
    public static class PasswordUpdate {
        @NotBlank
        private String currentPassword;
        @NotBlank
        @Size(min = 8)
        private String newPassword;
        @NotBlank
        private String confirmPassword;
    }

    @Getter
    @Setter
    public static class NotificationSettings {
        private boolean emailNotifications;
        private boolean lowStockAlerts;
        private boolean newUserRegistrations;
        private boolean systemUpdates;
    }

    @Getter
    @Setter
    public static class AppearanceSettings {
        private String theme; // "light", "dark", "system"
        private String density; // "compact", "comfortable", "spacious"
    }
} 