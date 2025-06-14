package com.starter.backend.repository;

import com.starter.backend.models.AppearanceSettings;
import com.starter.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppearanceSettingsRepository extends JpaRepository<AppearanceSettings, UUID> {
    Optional<AppearanceSettings> findByUser(User user);
    Optional<AppearanceSettings> findByUserId(UUID userId);
} 