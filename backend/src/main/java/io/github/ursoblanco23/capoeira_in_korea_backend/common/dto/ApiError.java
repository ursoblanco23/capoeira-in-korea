package io.github.ursoblanco23.capoeira_in_korea_backend.common.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiError {

    /**
     * 예: AUTH-INVALID-TOKEN-0001
     */
    private final String code;

    /**
     * 외부로 내려줄 기본 에러 메시지
     */
    private final String message;

    /**
     * HTTP status code
     * 예: 400, 401, 404, 500
     */
    private final int status;

    public static ApiError from(ErrorCode errorCode) {
        return new ApiError(
                errorCode.getCode(),
                errorCode.getMessage(),
                errorCode.getStatus().value()
        );
    }
}