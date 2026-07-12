package io.github.ursoblanco23.capoeira_in_korea_backend.auth.service;

import io.github.ursoblanco23.capoeira_in_korea_backend.auth.security.UserPrincipal;

public interface UserPrincipalService {

    UserPrincipal loadByUserId(Long userId);

}
