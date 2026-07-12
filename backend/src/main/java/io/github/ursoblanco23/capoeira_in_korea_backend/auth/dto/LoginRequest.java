package io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank
    private String id;

    @NotBlank
    private String password;
}

