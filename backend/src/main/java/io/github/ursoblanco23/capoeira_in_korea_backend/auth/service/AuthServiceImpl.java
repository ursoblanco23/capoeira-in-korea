package io.github.ursoblanco23.capoeira_in_korea_backend.auth.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.*;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.entity.UserRefreshToken;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.repository.UserRefreshTokenRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.token.JwtProvider;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.token.RefreshTokenHasher;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.AddressRequest;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.util.DateUtils;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.util.PhoneUtils;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.UserStatus;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.repository.UserRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;

import java.time.Clock;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode.AUTH_CURRENT_PASSWORD_MISMATCH;
import static io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode.AUTH_SAME_PASSWORD;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserRefreshTokenRepository userRefreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final UserService userService;
    private final Clock clock;

    /**
     * 회원가입
     * 현재는 service 레벨에서 중복 체크 후 BusinessException 발생.
     * 추후 @Valid, 별도 validator, DB unique constraint와 함께 보강 가능.
     */
    @Override
    public SignupResponse signup(SignupRequest req) {
        validateSignupDuplicate(req);

        User user = User.builder()
                .loginId(req.getLoginId())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .nickname(req.getNickname())
                .realName(req.getRealName())
                .phone(normalizeSignupPhone(req))
                .birthDate(DateUtils.parseDate(req.getBirthDate()))
                .gender(req.getGender())
                .address(toAddress(req.getAddress()))
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        return new SignupResponse(
                savedUser.getId(),
                savedUser.getLoginId(),
                savedUser.getNickname()
        );
    }

    private String normalizeSignupPhone(SignupRequest request) {
        try {
            return PhoneUtils.normalizePhoneToE164(
                    request.getPhone(),
                    request.getPhoneRegionCode()
            );
        } catch (IllegalArgumentException exception) {
            throw new BusinessException(
                    ErrorCode.COMMON_VALIDATION_ERROR,
                    "Invalid signup phone number or region code",
                    exception
            );
        }
    }

    @Override
    public IssuedTokens login(LoginRequest req) {
        User user = userRepository.findByLoginId(req.getId())
                // 보안상 "아이디 없음" / "비밀번호 틀림"을 구분하지 않는 것이 일반적
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_LOGIN_FAILED));

        validateActiveUser(user);

        if (user.getPasswordHash() == null || !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_LOGIN_FAILED);
        }


        // 현재 정책: 로그인 시 기존 refresh 토큰 전부 폐기 (싱글 디바이스 로그인 정책)
        // TODO: 추후에 멀티 디바이스 로그인 정책으로 확장 예정
        Instant now = clock.instant();
        user.touchLastLogin(now);
        userRefreshTokenRepository.revokeAllActiveByUserId(user.getId(), now);

        return issueTokens(user);
    }

    @Override
    public IssuedTokens refresh(java.lang.String rawRefresh) {
        if (rawRefresh == null || rawRefresh.isBlank()) {
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_MISSING);
        }

        // JWT 검증 후 token 내 user식별자(pk값) 반환
        Long userIdFromRefreshToken = jwtProvider.getUserIdFromRefreshToken(rawRefresh);

        // DB로부터 상태 검증
        Instant now = clock.instant();
        UserRefreshToken stored = getStoredRefreshToken(rawRefresh, now);
        validateRefreshTokenOwnership(stored, userIdFromRefreshToken);

        User user = stored.getUser();
        validateActiveUser(user);

        // rotation: 기존 refresh 폐기
        stored.revoke(now);

        // 새 access/refresh 발급
        return issueTokens(user);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userService.getUserById(userId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException(AUTH_CURRENT_PASSWORD_MISMATCH);
        }

        if (request.currentPassword().equals(request.newPassword())) {
            throw new BusinessException(AUTH_SAME_PASSWORD);
        }

        String newPasswordHash = passwordEncoder.encode(request.newPassword());
        user.changePassword(newPasswordHash);

        Instant now = clock.instant();
        userRefreshTokenRepository.revokeAllActiveByUserId(userId, now);
    }

    private static void validateRefreshTokenOwnership(UserRefreshToken stored, Long userIdFromRefreshToken) {
        Long userIdFromDb = stored.getUser().getId();

        if (!userIdFromDb.equals(userIdFromRefreshToken)) {
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_MISMATCH);
        }
    }

    private UserRefreshToken getStoredRefreshToken(java.lang.String rawRefresh, Instant now) {
        java.lang.String hash = RefreshTokenHasher.sha256Hex(rawRefresh);

        return userRefreshTokenRepository.findActiveByHashForUpdate(hash, now)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_INVALID));
    }

    @Override
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            // logout은 보통 멱등적으로 처리해도 괜찮음
            // 이미 로그아웃 상태이거나 refresh 토큰이 없어도 조용히 종료
            return;
        }

        java.lang.String hash = RefreshTokenHasher.sha256Hex(refreshToken);
        Instant now = clock.instant();

        userRefreshTokenRepository.findByRefreshTokenHash(hash)
                .ifPresent(token -> token.revoke(now));
    }

    // ------------------------------------------------------------------------
    // internal helpers
    // ------------------------------------------------------------------------

    /**
     * 회원가입 중복 체크
     */
    private void validateSignupDuplicate(SignupRequest req) {
        if (userRepository.existsByLoginId(req.getLoginId())) {
            throw new BusinessException(ErrorCode.USER_DUPLICATE_LOGIN_ID);
        }

        if (req.getEmail() != null && !req.getEmail().isBlank() && userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException(ErrorCode.USER_DUPLICATE_EMAIL);
        }

        if (userRepository.existsByNickname(req.getNickname())) {
            throw new BusinessException(ErrorCode.USER_DUPLICATE_NICKNAME);
        }
    }

    private Address toAddress(AddressRequest request) {
        if (request == null || request.hasMissingValue()) {
            return null;
        }

        return Address.of(
                request.getZipCode().trim(),
                request.getRoadAddress().trim(),
                request.getDetailAddress().trim(),
                request.getSidoName().trim(),
                request.getSigunguName().trim(),
                request.getEupmyeondongName().trim()
        );
    }

    /**
     * 활성 사용자 여부 검증
     *
     * 로그인/리프레시 흐름에서 공통 사용.
     */
    private void validateActiveUser(User user) {
        if (user.isDeletedOrInactive()) {
            throw new BusinessException(ErrorCode.USER_UNAVAILABLE);
        }
    }

    private IssuedTokens issueTokens(User user) {
        java.lang.String access = jwtProvider.createAccessToken(user.getId());
        Instant issuedAt = clock.instant();
        Instant refreshExpiresAt = jwtProvider.calculateRefreshExpiry(issuedAt);
        java.lang.String refresh = jwtProvider.createRefreshToken(user.getId(), issuedAt, refreshExpiresAt);

        java.lang.String refreshHash = RefreshTokenHasher.sha256Hex(refresh);

        HttpServletRequest httpReq = currentRequestOrNull();

        UserRefreshToken row = UserRefreshToken.builder()
                .user(user)
                .refreshTokenHash(refreshHash)
                .userAgent(safeUserAgent(httpReq))
                .ipAddress(safeIp(httpReq))
                .issuedAt(issuedAt)
                .expiresAt(refreshExpiresAt)
                .revokedAt(null)
                .createdAt(issuedAt)
                .build();

        // TODO: refresh hash가 동일하여 로그인 시 에러가 발생했음.
        userRefreshTokenRepository.save(row);

        AccessTokenDto accessTokenDto = AccessTokenDto.builder()
                .accessToken(access)
                .tokenType("Bearer")
                .expiresInSeconds(jwtProvider.getAccessExpiresInSeconds())
                .build();

        return new IssuedTokens(accessTokenDto, refresh, refreshExpiresAt);
    }

    /**
     * RequestContext가 없는 환경에서도 안전하게 null 반환
     *
     * 여기서 발생하는 예외는 서비스 비즈니스 실패로 볼 성격이 아니므로
     * 굳이 BusinessException으로 변환하지 않고 null 처리
     */
    private HttpServletRequest currentRequestOrNull() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attrs != null ? attrs.getRequest() : null;
        } catch (Exception ignored) {
            return null;
        }
    }

    private java.lang.String safeUserAgent(HttpServletRequest req) {
        return req != null ? req.getHeader("User-Agent") : null;
    }

    private java.lang.String safeIp(HttpServletRequest req) {
        if (req == null) {
            return null;
        }

        java.lang.String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }
}
