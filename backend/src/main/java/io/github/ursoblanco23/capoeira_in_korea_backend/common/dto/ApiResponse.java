package io.github.ursoblanco23.capoeira_in_korea_backend.common.dto;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ApiResponse<T> {

    /**
     * 요청 처리 성공 여부
     */
    private final boolean success;

    /**
     * 성공 시 반환 데이터
     * 실패 응답에서는 null
     */
    private final T data;

    /**
     * 성공 메시지
     * - 조회 API 등에서는 null일 수 있음
     * - 생성/수정/삭제 성공 시 선택적으로 사용
     *
     * 실패 메시지는 error.message를 사용하므로
     * 실패 응답에서는 보통 null로 둠
     */
    private final String message;

    /**
     * 실패 시 에러 정보
     * 성공 응답에서는 null
     */
    private final ApiError error;

    /**
     * validation 실패 시 필드별 상세 에러 목록
     * - 성공 응답에서는 null
     * - 일반 실패 응답에서도 필요 없으면 null
     */
    private final List<FieldErrorDetail> fieldErrors;

    /**
     * 응답 생성 시각
     * - 디버깅/로깅/프론트 확인용으로 유용
     */
    private final LocalDateTime timestamp;

    private ApiResponse(
            boolean success,
            T data,
            String message,
            ApiError error,
            List<FieldErrorDetail> fieldErrors,
            LocalDateTime timestamp
    ) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
        this.fieldErrors = fieldErrors;
        this.timestamp = timestamp;
    }

    // ========================================================================
    // 성공 응답
    // ========================================================================

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(
                true,
                data,
                null,
                null,
                null,
                LocalDateTime.now()
        );
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(
                true,
                data,
                message,
                null,
                null,
                LocalDateTime.now()
        );
    }

    public static ApiResponse<Void> success() {
        return new ApiResponse<>(
                true,
                null,
                null,
                null,
                null,
                LocalDateTime.now()
        );
    }

    public static ApiResponse<Void> success(String message) {
        return new ApiResponse<>(
                true,
                null,
                message,
                null,
                null,
                LocalDateTime.now()
        );
    }

    // ========================================================================
    // 실패 응답
    // ------------------------------------------------------------------------
    // 정책:
    // - 외부 응답 메시지는 기본적으로 ErrorCode의 message 사용
    // - BusinessException의 custom message는 내부 로그용으로만 활용
    // - validation 실패 시에는 fieldErrors를 함께 담을 수 있음
    // ========================================================================

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(
                false,
                null,
                null,
                ApiError.from(errorCode),
                null,
                LocalDateTime.now()
        );
    }

    public static <T> ApiResponse<T> error(ApiError error) {
        return new ApiResponse<>(
                false,
                null,
                null,
                error,
                null,
                LocalDateTime.now()
        );
    }

    public static <T> ApiResponse<T> error(String code, String message, int status) {
        return new ApiResponse<>(
                false,
                null,
                null,
                new ApiError(code, message, status),
                null,
                LocalDateTime.now()
        );
    }

    /**
     * validation 실패 등에서 필드별 상세 에러를 포함해 응답할 때 사용
     */
    public static <T> ApiResponse<T> error(ErrorCode errorCode, List<FieldErrorDetail> fieldErrors) {
        return new ApiResponse<>(
                false,
                null,
                null,
                ApiError.from(errorCode),
                fieldErrors,
                LocalDateTime.now()
        );
    }
}