package io.github.ursoblanco23.capoeira_in_korea_backend.user.entity;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.constants.GenderType;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.BaseSoftDeleteEntity;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.RoleName;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.UserStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseSoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id", length = 50, unique = true)
    private String loginId;

    @Column(name = "email", length = 100, unique = true)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "nickname", length = 50, unique = true)
    private String nickname;


    @Column(name = "bio", columnDefinition = "text")
    private String bio;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private GenderType gender;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Embedded
    private Address address;

    @Column(name = "real_name", length = 50)
    private String realName;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserStatus status;

    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;

    @Column(name = "phone_verified_at")
    private LocalDateTime phoneVerifiedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRole> userRoles = new ArrayList<>();

    @Builder
    private User(
            String loginId,
            String email,
            String passwordHash,
            String nickname,
            String bio,
            String phone,
            LocalDate birthDate,
            GenderType gender,
            Address address,
            String realName,
            UserStatus status
    ) {
        this.loginId = loginId;
        this.email = email;
        this.passwordHash = passwordHash;
        this.nickname = nickname;
        this.bio = bio;
        this.phone = phone;
        this.birthDate = birthDate;
        this.gender = gender;
        this.address = address;
        this.realName = realName;
        this.status = status;
    }

    public static User create(
            String loginId,
            String email,
            String passwordHash,
            String nickname,
            String bio,
            String phone,
            LocalDate birthDate,
            GenderType gender,
            Address address,
            String realName
    ) {
        return new User(
                loginId,
                email,
                passwordHash,
                nickname,
                bio,
                phone,
                birthDate,
                gender,
                address,
                realName,
                UserStatus.ACTIVE
        );
    }

    public List<RoleName> getRoleNames() {
        return userRoles.stream()
                .map(userRole -> userRole.getRole().getRoleName())
                .toList();
    }

    public void addRole(Role role) {
        boolean exists = userRoles.stream()
                .anyMatch(userRole -> userRole.getRole().getId().equals(role.getId()));

        if (exists) {
            return;
        }

        UserRole.create(this, role);
    }

    public void removeRole(RoleName roleName) {
        userRoles.removeIf(userRole -> userRole.getRole().getRoleName().equals(roleName));
    }

    public boolean isDeletedOrInactive() {
        return status == UserStatus.INACTIVE || status == UserStatus.DELETED;
    }

    public void touchLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }

    public void updateProfile(
            String nickname,
            String bio,
            String phone,
            LocalDate birthDate,
            GenderType gender,
            Address address,
            String realName
    ) {
        this.nickname = nickname;
        this.bio = bio;
        this.phone = phone;
        this.birthDate = birthDate;
        this.gender = gender;
        this.address = address;
        this.realName = realName;
    }

    public void changePassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void verifyEmail() {
        this.emailVerifiedAt = LocalDateTime.now();
    }

    public void verifyPhone() {
        this.phoneVerifiedAt = LocalDateTime.now();
    }

    public void markInactive() {
        this.status = UserStatus.INACTIVE;
    }

    public void markDeleted() {
        this.status = UserStatus.DELETED;
        this.softDelete();
    }

    public void activate() {
        this.status = UserStatus.ACTIVE;
    }
}