package io.github.ursoblanco23.capoeira_in_korea_backend.common.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PhoneUtilsTest {

    @Test
    void normalizesKoreanPhoneNumbersToE164() {
        assertThat(PhoneUtils.normalizeKoreanPhoneToE164("010-1234-5678"))
                .isEqualTo("+821012345678");
        assertThat(PhoneUtils.normalizeKoreanPhoneToE164("032-123-4567"))
                .isEqualTo("+82321234567");
        assertThat(PhoneUtils.normalizeKoreanPhoneToE164("02-1234-5678"))
                .isEqualTo("+82212345678");
    }

    @Test
    void normalizesPhoneUsingCaseInsensitiveRegionCode() {
        assertThat(PhoneUtils.normalizePhoneToE164("010-1234-5678", "kr"))
                .isEqualTo("+821012345678");
        assertThat(PhoneUtils.normalizePhoneToE164("202-555-0123", "US"))
                .isEqualTo("+12025550123");
    }

    @Test
    void rejectsPhoneThatDoesNotMatchRegion() {
        assertThat(PhoneUtils.isValidPhone("+1 202-555-0123", "KR"))
                .isFalse();
        assertThatThrownBy(
                () -> PhoneUtils.normalizePhoneToE164("+1 202-555-0123", "KR")
        ).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void handlesOptionalAndInvalidValues() {
        assertThat(PhoneUtils.normalizePhoneToE164(" ", null)).isNull();
        assertThat(PhoneUtils.isValidPhone(null, "KR")).isFalse();
        assertThat(PhoneUtils.isValidPhone("010-1234-5678", "XX"))
                .isFalse();
    }
}
