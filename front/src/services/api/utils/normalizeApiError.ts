import axios from "axios";
import {ApiError} from "@/utils/apiError.ts";

// server에서 반환한 error관련 정보를 추출해서 반환
export function normalizeApiError(
    error: unknown,
    fallbackMessage = "요청 처리 중 오류가 발생했습니다."
): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    //axios 에러가 아닌 경우 (네트워크 오류, 타임아웃, 기타 JS 에러 등)
    if (!axios.isAxiosError(error)) {
        return new ApiError(
            "UNKNOWN_ERROR",
            error instanceof Error ? error.message : fallbackMessage,
            0
        );
    }

    const httpStatus = error.response?.status; //AxiosError 객체에서 HTTP 상태 코드 추출
    const apiResponse = error.response?.data;
    const serverErr = apiResponse?.error;

    const status = serverErr?.status ?? httpStatus ?? 0;
    const code = serverErr?.code ?? error.code ?? `HTTP_${status || 0}`;
    const message = serverErr?.message ?? fallbackMessage;
    const fieldErrors = apiResponse?.fieldErrors;

    return new ApiError(
        code,
        message,
        status,
        fieldErrors
    );
}