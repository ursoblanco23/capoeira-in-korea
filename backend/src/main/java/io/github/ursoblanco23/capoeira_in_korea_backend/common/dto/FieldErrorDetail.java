package io.github.ursoblanco23.capoeira_in_korea_backend.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FieldErrorDetail {

    /**
     * 검증 실패한 필드명
     * 예: email, password, name
     */
    private final String field;

    /**
     * 사용자가 입력한 값
     * 보안상 민감할 수 있는 값은 내려주지 않도록 주의
     */
//    private final Object rejectedValue;

    /**
     * 검증 실패 메시지
     * 예: "이메일 형식이 올바르지 않습니다."
     */
    private final String reason;
}