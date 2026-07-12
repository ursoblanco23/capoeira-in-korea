package io.github.ursoblanco23.capoeira_in_korea_backend.exception.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /* <작성 주의사항>
		1. 에러코드는 “원인 중심” 으로 만든다
		2. 문자열 code는 enum 이름과 최대한 맞춘다
		3. message는 사용자 메시지 기준으로 통일
		4. 내부 시스템 오류와 사용자 입력 오류를 구분
    * */

    // 네이밍 방식
    // ErrorCode: 도메인_상황
    // 역할: 자바 코드에서 개발자가 읽기 위한 이름

    // code: 도메인-유형-순번
    // 역할: 프론트 에러 처리/로그/모니터링/API 문서/외부 서비스 연동
    /* 특징:
        ✔ 변경되면 안 됨
        ✔ 규칙을 가져야 함
        ✔ 사람이 읽기보다 시스템 식별용
    * */
    /*ex)
      AUTH-UNAUTHORIZED-001
      AUTH-FORBIDDEN-002
      USER-NOT-FOUND-001
      USER-DUPLICATE-002

    /* ErrorCode 전체 표준 예시
        DOJANG_NOT_FOUND(
            "DOJANG-NOT-FOUND-0003",
            HttpStatus.NOT_FOUND,
            "도장을 찾을 수 없습니다."
        )
    * */

    // ========================================================================
    // AUTH (인증/인가)
    // ------------------------------------------------------------------------
    // 원칙:
    // - 401 Unauthorized : 인증 정보가 없거나 유효하지 않음
    // - 403 Forbidden    : 인증은 되었지만 접근 권한이 없음
    // ------------------------------------------------------------------------
    // auth 쪽은 refresh / access token 흐름에서 실제로 자주 분기되므로
    // 다른 도메인보다 조금 더 세분화해두는 편이 실무적으로 유리함
    // ========================================================================

    AUTH_INVALID_TOKEN(
            "AUTH-INVALID-TOKEN-0001",
            HttpStatus.UNAUTHORIZED,
            "유효하지 않은 토큰입니다."
    ),
    AUTH_EXPIRED_TOKEN(
            "AUTH-EXPIRED-TOKEN-0002",
            HttpStatus.UNAUTHORIZED,
            "만료된 토큰입니다."
    ),
    AUTH_UNSUPPORTED_TOKEN(
            "AUTH-UNSUPPORTED-TOKEN-0003",
            HttpStatus.UNAUTHORIZED,
            "지원하지 않는 토큰 형식입니다."
    ),
    AUTH_MALFORMED_TOKEN(
            "AUTH-MALFORMED-TOKEN-0004",
            HttpStatus.UNAUTHORIZED,
            "잘못된 형식의 토큰입니다."
    ),
    AUTH_SIGNATURE_INVALID(
            "AUTH-SIGNATURE-INVALID-0005",
            HttpStatus.UNAUTHORIZED,
            "토큰 서명이 유효하지 않습니다."
    ),
    AUTH_TOKEN_MISSING(
            "AUTH-TOKEN-MISSING-0006",
            HttpStatus.UNAUTHORIZED,
            "인증 토큰이 없습니다."
    ),

    // Refresh Token 관련
    AUTH_REFRESH_TOKEN_MISSING(
            "AUTH-REFRESH-TOKEN-MISSING-0007",
            HttpStatus.UNAUTHORIZED,
            "리프레시 토큰이 없습니다."
    ),
    AUTH_REFRESH_TOKEN_INVALID(
            "AUTH-REFRESH-TOKEN-INVALID-0008",
            HttpStatus.UNAUTHORIZED,
            "유효하지 않은 리프레시 토큰입니다."
    ),
    AUTH_REFRESH_TOKEN_EXPIRED(
            "AUTH-REFRESH-TOKEN-EXPIRED-0009",
            HttpStatus.UNAUTHORIZED,
            "리프레시 토큰이 만료되었습니다."
    ),
    AUTH_REFRESH_TOKEN_MISMATCH(
            "AUTH-REFRESH-TOKEN-MISMATCH-0010",
            HttpStatus.UNAUTHORIZED,
            "리프레시 토큰이 일치하지 않습니다."
    ),
    AUTH_REFRESH_TOKEN_NOT_FOUND(
            "AUTH-REFRESH-TOKEN-NOT-FOUND-0011",
            HttpStatus.UNAUTHORIZED,
            "저장된 리프레시 토큰 정보를 찾을 수 없습니다."
    ),

    AUTH_ACCESS_DENIED(
            "AUTH-ACCESS-DENIED-0012",
            HttpStatus.FORBIDDEN,
            "접근 권한이 없습니다."
    ),

    // 인증 주체(사용자) 관점에서 인증은 되었으나 더 이상 유효한 사용자가 아닌 경우
    AUTH_USER_NOT_FOUND(
            "AUTH-USER-NOT-FOUND-0013",
            HttpStatus.UNAUTHORIZED,
            "인증된 사용자 정보를 찾을 수 없습니다."
    ),

    AUTH_LOGIN_FAILED(
            "AUTH-LOGIN-FAILED-0014",
            HttpStatus.UNAUTHORIZED,
            "아이디 또는 비밀번호가 올바르지 않습니다."
    ),

    AUTH_NOT_REFRESH_TOKEN(
            "AUTH-NOT-REFRESH-TOKEN-0015",
            HttpStatus.UNAUTHORIZED,
            "리프레시 토큰이 아닙니다."
    ),

    AUTH_NOT_ACCESS_TOKEN(
            "AUTH-NOT-ACCESS-TOKEN-0016",
            HttpStatus.UNAUTHORIZED,
            "엑세스 토큰이 아닙니다."
    ),

    AUTH_ISSUER_INVALID(
            "AUTH-ISSUER-INVALID-0017",
            HttpStatus.UNAUTHORIZED,
            "토큰의 발급자(issuer)가 유효하지 않습니다."
    ),

    AUTH_UNAUTHORIZED(
            "AUTH-UNAUTHORIZED-0018",
            HttpStatus.UNAUTHORIZED,
            "인증이 필요합니다."
    ),

    // ========================================================================
    // USER (사용자)
    // ========================================================================

    USER_NOT_FOUND(
            "USER-NOT-FOUND-0001",
            HttpStatus.NOT_FOUND,
            "사용자를 찾을 수 없습니다."
    ),

    USER_DUPLICATE_EMAIL(
            "USER-DUPLICATE-EMAIL-0002",
            HttpStatus.CONFLICT,
            "이미 등록된 이메일입니다."
    ),

    USER_DUPLICATE_LOGIN_ID(
            "USER-DUPLICATE-LOGIN-ID-0003",
            HttpStatus.CONFLICT,
            "이미 사용 중인 아이디입니다."
    ),

    USER_DUPLICATE_NICKNAME(
            "USER-DUPLICATE-NICKNAME-0004",
            HttpStatus.CONFLICT,
            "이미 사용 중인 닉네임입니다."
    ),

    USER_UNAVAILABLE(
            "USER-UNAVAILABLE-0005",
            HttpStatus.FORBIDDEN,
            "비활성화되었거나 탈퇴한 계정입니다."
    ),


    // ========================================================================
    // DOJANG (도장)
    // ------------------------------------------------------------------------
    // 포괄적인 CREATE_FAILED / UPDATE_FAILED 같은 코드는 제외함.
    // 가능한 한 "무엇을 하다 실패했는지"보다 "왜 실패했는지" 중심으로 관리.
    // ========================================================================

    DOJANG_NOT_FOUND(
            "DOJANG-NOT-FOUND-0001",
            HttpStatus.NOT_FOUND,
            "도장을 찾을 수 없습니다."
    ),
    DOJANG_DUPLICATE(
            "DOJANG-DUPLICATE-0002",
            HttpStatus.CONFLICT,
            "이미 등록된 도장입니다."
    ),


    // ========================================================================
    // MEDIA (파일/미디어 정책 검증, 메타데이터, 미디어 도메인 처리)
    // ------------------------------------------------------------------------
    // MEDIA  : 업로드 파일의 정책/검증/도메인 처리
    // STORAGE: 실제 파일 시스템/스토리지 저장/삭제/경로 문제
    // ========================================================================

    MEDIA_EMPTY_FILE(
            "MEDIA-EMPTY-FILE-0001",
            HttpStatus.BAD_REQUEST,
            "파일이 비어있습니다."
    ),
    MEDIA_INVALID_MIME_TYPE(
            "MEDIA-INVALID-MIME-TYPE-0002",
            HttpStatus.BAD_REQUEST,
            "허용되지 않는 MIME 타입입니다."
    ),
    MEDIA_INVALID_EXTENSION(
            "MEDIA-INVALID-EXTENSION-0003",
            HttpStatus.BAD_REQUEST,
            "허용되지 않는 파일 확장자입니다."
    ),
    MEDIA_FILE_SIZE_EXCEEDED(
            "MEDIA-FILE-SIZE-EXCEEDED-0004",
            HttpStatus.BAD_REQUEST,
            "제한된 파일 크기를 초과했습니다."
    ),
    MEDIA_METADATA_EXTRACTION_FAILED(
            "MEDIA-METADATA-EXTRACTION-FAILED-0005",
            HttpStatus.INTERNAL_SERVER_ERROR,
            "미디어 메타데이터 추출에 실패했습니다."
    ),
    MEDIA_UPLOAD_FAILED(
            "MEDIA-UPLOAD-FAILED-0006",
            HttpStatus.INTERNAL_SERVER_ERROR,
            "미디어 업로드 처리에 실패했습니다."
    ),
    MEDIA_ATTACHMENT_NOT_FOUND(
            "MEDIA-ATTACHMENT-NOT-FOUND-0007",
            HttpStatus.NOT_FOUND,
            "미디어 연결 정보를 찾을 수 없습니다."
    ),
    MEDIA_UNSUPPORTED_TYPE(
            "MEDIA-UNSUPPORTED-TYPE-0008",
            HttpStatus.INTERNAL_SERVER_ERROR,
            "지정된 미디어 타입에 대해 등록된 유효성 검사기가 없습니다."
    ),


    // ========================================================================
    // STORAGE (파일 저장소 / 파일 시스템 / 스토리지)
    // ------------------------------------------------------------------------
    // STORAGE_INVALID_FILE_PATH:
    // - 일반적으로 많이 쓰는 형태로는 400(BAD_REQUEST) 처리하는 편이 무난함
    // - "클라이언트가 보낸 경로/파일명/입력값이 허용 정책에 맞지 않는다"는 의미로 사용 가능
    // - 나중에 보안 정책상 403으로 바꾸고 싶어지면 그때 조정 가능
    // ========================================================================

    STORAGE_FILE_SAVE_FAILED(
            "STORAGE-FILE-SAVE-FAILED-0001",
            HttpStatus.INTERNAL_SERVER_ERROR,
            "파일 저장에 실패했습니다."
    ),
    STORAGE_DIRECTORY_CREATE_FAILED(
            "STORAGE-DIRECTORY-CREATE-FAILED-0002",
            HttpStatus.INTERNAL_SERVER_ERROR,
            "업로드 디렉토리 생성에 실패했습니다."
    ),
    STORAGE_FILE_DELETE_FAILED(
            "STORAGE-FILE-DELETE-FAILED-0003",
            HttpStatus.INTERNAL_SERVER_ERROR,
            "파일 삭제에 실패했습니다."
    ),
    STORAGE_INVALID_FILE_PATH(
            "STORAGE-INVALID-FILE-PATH-0004",
            HttpStatus.BAD_REQUEST,
            "허용되지 않은 파일 경로입니다."
    ),


    // ========================================================================
    // COMMON (공통)
    // ------------------------------------------------------------------------
    // COMMON_INVALID_REQUEST:
    // - 요청 형식 자체가 잘못된 경우
    // - 필수 파라미터 누락, 타입 불일치, 잘못된 요청 구조 등
    //
    // COMMON_VALIDATION_ERROR:
    // - @Valid, Bean Validation, field validation 실패
    // - 즉 "요청 형식"은 맞지만 "입력값 검증"에 실패한 경우
    //
    // 둘 다 400이지만 의미를 구분해서 써야 나중에 헷갈리지 않음
    // ========================================================================

    COMMON_INVALID_REQUEST(
            "COMMON-INVALID-REQUEST-0001",
            HttpStatus.BAD_REQUEST,
            "잘못된 요청입니다."
    ),
    COMMON_VALIDATION_ERROR(
            "COMMON-VALIDATION-ERROR-0002",
            HttpStatus.BAD_REQUEST,
            "요청값 검증에 실패했습니다."
    ),
    COMMON_NOT_FOUND(
            "COMMON-NOT-FOUND-0003",
            HttpStatus.NOT_FOUND,
            "요청한 리소스를 찾을 수 없습니다."
    ),
    COMMON_METHOD_NOT_ALLOWED(
            "COMMON-METHOD-NOT-ALLOWED-0004",
            HttpStatus.METHOD_NOT_ALLOWED,
            "허용되지 않은 HTTP 메서드입니다."
    ),
    COMMON_INTERNAL_SERVER_ERROR(
            "COMMON-INTERNAL-SERVER-ERROR-0005",
            HttpStatus.INTERNAL_SERVER_ERROR,
            "서버 내부 오류가 발생했습니다."
    );

    private final String code;
    private final HttpStatus status;
    private final String message;
}