package io.github.ursoblanco23.capoeira_in_korea_backend.user.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_roles",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_roles_user_id_role_id", columnNames = {"user_id", "role_id"})
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private UserRole(User user, Role role) {
        this.user = user;
        this.role = role;
    }

    // 정적 팩토리 메서드 패턴
    public static UserRole create(User user, Role role) {
        UserRole userRole = new UserRole(user, role);
        user.getUserRoles().add(userRole);
        return userRole;
    }
}
