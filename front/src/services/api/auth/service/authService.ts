import type {SignupForm} from "@/services/api/user/types/SignupForm.ts";
import type {ApiResponse} from "@/services/api/types/apiResponse.ts";
import type {AccessTokenDto, LoginRequestDto, SignupResponse} from "@/services/api/types/authApiTypes.ts";
import {authApi} from "@/services/api/auth/api/authApi.ts";
import {toSignupRequestPayload} from "@/services/api/adapters/authAdapter.ts";
import {assertSuccess, assertSuccessData} from "@/services/api/utils/assertSuccess.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import {userService} from "@/services/api/user/service/userService.ts";
import {refreshAccessToken} from "@/services/api/client/refreshAccessToken.ts";
import type {ChangePasswordRequest} from "@/services/api/auth/types/ChangePasswordRequest.ts";


export const authService = {
    signup: (userData: SignupForm): Promise<ApiResponse<SignupResponse>> => {
        return authApi.signup(toSignupRequestPayload(userData));
    },

    /**
     * 로그인
     * - accessToken: zustand에 저장
     * - refreshToken: HttpOnly 쿠키로 저장되므로 프론트는 관여 X
     */
    login: async (credentials: LoginRequestDto): Promise<void> => {
        const res: ApiResponse<AccessTokenDto> = await authApi.login(credentials);
        const accessTokenDto = assertSuccessData(res, "로그인에 실패했어요.");

        useAuthStore.getState().setAuthenticatedSession(accessTokenDto);

        if (accessTokenDto) {
            const meDto = await userService.getMe();
            useAuthStore.getState().setMe(meDto);
        }
    },

    /**
     * 로그아웃
     * - 서버 logout 호출(쿠키 만료 내려줌)
     * - 프론트 accessToken 제거
     */
    logout: async (): Promise<void> => {
        try {
            await authApi.logout();
        } finally {
            useAuthStore.getState().clearSession();
        }
    },

    // silent refresh 전용 오케스트레이션 메서드
    async restoreSession(): Promise<void> {
        try {
            await refreshAccessToken();

            const meDto = await userService.getMe();
            useAuthStore.getState().setMe(meDto);
        } catch {
            //getMe 실패시 재인증 실패로 처리하도록 함.
            useAuthStore.getState().clearSession();
        }
    },

    async changePassword(changePasswordRequest: ChangePasswordRequest): Promise<void> {
        const result = await authApi.changePassword(changePasswordRequest);
        assertSuccess(result, "비밀번호 변경에 실패했습니다.");

        useAuthStore.getState().clearSession();
    }
}
