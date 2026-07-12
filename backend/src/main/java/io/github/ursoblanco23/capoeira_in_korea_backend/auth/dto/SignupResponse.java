package io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignupResponse {

    private Long userId;
    private String loginId;
    private String nickname;

}

