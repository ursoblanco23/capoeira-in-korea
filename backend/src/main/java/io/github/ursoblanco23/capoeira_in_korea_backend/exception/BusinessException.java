package io.github.ursoblanco23.capoeira_in_korea_backend.exception;

import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    /**
     * 기본 생성자
     * - 외부 응답 메시지는 ErrorCode의 기본 메시지를 사용
     * - 내부 로그도 기본적으로 이 메시지를 사용
     */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    /**
     * 커스텀 메시지 생성자
     * - 외부 응답은 여전히 ErrorCode의 기본 메시지를 내려주는 정책으로 가고,
     *   ex.getMessage()는 내부 로그에서만 참고하는 용도로 사용
     * @param errorCode (code, status, 외부응답용 기본 message)
     * @param message custom message, 내부 로그에서만 참고하는 용도로 사용
     */
    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * 원인 예외(cause) 보존용 생성자
     * - 비즈니스 예외는 기본적으로 스택트레이스를 전역에서 자세히 찍지 않는 정책이더라도,
     *   원인 연결(chain)은 유지해두는 편이 좋음
     */
    public BusinessException(ErrorCode errorCode, Throwable cause) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
}