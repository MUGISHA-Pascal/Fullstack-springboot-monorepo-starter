package com.starter.backend.models;

import com.starter.backend.audits.InitiatorAudit;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "notification_settings")
public class NotificationSettings extends InitiatorAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "email_notifications", nullable = false)
    private boolean emailNotifications = true;

    @Column(name = "low_stock_alerts", nullable = false)
    private boolean lowStockAlerts = true;

    @Column(name = "new_user_registrations", nullable = false)
    private boolean newUserRegistrations = false;

    @Column(name = "system_updates", nullable = false)
    private boolean systemUpdates = true;
} 