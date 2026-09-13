package io.github.ursoblanco23.capoeira_in_korea_backend.auth.controller;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.*;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.UserPrincipal;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.service.AuthService;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.token.RefreshTokenCookieManager;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenCookieManager refreshTokenCookieManager;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<SignupResponse>> signup(@Valid @RequestBody SignupRequest req) {
        SignupResponse data = authService.signup(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(data, "회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AccessTokenDto>> login(
            @Valid @RequestBody LoginRequest req,
            HttpServletResponse response
    ) {
        IssuedTokens tokens = authService.login(req);
        refreshTokenCookieManager.setRefreshCookie(response, tokens.getRefreshToken(), tokens.getRefreshExpiresAt());
        return ResponseEntity.ok(ApiResponse.success(tokens.getAccessToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AccessTokenDto>> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response
    ) {
        IssuedTokens tokens = authService.refresh(refreshToken);
        refreshTokenCookieManager.setRefreshCookie(response, tokens.getRefreshToken(), tokens.getRefreshExpiresAt());
        return ResponseEntity.ok(ApiResponse.success(tokens.getAccessToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = RefreshTokenCookieManager.REFRESH_COOKIE_NAME, required = false) String refreshToken,
            HttpServletResponse response
    ) {
        authService.logout(refreshToken);
        refreshTokenCookieManager.clearRefreshCookie(response);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletResponse response
    ) {
        authService.changePassword(principal.getUserId(), request);
        refreshTokenCookieManager.clearRefreshCookie(response);
        return ResponseEntity.ok(ApiResponse.success());
    }

}
