package io.github.ursoblanco23.capoeira_in_korea_backend.auth.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.AccessTokenDto;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.IssuedTokens;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.LoginRequest;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.SignupRequest;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.SignupResponse;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.entity.UserRefreshToken;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.repository.UserRefreshTokenRepository;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.token.JwtProvider;
import io.github.ursoblanco23.capoeira_in_korea_backend.auth.token.RefreshTokenHasher;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.entity.Address;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.util.DateUtils;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.util.PhoneUtils;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.constants.UserStatus;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.entity.User;
import io.github.ursoblanco23.capoeira_in_korea_backend.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserRefreshTokenRepository userRefreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    /**
     * 회원가입
     *
     * 현재는 service 레벨에서 중복 체크 후 BusinessException 발생.
     * 추후 @Valid, 별도 validator, DB unique constraint와 함께 보강 가능.
     */
    @Override
    @Transactional
    public SignupResponse signup(SignupRequest req) {
        validateSignupDuplicate(req);

        User user = User.builder()
                .loginId(req.getLoginId())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .nickname(req.getNickname())
                .realName(req.getRealName())
                .phone(PhoneUtils.normalizeKoreanPhone(req.getPhone()))
                .birthDate(DateUtils.parseDate(req.getBirthDate()))
                .gender(req.getGender())
                .address(Address.of(
                        req.getZipCode()
                        ,req.getRoadAddress()
                        ,req.getDetailAddress()
                        ,req.getSidoName()
                        ,req.getSigunguName()
                        ,req.getEupmyeondongName()
                ))
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        return new SignupResponse(
                savedUser.getId(),
                savedUser.getLoginId(),
                savedUser.getNickname()
        );
    }

    @Override
    @Transactional
    public IssuedTokens login(LoginRequest req) {
        User user = userRepository.findByLoginId(req.getId())
                // 보안상 "아이디 없음" / "비밀번호 틀림"을 구분하지 않는 것이 일반적
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_LOGIN_FAILED));

        validateActiveUser(user);

        if (user.getPasswordHash() == null || !passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_LOGIN_FAILED);
        }

        user.touchLastLogin();

        // 현재 정책: 로그인 시 기존 refresh 토큰 전부 폐기 (싱글 디바이스 로그인 정책)
        // TODO: 추후에 멀티 디바이스 로그인 정책으로 확장 예정
        userRefreshTokenRepository.revokeAllActiveByUserId(user.getId(), LocalDateTime.now());

        return issueTokens(user);
    }

    @Override
    @Transactional
    public IssuedTokens refresh(java.lang.String rawRefresh) {
        if (rawRefresh == null || rawRefresh.isBlank()) {
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_MISSING);
        }

        // JWT 검증 후 token 내 user식별자(pk값) 반환
        Long userIdFromRefreshToken = jwtProvider.getUserIdFromRefreshToken(rawRefresh);

        // DB로부터 상태 검증
        UserRefreshToken stored = getStoredRefreshToken(rawRefresh);
        validateStoredRefreshToken(stored);
        validateRefreshTokenOwnership(stored, userIdFromRefreshToken);

        User user = stored.getUser();
        validateActiveUser(user);

        // rotation: 기존 refresh 폐기
        stored.revokeNow();

        // 새 access/refresh 발급
        return issueTokens(user);
    }

    private static void validateRefreshTokenOwnership(UserRefreshToken stored, Long userIdFromRefreshToken) {
        Long userIdFromDb = stored.getUser().getId();

        if (!userIdFromDb.equals(userIdFromRefreshToken)) {
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_MISMATCH);
        }
    }

    private static void validateStoredRefreshToken(UserRefreshToken stored) {
        if (stored.isExpired()) {
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_EXPIRED);
        }
        if (stored.isRevoked()) {
            // revoked 토큰은 보통 "더 이상 유효하지 않음"으로 보는 것이 자연스러움
            throw new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_INVALID);
        }
    }

    private UserRefreshToken getStoredRefreshToken(java.lang.String rawRefresh) {
        java.lang.String hash = RefreshTokenHasher.sha256Hex(rawRefresh);
        UserRefreshToken stored = userRefreshTokenRepository.findByRefreshTokenHash(hash)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_REFRESH_TOKEN_NOT_FOUND));
        return stored;
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            // logout은 보통 멱등적으로 처리해도 괜찮음
            // 이미 로그아웃 상태이거나 refresh 토큰이 없어도 조용히 종료
            return;
        }

        java.lang.String hash = RefreshTokenHasher.sha256Hex(refreshToken);

        userRefreshTokenRepository.findByRefreshTokenHash(hash)
                .ifPresent(UserRefreshToken::revokeNow);
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
        java.lang.String refresh = jwtProvider.createRefreshToken(user.getId());

        java.lang.String refreshHash = RefreshTokenHasher.sha256Hex(refresh);

        HttpServletRequest httpReq = currentRequestOrNull();
        LocalDateTime now = LocalDateTime.now();

        UserRefreshToken row = UserRefreshToken.builder()
                .user(user)
                .refreshTokenHash(refreshHash)
                .userAgent(safeUserAgent(httpReq))
                .ipAddress(safeIp(httpReq))
                .issuedAt(now)
                .expiresAt(jwtProvider.getRefreshExpiry())
                .revokedAt(null)
                .createdAt(now)
                .build();

        // TODO: refresh hash가 동일하여 로그인 시 에러가 발생했음.
        userRefreshTokenRepository.save(row);

        AccessTokenDto accessTokenDto = AccessTokenDto.builder()
                .accessToken(access)
                .tokenType("Bearer")
                .expiresInSeconds(1800)
                .build();

        return new IssuedTokens(accessTokenDto, refresh, jwtProvider.getRefreshExpiry());
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