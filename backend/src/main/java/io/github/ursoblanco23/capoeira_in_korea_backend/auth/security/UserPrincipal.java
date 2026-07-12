package io.github.ursoblanco23.capoeira_in_korea_backend.auth.security;

import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.RoleName;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.UserStatus;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Getter
@RequiredArgsConstructor
public class UserPrincipal implements UserDetails {

    private final Long userId;
    private final String loginId;
    private final String email;
    private final String passwordHash;
    private final String nickname;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;
    private final boolean enabled;

    public static UserPrincipal from(User user) {
        return new UserPrincipal(
                user.getId(),
                user.getLoginId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getNickname(),
                user.getRoleNames().stream()
                        .map(RoleName::name)
                        .map(SimpleGrantedAuthority::new)
                        .toList(),
                true, // 관련 정책 아직 없음
                true, // 관련 정책 아직 없음
                true, // 관련 정책 아직 없음
                user.getStatus() == UserStatus.ACTIVE
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    // security 내에서 loginId를 getUsername()을 통해서 비교하기에 lgoinId 반환
    @Override
    public String getUsername() {
        return loginId;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}