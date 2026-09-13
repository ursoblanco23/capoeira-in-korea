import type {UserMeDto} from "@/services/api/user/types/UserMeDto.ts";
import {userApi} from "../api/userApi.ts";
import {assertSuccess, assertSuccessData} from "@/services/api/utils/assertSuccess.ts";
import {useAuthStore} from "@/stores/authStore.ts";

export const userService = {
    getMe: async (): Promise<UserMeDto> => {
        const apiResponse = await userApi.getMe();
        return assertSuccessData(apiResponse, "내 정보 조회에 실패했습니다.");
    },

    updateProfileImage: async (formData: FormData ) => {
        const apiResponse = await userApi.updateProfileImage(formData);
        const userMeDto = assertSuccessData(apiResponse, "프로필 이미지 등록에 실패했습니다.");

        useAuthStore.getState().setMe(userMeDto);
    },

    withdrawMyAccount: async () => {
        const ApiReponse = await userApi.handleWithdrawMyAccount();
        assertSuccess(ApiReponse, "회원 탈퇴 처리 중 오류가 발생했습니다.");
    },

}
