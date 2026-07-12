package io.github.ursoblanco23.capoeira_in_korea_backend.auth.token;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

public final class RefreshTokenHasher {

    private RefreshTokenHasher() {}

    public static String sha256Hex(String rawToken) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest); // 64 chars
        } catch (Exception e) {
            throw new IllegalStateException("Failed to hash refresh token", e);
        }
    }
}
