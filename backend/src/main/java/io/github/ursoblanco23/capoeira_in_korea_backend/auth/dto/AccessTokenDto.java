package io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class
AccessTokenDto {
    private String accessToken;
    private String tokenType;
    private int expiresInSeconds;
}
