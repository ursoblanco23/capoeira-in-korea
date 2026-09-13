import type {FieldErrorDetail} from "@/services/api/types/FieldErrorDetail.ts";

export interface ApiErrorBody {
    code: string;
    status: number;
    message: string;
}
export interface ApiResponse<T = void> {
    success: boolean;
    data?: T;
    message?: string; // 성공 시 메시지 (선택적)
    error?: ApiErrorBody;
    fieldErrors?: FieldErrorDetail[];
}