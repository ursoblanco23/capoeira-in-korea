package io.github.ursoblanco23.capoeira_in_korea_backend.common.advice;

import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.ApiResponse;
import io.github.ursoblanco23.capoeira_in_korea_backend.common.dto.FieldErrorDetail;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.DatabaseConstraintErrorResolver;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.BusinessException;
import io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final DatabaseConstraintErrorResolver databaseConstraintErrorResolver;

    /**
     * request body와 서버 DTO 바인딩에서 에러 발생 시 필드별 에러코드 리스트 생성 반환
     * @param bindingResult
     * @return
     */
    private List<String> extractValidationLogDetails(
            BindingResult bindingResult
    ) {
        return bindingResult.getFieldErrors()
                .stream()
                .map(fieldError ->
                        fieldError.getField()
                                + ":"
                                + fieldError.getCode()
                )
                .distinct()
                .toList();
    }

    private List<FieldErrorDetail> extractFieldErrors(
            BindingResult bindingResult
    ) {
        return bindingResult.getFieldErrors()
                .stream()
                .map(fieldError -> new FieldErrorDetail(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()
                ))
                .toList();
    }

    /**
     * >> 에러 처리 핸들러 순서도 주의하기!
     * 실제로 스프링이 더 구체적인 예외를 우선 매칭하긴 하지만, 가독성상 Exception.class 는 항상 제일 아래로 두는 게 좋다.
     * 즉 순서를 이렇게 추천:
     * BusinessException
     * NoResourceFoundException
     * validation 관련 예외들
     * MethodArgumentTypeMismatchException 같은 요청 오류
     * 맨 마지막 Exception
     */

    /**
     * 비즈니스 예외
     *
     * 정책:
     * - 외부에는 ErrorCode의 기본 메시지(message)만 응답
     * - 내부 로그는 warn 수준으로만 남김
     * - 스택트레이스는 기본적으로 남기지 않음
     *
     * 이유:
     * - BusinessException은 "예상 가능한 예외" 이므로 로그가 과도하게 지저분해지는 것을 방지
     * - detailed stack trace는 주로 예상 못한 시스템 오류(Exception)에서 더 중요
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusiness(BusinessException ex) {
        ErrorCode errorCode = ex.getErrorCode();

        log.warn("BusinessException: code={}, status={}, message={}",
                errorCode.getCode(),
                errorCode.getStatus(),
                ex.getMessage());

        return ResponseEntity
                .status(errorCode.getStatus())
                .body(ApiResponse.error(errorCode));
    }

    /**
     * 존재하지 않는 리소스 / 잘못된 경로 접근
     *
     * 예:
     * - 존재하지 않는 API 경로
     * - 정적 리소스 매핑에서 찾지 못한 경우
     */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResource(NoResourceFoundException ex) {
        log.warn("No resource found: {}", ex.getMessage());

        return ResponseEntity
                .status(ErrorCode.COMMON_NOT_FOUND.getStatus())
                .body(ApiResponse.error(ErrorCode.COMMON_NOT_FOUND));
    }

    /**
     * DTO @Valid 검증 실패
     *
     * 예:
     * - @NotBlank
     * - @Size
     * - @Email
     *
     * 특징:
     * - 요청 형식(JSON 구조)은 맞지만
     * - 필드 값 검증에서 실패한 경우
     *
     * => COMMON_VALIDATION_ERROR 사용
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        List<FieldErrorDetail> fieldErrors = extractFieldErrors(ex.getBindingResult());

        log.warn(
                "Request validation failed: method={}, uri={}, errors={}",
                request.getMethod(),
                request.getRequestURI(),
                extractValidationLogDetails(ex.getBindingResult())
        );

        return ResponseEntity
                .status(ErrorCode.COMMON_VALIDATION_ERROR.getStatus())
                .body(ApiResponse.error(
                        ErrorCode.COMMON_VALIDATION_ERROR,
                        fieldErrors
                ));
    }

    /**
     * Form 바인딩/객체 바인딩 검증 실패
     *
     * 예:
     * - @ModelAttribute 바인딩 과정에서의 validation 실패
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Void>> handleBindException(BindException ex) {
        log.warn(
                "Request binding validation failed: fieldErrorCount={}",
                ex.getBindingResult().getFieldErrorCount()
        );

        List<FieldErrorDetail> fieldErrors = extractFieldErrors(ex.getBindingResult());

        return ResponseEntity
                .status(ErrorCode.COMMON_VALIDATION_ERROR.getStatus())
                .body(ApiResponse.error(
                        ErrorCode.COMMON_VALIDATION_ERROR,
                        fieldErrors
                ));
    }

    /**
     * @RequestParam, @PathVariable, 메서드 파라미터 제약 검증 실패
     *
     * 예:
     * - @Min
     * - @Max
     * - @NotNull
     *
     * => 요청값 검증 실패이므로 COMMON_VALIDATION_ERROR
     */
    @ExceptionHandler({
            ConstraintViolationException.class,
            HandlerMethodValidationException.class
    })
    public ResponseEntity<ApiResponse<Void>> handleConstraintValidation(Exception ex) {
        log.warn("Constraint/Handler validation exception: {}", ex.getMessage());

        return ResponseEntity
                .status(ErrorCode.COMMON_VALIDATION_ERROR.getStatus())
                .body(ApiResponse.error(ErrorCode.COMMON_VALIDATION_ERROR));
    }

    /**
     * 파라미터 타입 불일치
     *
     * 예:
     * - Long id 자리에 "abc" 전달
     *
     * => 요청 형식/타입 자체가 잘못되었으므로 COMMON_INVALID_REQUEST
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        log.warn("MethodArgumentTypeMismatchException: {}", ex.getMessage());

        return ResponseEntity
                .status(ErrorCode.COMMON_INVALID_REQUEST.getStatus())
                .body(ApiResponse.error(ErrorCode.COMMON_INVALID_REQUEST));
    }

    /**
     * 요청 바디(JSON) 파싱 실패
     *
     * 예:
     * - 잘못된 JSON 문법
     * - enum 변환 실패
     * - 숫자 필드에 문자열 입력 등
     *
     * => 요청 형식 자체가 잘못되었으므로 COMMON_INVALID_REQUEST
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotReadable(HttpMessageNotReadableException ex) {
        log.warn("HttpMessageNotReadableException: {}", ex.getMessage());

        return ResponseEntity
                .status(ErrorCode.COMMON_INVALID_REQUEST.getStatus())
                .body(ApiResponse.error(ErrorCode.COMMON_INVALID_REQUEST));
    }

    /**
     * 필수 요청 파라미터 누락
     *
     * 예:
     * - required=true 인 @RequestParam 누락
     *
     * => 요청 구조 자체가 잘못되었으므로 COMMON_INVALID_REQUEST
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingParameter(MissingServletRequestParameterException ex) {
        log.warn("MissingServletRequestParameterException: {}", ex.getMessage());

        return ResponseEntity
                .status(ErrorCode.COMMON_INVALID_REQUEST.getStatus())
                .body(ApiResponse.error(ErrorCode.COMMON_INVALID_REQUEST));
    }

    /**
     * 허용되지 않은 HTTP 메서드
     *
     * 예:
     * - POST만 허용인데 GET 요청
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Void>> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        log.warn("HttpRequestMethodNotSupportedException: {}", ex.getMessage());

        return ResponseEntity
                .status(ErrorCode.COMMON_METHOD_NOT_ALLOWED.getStatus())
                .body(ApiResponse.error(ErrorCode.COMMON_METHOD_NOT_ALLOWED));
    }

    /**
     * multipart 업로드 최대 크기 초과
     *
     * 현재 ErrorCode에 MEDIA_FILE_SIZE_EXCEEDED 가 있으므로 여기에 연결
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSizeExceeded(MaxUploadSizeExceededException ex) {
        log.warn("MaxUploadSizeExceededException: {}", ex.getMessage());

        return ResponseEntity
                .status(ErrorCode.MEDIA_FILE_SIZE_EXCEEDED.getStatus())
                .body(ApiResponse.error(ErrorCode.MEDIA_FILE_SIZE_EXCEEDED));
    }

    /**
     * DB 제약조건 위반
     *
     * 등록된 제약조건은 도메인 에러로 변환하고, 알 수 없는 무결성 위반은
     * 내부 정보가 노출되지 않도록 공통 서버 오류로 응답한다.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(
            DataIntegrityViolationException ex
    ) {
        return databaseConstraintErrorResolver.resolve(ex)
                .map(errorCode -> {
                    log.warn(
                            "Database constraint violation: code={}, status={}",
                            errorCode.getCode(),
                            errorCode.getStatus()
                    );

                    return ResponseEntity
                            .status(errorCode.getStatus())
                            .body(ApiResponse.<Void>error(errorCode));
                })
                .orElseGet(() -> {
                    log.error("Unhandled data integrity violation", ex);

                    return ResponseEntity
                            .status(ErrorCode.COMMON_INTERNAL_SERVER_ERROR.getStatus())
                            .body(ApiResponse.error(ErrorCode.COMMON_INTERNAL_SERVER_ERROR));
                });
    }

    /**
     * 예상하지 못한 모든 예외의 최종 fallback
     *
     * 정책:
     * - 반드시 error 레벨 + stack trace 기록
     * - 외부에는 상세 내부 정보 노출 금지
     * - COMMON_INTERNAL_SERVER_ERROR 로 통일
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnknown(Exception ex) {
        log.error("Unhandled exception", ex);

        return ResponseEntity
                .status(ErrorCode.COMMON_INTERNAL_SERVER_ERROR.getStatus())
                .body(ApiResponse.error(ErrorCode.COMMON_INTERNAL_SERVER_ERROR));
    }
}
