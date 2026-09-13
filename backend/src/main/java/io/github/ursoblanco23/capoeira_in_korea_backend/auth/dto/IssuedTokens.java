package io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class IssuedTokens {
    private final AccessTokenDto accessToken;
    private final String refreshToken; // 쿠키로만 사용(바디로 내려주지 않음)
    private final Instant refreshExpiresAt; // 있으면 쿠키 maxAge 계산에 편함
}
