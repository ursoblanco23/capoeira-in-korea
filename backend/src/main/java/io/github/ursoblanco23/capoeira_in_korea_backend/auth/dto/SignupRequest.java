package io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.constants.GenderType;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.AddressRequest;
import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    @NotBlank
    @Size(max = 50)
    private String loginId;


    @Email
    @Size(max = 100)
    private String email; // null 허용 가능

    @NotBlank(message = "비밀번호를 입력해 주세요.")
    @Size(
            min = 12,
            max = 64,
            message = "비밀번호는 12자 이상 64자 이하여야 합니다."
    )
    private String password;

    @NotBlank
    @Size(max = 50)
    private String nickname;

    // =========================
    // 추가된 회원 정보
    // =========================

    @Nullable
    @Size(max = 50)
    private String realName;

    @Nullable
    @Size(max = 20)
    private String phone;

    @Nullable
    @Pattern(
            regexp = "^[A-Za-z]{2}$",
            message = "전화번호 지역 코드는 영문 2자리여야 합니다."
    )
    private String phoneRegionCode;

    // 프론트는 string("YYYY-MM-DD") → 서비스에서 LocalDate로 변환 추천
    @Nullable
    private String birthDate;

    @Nullable
    private GenderType gender;

    @Valid
    @Nullable
    private AddressRequest address;
}
