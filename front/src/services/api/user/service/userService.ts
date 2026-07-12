import type {UserMeDto} from "@/services/api/user/types/UserMeDto.ts";
import {userApi} from "@/services/api/user/api/user.ts";
import {assertSuccessData} from "@/services/api/utils/assertSuccess.ts";
import {useAuthStore} from "@/stores/authStore.ts";


export const userService = {
    getMe: async (): Promise<UserMeDto> => {
        const apiResponse = await userApi.getMe();
        return assertSuccessData(apiResponse, "내 정보 조회에 실패했습니다.");
    },

    updateProfileImage: async (formData: FormData ) => {
        const apiResponse = await userApi.updateProfileImage(formData);
        const userMeDto = assertSuccessData(apiResponse, "프로필 이미지 등록에 실패했습니다.");

        console.log("updateProfileImage >>> userMeDto:", userMeDto);

        useAuthStore.getState().setMe(userMeDto);
    }

}
