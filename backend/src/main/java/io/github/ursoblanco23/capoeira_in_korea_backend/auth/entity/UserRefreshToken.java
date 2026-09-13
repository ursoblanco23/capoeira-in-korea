package io.github.ursoblanco23.capoeira_in_korea_backend.auth.entity;

import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Entity
@Table(name = "user_refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserRefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_refresh_tokens_user")
    )
    private User user;

    @Column(name = "refresh_token_hash", nullable = false, unique = true, length = 255)
    private String refreshTokenHash;

    @Column(name = "user_agent", columnDefinition = "text")
    private String userAgent;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "issued_at", nullable = false)
    private Instant issuedAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public boolean isRevoked() {
        return revokedAt != null;
    }

    public boolean isExpired(Instant now) {
        return now.isAfter(expiresAt);
    }

    public void revoke(Instant revokedAt) {
        this.revokedAt = revokedAt;
    }
}
