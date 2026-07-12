package io.github.ursoblanco23.capoeira_in_korea_backend.user.entity;

import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.RoleName;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "roles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", nullable = false, unique = true, length = 50)
    private RoleName roleName;

    @Column(name = "display_name", length = 100, nullable = false)
    private String displayName; // 사이트 관리자

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private Role(RoleName roleName, String displayName) {
        this.roleName = roleName;
        this.displayName = displayName;
    }

    public static Role of(RoleName roleName, String displayName) {
        return new Role(roleName, displayName);
    }
}