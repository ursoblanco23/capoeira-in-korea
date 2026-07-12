package io.github.ursoblanco23.capoeira_in_korea_backend.common.util;

public class ValidationUtils {

    public static boolean isValidKoreanPhone(String normalizedPhone) {
        // 정규화된 번호 검증: 82로 시작하고 총 12자리 (8210xxxxxxxx)
        return normalizedPhone != null && normalizedPhone.matches("^82\\d{10}$");
    }

    // 다른 validation 예시
    public static boolean isValidEmail(String email) {
        return email != null && email.matches("^[\\w-_.+]*[\\w-_.]@([\\w]+[.])+[\\w]{2,}$");
    }
}
