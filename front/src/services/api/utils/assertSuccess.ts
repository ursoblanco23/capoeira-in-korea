import type { ApiResponse } from "@/services/api/types/apiResponse";
import { ApiError } from "@/utils/apiError";

function throwApiError(res: ApiResponse<unknown>, fallbackMsg: string): never {
    throw new ApiError(
        res.error?.code ?? "UNKNOWN_ERROR",
        res.error?.message ?? fallbackMsg,
        res.error?.status ?? 0,
        res.fieldErrors
    );
}
// API 응답이 성공인지 검증하는 유틸 함수
// 응답 data가 없어도 되는 경우에 사용
export function assertSuccess(res: ApiResponse<unknown>, fallbackMsg: string): void {
    if (!res.success) {
        throwApiError(res, fallbackMsg);
    }
}

// data가 반드시 필요한 경우에 사용
export function assertSuccessData<T>(res: ApiResponse<T>, fallbackMsg: string): T {
    if (!res.success) {
        throwApiError(res, fallbackMsg);
    }

    if (res.data == null) {
        throw new ApiError(
            res.error?.code ?? "NO_DATA",
            fallbackMsg,
            res.error?.status ?? 0,
            res.fieldErrors
        );
    }

    return res.data;
}