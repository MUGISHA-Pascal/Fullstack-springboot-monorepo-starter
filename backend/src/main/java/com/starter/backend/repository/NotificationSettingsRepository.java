package com.starter.backend.repository;

import com.starter.backend.models.NotificationSettings;
import com.starter.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, UUID> {
    Optional<NotificationSettings> findByUser(User user);
    Optional<NotificationSettings> findByUserId(UUID userId);
} 