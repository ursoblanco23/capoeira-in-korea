package io.github.ursoblanco23.capoeira_in_korea_backend.common.util;

public class PhoneUtils {
    public static String normalizeKoreanPhone(String phone) {
        // 모든 비숫자 제거
        String cleaned = phone.replaceAll("[^\\d]", "");

        // 한국 번호 패턴 맞추기
        if (cleaned.startsWith("0")) {
            // 01012345678 → 821012345678
            return "82" + cleaned.substring(1);
        }
        if (cleaned.startsWith("82")) {
            return cleaned;
        }
        if (cleaned.startsWith("+82")) {
            // +82 제거 → 8210...
            return cleaned.substring(3);  // "+82"는 길이 3이므로 substring(3)
        }

        // 유효하지 않으면 예외 발생 (팀 정책에 따라 변경 가능, e.g., null 반환)
        throw new IllegalArgumentException("Invalid Korean phone number");
    }

    // 사용 예시 (테스트나 서비스에서 호출)
    public static void main(String[] args) {
        String raw = "010-2222-2222";
        String stored = normalizeKoreanPhone(raw);  // "821022222222"
        System.out.println(stored);
    }
}