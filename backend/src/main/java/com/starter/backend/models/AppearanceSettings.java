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
@Table(name = "appearance_settings")
public class AppearanceSettings extends InitiatorAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "theme", nullable = false)
    @Enumerated(EnumType.STRING)
    private Theme theme = Theme.SYSTEM;

    @Column(name = "density", nullable = false)
    @Enumerated(EnumType.STRING)
    private Density density = Density.COMFORTABLE;

    public enum Theme {
        LIGHT,
        DARK,
        SYSTEM
    }

    public enum Density {
        COMPACT,
        COMFORTABLE,
        SPACIOUS
    }
} 