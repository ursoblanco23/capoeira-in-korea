export const normalizePhone = (v: string): string => {
    // 숫자만 남기고, 010-1234-5678 형태로 보기 좋게 바꿔줌
    // 용도: input 필드 표시, 화면 출력
    // 특징: 입력 중에도 자동으로 하이픈 추가
    const digits = v.replace(/[^\d]/g, "");  // 1. 숫자만 추출
    if (digits.length <= 3) return digits;    // 2. 길이별 분기
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// 010, 02, 031 형식 처리
export const formatKoreanPhoneInput = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.startsWith('02')) {
        if (digits.length <= 2) {
            return digits;
        }

        if (digits.length <= 5) {
            return `${digits.slice(0, 2)}-${digits.slice(2)}`;
        }

        if (digits.length <= 9) {
            return [
                digits.slice(0, 2),
                digits.slice(2, 5),
                digits.slice(5),
            ].join('-');
        }

        return [
            digits.slice(0, 2),
            digits.slice(2, 6),
            digits.slice(6, 10),
        ].join('-');
    }

    if (digits.length <= 3) {
        return digits;
    }

    if (digits.length <= 6) {
        return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }

    if (digits.length <= 10) {
        return [
            digits.slice(0, 3),
            digits.slice(3, 6),
            digits.slice(6, 10),
        ].join('-');
    }

    return [
        digits.slice(0, 3),
        digits.slice(3, 7),
        digits.slice(7, 11),
    ].join('-');
};

export type PhoneDisplayStyle = 'international' | 'national';

export const formatPhoneForDisplay = (
    phone: string | null | undefined,
    style: PhoneDisplayStyle = 'international',
): string => {
    if (!phone) {
        return '';
    }

    const digits = phone.replace(/\D/g, '');

    let nationalDigits: string;

    if (digits.startsWith('82')) {
        nationalDigits = `0${digits.slice(2)}`;
    } else if (digits.startsWith('0')) {
        nationalDigits = digits;
    } else {
        return phone;
    }

    const nationalPhone = formatKoreanPhoneInput(nationalDigits);

    if (style === 'national') {
        return nationalPhone;
    }

    return `+82-${nationalPhone.slice(1)}`;
};

// 한국 전화번호를 국제 형식으로 정규화하는 함수 (예: 010-1234-5678 → 821012345678)
export const normalizeKoreanPhone= (phone: string): string | null => {
    // null 허용
    if (!phone) return null;

    // 모든 비숫자 제거
    const cleaned = phone.replace(/\D/g, '');

    // 한국 번호 패턴 맞추기
    if (cleaned.startsWith('0')) {
        // 01012345678 → 821012345678
        return '82' + cleaned.slice(1);
    }

    if (cleaned.startsWith('82')) {
        return cleaned;
    }

    if (cleaned.startsWith('+82')) {
        return cleaned.slice(1);  // + 제거 → 8210...
    }

    // 유효하지 않으면 에러 or 그대로 반환 (팀 정책에 따라)
    throw new Error('Invalid Korean phone number');
}