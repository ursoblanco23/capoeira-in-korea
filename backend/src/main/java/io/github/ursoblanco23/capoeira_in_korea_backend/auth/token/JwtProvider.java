package io.github.ursoblanco23.capoeira_in_korea_backend.auth.token;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {

    private static final String CLAIM_TOKEN_TYPE = "tokenType";
    private static final String ACCESS = "access";
    private static final String REFRESH = "refresh";

    private final SecretKey key;
    private final String issuer;
    private final int accessMinutes;
    private final int refreshDays;

    public JwtProvider(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.issuer}") String issuer,
            @Value("${security.jwt.access-minutes:30}") int accessMinutes,
            @Value("${security.jwt.refresh-days:7}") int refreshDays
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.issuer = issuer;
        this.accessMinutes = accessMinutes;
        this.refreshDays = refreshDays;
    }

    @PostConstruct
    void validateSecretLength() {
        if (key.getEncoded().length < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 bytes.");
        }
    }

    public String createAccessToken(Long userId) {
        Instant now = Instant.now();
        Instant exp = now.plus(accessMinutes, ChronoUnit.MINUTES);

        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .claim(CLAIM_TOKEN_TYPE, ACCESS)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(Long userId) {
        Instant now = Instant.now();
        Instant exp = now.plus(refreshDays, ChronoUnit.DAYS);

        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .setId(UUID.randomUUID().toString())
                .claim(CLAIM_TOKEN_TYPE, REFRESH)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long getUserIdFromAccessToken(String accessToken) {
        Claims claims = getClaimsAndValidateType(accessToken, ACCESS);
        return parseUserId(claims);
    }

    public Long getUserIdFromRefreshToken(String refreshToken) {
        Claims claims = getClaimsAndValidateType(refreshToken, REFRESH);
        return parseUserId(claims);
    }

    public LocalDateTime getRefreshExpiry() {
        return LocalDateTime.now().plusDays(refreshDays);
    }

    //token의 claims를 받아서 현재 token의 타입을 체크 후 반환
    private Claims getClaimsAndValidateType(String token, String expectedTokenType) {
        Claims claims = parseClaims(token);
        String tokenType = claims.get(CLAIM_TOKEN_TYPE, String.class);

        if (!expectedTokenType.equals(tokenType)) {
            if (ACCESS.equals(expectedTokenType)) {
                throw new BusinessException(ErrorCode.AUTH_NOT_ACCESS_TOKEN);
            }
            if (REFRESH.equals(expectedTokenType)) {
                throw new BusinessException(ErrorCode.AUTH_NOT_REFRESH_TOKEN);
            }
            throw new BusinessException(ErrorCode.AUTH_INVALID_TOKEN);
        }

        return claims;
    }

    /**
     * JWT Claims의 subject에서 사용자 ID를 추출한다.
     *
     * @param claims 검증이 완료된 JWT Claims
     * @return 추출된 사용자 ID
     * @throws BusinessException subject가 없거나 숫자로 변환할 수 없는 경우
     */
    private Long parseUserId(Claims claims) {
        try {
            return Long.parseLong(claims.getSubject());
        } catch (NumberFormatException | NullPointerException e) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_TOKEN, e);
        }
    }

    /**
     * JWT 토큰을 자체 검증하고 Claims를 반환한다.
     *
     * @param token JWT 문자열
     * @return 검증된 사용자 정보가 포함된 클레임
     * @throws BusinessException 토큰이 유효하지 않은 경우
     */
    private Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .requireIssuer(issuer)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

        } catch (ExpiredJwtException e) {
            throw new BusinessException(ErrorCode.AUTH_EXPIRED_TOKEN, e);

        } catch (SecurityException | SignatureException e) {
            throw new BusinessException(ErrorCode.AUTH_SIGNATURE_INVALID, e);

        } catch (MissingClaimException | IncorrectClaimException e) {
            throw new BusinessException(ErrorCode.AUTH_ISSUER_INVALID, e);

        } catch (MalformedJwtException | UnsupportedJwtException e) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_TOKEN, e);

        } catch (JwtException | IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.AUTH_INVALID_TOKEN, e);
        }
    }
}