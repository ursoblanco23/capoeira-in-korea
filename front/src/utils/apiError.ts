import type {FieldErrorDetail} from "@/services/api/types/FieldErrorDetail.ts";

// API 계층에서 밖으로 내보내는 표준 에러
export class ApiError extends Error {
    public readonly code: string;
    public readonly status: number;
    public readonly fieldErrors?: FieldErrorDetail[];

    constructor(code: string, message: string, status: number, fieldErrors?: FieldErrorDetail[]) {
        super(message);
        this.name = "ApiError"; // 에러 이름 설정
        this.code = code;
        this.status = status;
        this.fieldErrors = fieldErrors;

        // Error 클래스 상속 시 필요한 설정 (ES5 호환성)
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}