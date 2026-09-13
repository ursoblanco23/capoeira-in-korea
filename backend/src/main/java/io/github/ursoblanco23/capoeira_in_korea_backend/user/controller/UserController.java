package io.github.ursoblanco23.capoeira_in_korea_backend.user.controller;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.UserPrincipal;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.token.RefreshTokenCookieManager;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.ApiResponse;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.dto.UserMeDto;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final RefreshTokenCookieManager refreshTokenCookieManager;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserMeDto>> getMe(@AuthenticationPrincipal UserPrincipal principal) {
        UserMeDto userMeDto = userService.getMe(principal.getUserId());
        return ResponseEntity.ok(ApiResponse.success(userMeDto));
    }

    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserMeDto>> updateProfileImage(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestPart("file") MultipartFile file
    ) {
        UserMeDto userMeDto = userService.updateMyProfileImage(principal.getUserId(), file);
        return ResponseEntity.ok(ApiResponse.success(userMeDto));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletResponse response
    ) {
        userService.withdrawMyAccount(principal.getUserId());
        refreshTokenCookieManager.clearRefreshCookie(response);
        return ResponseEntity.ok(ApiResponse.success());
    }
}
