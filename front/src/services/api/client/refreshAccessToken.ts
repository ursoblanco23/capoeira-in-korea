import type { ApiResponse } from "../types/apiResponse";
import type { AccessTokenDto } from "@/services/api/types/authApiTypes";
import { refreshClient } from "./refreshClient";
import { useAuthStore } from "@/stores/authStore";
import { ApiError } from "@/utils/apiError";
import { normalizeApiError } from "../utils/normalizeApiError";
import {ENDPOINTS} from "@/services/api/endpoints";

let refreshPromise: Promise<void> | null = null;
const refreshErrorDefaultMessage = "세션이 만료되었습니다. 다시 로그인해주세요.";

const doRefreshAccessToken = async (): Promise<void> => {
    try {
        const res = await refreshClient.post<ApiResponse<AccessTokenDto>>(ENDPOINTS.AUTH.REFRESH);
        const body = res.data;

        if (!body.success || !body.data) {
            throw new ApiError(
                body.error?.code ?? "AUTH-REFRESH-FAILED",
                body.error?.message ?? refreshErrorDefaultMessage,
                body.error?.status ?? 401,
            );
        }

        const accessTokenDto = body.data

        if (!accessTokenDto.accessToken) {
            throw new ApiError(
                "AUTH-REFRESH-FAILED",
                "Access token is missing after refresh",
                401,
            )
        }

        useAuthStore.getState().setAuthenticatedSession(accessTokenDto);
    } catch (error) {
        // refresh 실패는 인증 상태 복구 실패로 보는 게 일반적
        useAuthStore.getState().clearSession();

        const refreshApiError = normalizeApiError(
            error,
            refreshErrorDefaultMessage
        );

        throw refreshApiError;
    }
};

//single-flight 패턴 적용: 동시에 여러 요청이 들어와도 refreshAccessToken이 한 번만 실행되도록 함
export const refreshAccessToken = async (): Promise<void> => {
    if (!refreshPromise) {
        refreshPromise = doRefreshAccessToken().finally(() => {
            refreshPromise = null;
        });
    }

    return refreshPromise;
};