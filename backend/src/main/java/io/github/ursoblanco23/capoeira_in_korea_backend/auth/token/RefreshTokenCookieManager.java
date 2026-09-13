package io.github.ursoblanco23.capoeira_in_korea_backend.auth.token;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class RefreshTokenCookieManager {

    private final Clock clock;

    public static final String REFRESH_COOKIE_NAME = "refresh_token";

    private static final String REFRESH_COOKIE_PATH = "/api/auth"; // context-path=/api 라면 OK
    private static final String SAME_SITE = "Lax";

    public void setRefreshCookie(HttpServletResponse response, String refreshToken, Instant refreshExpiresAt) {
        Instant now = clock.instant();
        long maxAgeSeconds = Duration.between(now, refreshExpiresAt).getSeconds();
        if (maxAgeSeconds < 0) maxAgeSeconds = 0; // 만약 시간이 역전되면 방어

        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, refreshToken)
                .httpOnly(true)
                .secure(true) // 현재 상황에서 프로필 분기 안 하겠다 = HTTPS 환경 전제
                .path(REFRESH_COOKIE_PATH)
                .sameSite(SAME_SITE)
                .maxAge(maxAgeSeconds)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie delete = ResponseCookie.from(REFRESH_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .path(REFRESH_COOKIE_PATH)
                .sameSite(SAME_SITE)
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, delete.toString());
    }

    public static String getRefreshCookieName() {
        return REFRESH_COOKIE_NAME;
    }

}
