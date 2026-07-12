import type {UserMeDto} from "@/services/api/user/types/UserMeDto.ts";
import {api} from "@/services/api/client";
import {ENDPOINTS} from "@/services/api/endpoints";


export const userApi = {
    getMe: () => api.get<UserMeDto>(ENDPOINTS.USER.ME),

    updateProfileImage: (formData: FormData) => api.post<UserMeDto>(ENDPOINTS.USER.PROFILE, formData),

}