export const normalizePhone = (v: string): string => {
    // 숫자만 남기고, 010-1234-5678 형태로 보기 좋게 바꿔줌
    // 용도: input 필드 표시, 화면 출력
    // 특징: 입력 중에도 자동으로 하이픈 추가
    const digits = v.replace(/[^\d]/g, "");  // 1. 숫자만 추출
    if (digits.length <= 3) return digits;    // 2. 길이별 분기
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

// 한국 전화번호를 국제 형식으로 정규화하는 함수 (예: 010-1234-5678 → 821012345678)
export const normalizeKoreanPhone= (phone: string): string => {
    console.log('phone in normalizeKoreanPhone: ', phone);

    // 모든 비숫자 제거
    const cleaned = phone.replace(/\D/g, '');
    console.log('cleaned: ', cleaned);

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