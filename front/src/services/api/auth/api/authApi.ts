// endpoints/authApi.ts (향후 확장용)
import {ENDPOINTS} from "../../endpoints/base.ts";
import {api} from "../../client";
import type {ApiResponse} from "src/services/api/types/apiResponse.ts";
import type {AccessTokenDto, LoginRequestDto, SignupRequestDto, SignupResponse} from "src/services/api/types/authApiTypes.ts";
import type {ChangePasswordRequest} from "@/services/api/auth/types/ChangePasswordRequest.ts";

// { withCredentials: true }가 없으면
// → 쿠키를 보내지도 않고
// → 서버가 새로 준 쿠키도 받지(저장하지) 않음
// -> client.ts 에서 전역 설정으로 처리함
// 주소 상수는 endpoints/base에서 가져오기 (순환참조 예방)
export const authApi = {
    login: (credentials: LoginRequestDto):Promise<ApiResponse<AccessTokenDto>> => {
        console.log("authApi.login called with credentials:", credentials);
        return api.post(ENDPOINTS.AUTH.LOGIN, credentials);
    },

    signup: (userData: SignupRequestDto): Promise<ApiResponse<SignupResponse>> => {
        return api.post(
            ENDPOINTS.AUTH.SIGN_UP
            , userData //axios가 자동으로 JSON으로 변환
        );
    },

    logout: (): Promise<ApiResponse<void>> => {
        return api.post(ENDPOINTS.AUTH.LOGOUT);
    },

    changePassword: (changePasswordRequest: ChangePasswordRequest): Promise<ApiResponse<void>> => {
        return api.patch(
            ENDPOINTS.AUTH.CHANGE_PASSWORD,
            changePasswordRequest
        );
    }


}