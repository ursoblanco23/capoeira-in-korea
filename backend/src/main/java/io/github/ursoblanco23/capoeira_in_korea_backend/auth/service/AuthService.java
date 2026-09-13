package io.github.ursoblanco23.capoeira_in_korea_backend.auth.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto.*;

public interface AuthService {
    SignupResponse signup(SignupRequest req);
    IssuedTokens login(LoginRequest req);
    IssuedTokens  refresh(java.lang.String rawRefresh);
    void changePassword(Long userId, ChangePasswordRequest request);
    void logout(String req);
}
