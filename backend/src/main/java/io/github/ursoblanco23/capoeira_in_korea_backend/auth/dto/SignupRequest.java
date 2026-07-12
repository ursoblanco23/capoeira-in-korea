package io.github.ursoblanco23.capoeira_in_korea_backend.auth.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.constants.GenderType;
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

    @NotBlank
    @Size(min = 8, max = 100)
    private String password;

    @NotBlank
    @Size(max = 50)
    private String nickname;

    // =========================
    // 추가된 회원 정보
    // =========================

    @Size(max = 50)
    private String realName;

    @Size(max = 20)
    private String phone;

    // 프론트는 string("YYYY-MM-DD") → 서비스에서 LocalDate로 변환 추천
    private String birthDate;

    private GenderType gender;

    @Size(max = 10)
    private String zipCode;

    @Size(max = 100)
    private String roadAddress;

    @Size(max = 100)
    private String detailAddress;

    @Size(max = 30)
    private String sidoName;

    @Size(max = 50)
    private String sigunguName;

    @Size(max = 50)
    private String eupmyeondongName;
}
