export interface FieldErrorDetail {
    field: string; //검증 실패한 필드명
    rejectedValue: unknown; //사용자가 입력한 값
    reason: string; //검증 실패 메시지
}