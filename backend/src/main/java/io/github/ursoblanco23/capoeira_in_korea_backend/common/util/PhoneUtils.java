package io.github.ursoblanco23.capoeira_in_korea_backend.common.util;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;
import org.springframework.util.StringUtils;

import java.util.Locale;

public final class PhoneUtils {

    private static final String KOREA_REGION_CODE = "KR";
    private static final PhoneNumberUtil PHONE_NUMBER_UTIL =
            PhoneNumberUtil.getInstance();

    private PhoneUtils() {
    }

    public static boolean isValidPhone(String phone, String regionCode) {
        if (!StringUtils.hasText(phone) || !StringUtils.hasText(regionCode)) {
            return false;
        }

        try {
            String normalizedRegionCode = normalizeRegionCode(regionCode);
            PhoneNumber parsedPhone = parsePhone(phone, normalizedRegionCode);

            return PHONE_NUMBER_UTIL.isValidNumberForRegion(
                    parsedPhone,
                    normalizedRegionCode
            );
        } catch (IllegalArgumentException | NumberParseException exception) {
            return false;
        }
    }

    /**
     * @param phone 일반적인 한국 전화번호 형식의 문자열
     * @return
     */
    public static boolean isValidKoreanPhone(String phone) {
        return isValidPhone(phone, KOREA_REGION_CODE);
    }

    /**
     * 전화번호를 지정된 지역 기준으로 파싱하고 검증한 후 E.164 형식으로 정규화한다.
     *
     * @param phone 정규화할 전화번호. {@code null} 또는 공백이면 {@code null}
     * @param regionCode ISO 3166-1 alpha-2 지역 코드. 대소문자를 구분하지 않는다.
     * @return E.164 형식으로 정규화된 전화번호 또는 입력 전화번호가 비어 있으면 {@code null}
     * @throws IllegalArgumentException 지원하지 않는 지역 코드이거나 해당 지역에서 유효하지 않은 전화번호인 경우
     */
    public static String normalizePhoneToE164(String phone, String regionCode) {
        if (!StringUtils.hasText(phone)) {
            return null;
        }

        if (!StringUtils.hasText(regionCode)) {
            throw invalidPhone();
        }

        try {
            String normalizedRegionCode = normalizeRegionCode(regionCode);
            PhoneNumber parsedPhone = parsePhone(phone, normalizedRegionCode);

            if (!PHONE_NUMBER_UTIL.isValidNumberForRegion(
                    parsedPhone,
                    normalizedRegionCode
            )) {
                throw invalidPhone();
            }

            return PHONE_NUMBER_UTIL.format(
                    parsedPhone,
                    PhoneNumberUtil.PhoneNumberFormat.E164
            );
        } catch (NumberParseException exception) {
            throw invalidPhone(exception);
        }
    }

    /**
     * 전화번호를 대한민국 기준으로 파싱하고 검증한 후 {@code +82}로 시작하는
     * E.164 형식으로 정규화한다.
     *
     * @param phone 정규화할 한국 전화번호. {@code null} 또는 공백이면 {@code null}
     * @return {@code +82}로 시작하는 E.164 형식의 전화번호 또는 입력값이 비어 있으면 {@code null}
     * @throws IllegalArgumentException 대한민국에서 유효하지 않은 전화번호인 경우
     */
    public static String normalizeKoreanPhoneToE164(String phone) {
        return normalizePhoneToE164(phone, KOREA_REGION_CODE);
    }

    private static PhoneNumber parsePhone(String phone, String regionCode)
            throws NumberParseException {
        return PHONE_NUMBER_UTIL.parse(phone.trim(), regionCode);
    }

    /**
     * regionCode가 지원되는 지역의 것인지 확인 후 normalized region code 반환
     * @param regionCode
     * @return
     */
    private static String normalizeRegionCode(String regionCode) {
        String normalizedRegionCode =
                regionCode.trim().toUpperCase(Locale.ROOT);

        if (!PHONE_NUMBER_UTIL
                .getSupportedRegions()
                .contains(normalizedRegionCode)) {
            throw invalidPhone();
        }

        return normalizedRegionCode;
    }

    private static IllegalArgumentException invalidPhone() {
        return new IllegalArgumentException(
                "지원하지 않는 전화번호 형식입니다."
        );
    }

    private static IllegalArgumentException invalidPhone(
            NumberParseException cause
    ) {
        return new IllegalArgumentException(
                "지원하지 않는 전화번호 형식입니다.",
                cause
        );
    }
}
