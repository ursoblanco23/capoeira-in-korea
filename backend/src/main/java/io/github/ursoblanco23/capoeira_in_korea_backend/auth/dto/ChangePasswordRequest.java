package io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "현재 비밀번호를 입력해주세요.")
        String currentPassword,

        @NotBlank(message = "새 비밀번호를 입력해주세요.")
        @Size(
                min = 12,
                max = 64,
                message = "비밀번호는 12자 이상 64자 이하여야 합니다."
        )
        String newPassword
) {
}
