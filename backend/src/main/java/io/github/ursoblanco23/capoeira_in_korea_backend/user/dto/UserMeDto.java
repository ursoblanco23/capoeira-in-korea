package io.github.ursoblanco23.capoeira_in_korea_backend.user.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.constants.GenderType;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.UserStatus;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserMeDto {

    private Long id;
    private String loginId;
    private String email;
    private String nickname;
    private String bio;
    private String realName;
    private String phone;
    private LocalDate birthDate;
    private GenderType gender;
    private Address address;
    private UserStatus status;
    private boolean emailVerified;
    private boolean phoneVerified;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastLoginAt;
    private List<UserRoleDto> roles;

    @Setter
    private String profileImgUrl;

    public static UserMeDto from(User user) {
        List<UserRoleDto> roles = user.getUserRoles().stream()
                .map(userRole -> UserRoleDto.from(userRole.getRole()))
                .toList();

        return UserMeDto.builder()
                .id(user.getId())
                .loginId(user.getLoginId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .bio(user.getBio())
                .realName(user.getRealName())
                .phone(user.getPhone())
                .birthDate(user.getBirthDate())
                .gender(user.getGender())
                .address(user.getAddress())
                .status(user.getStatus())
                .emailVerified(user.getEmailVerifiedAt() != null)
                .phoneVerified(user.getPhoneVerifiedAt() != null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .roles(roles)
                .build();
    }

    @Override
    public String toString() {
        return "UserMeDto{" +
                "id=" + id +
                ", loginId='" + loginId + '\'' +
                ", email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", bio='" + bio + '\'' +
                ", realName='" + realName + '\'' +
                ", phone='" + phone + '\'' +
                ", birthDate=" + birthDate +
                ", gender=" + gender +
                ", address=" + address +
                ", status=" + status +
                ", emailVerified=" + emailVerified +
                ", phoneVerified=" + phoneVerified +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", lastLoginAt=" + lastLoginAt +
                ", roles=" + roles +
                ", profileImgUrl='" + profileImgUrl + '\'' +
                '}';
    }
}
