import type {CreateDojangResponse, Dojang, DojangSearchParams, UpdateDojangResponse} from "@/types/dojang.ts";
import {dojangApi} from "@/services/api/endpoints";
import {ApiError} from "@/utils/apiError.ts";
import {COMMON_ERRORS} from "@/constants/errorCodes.ts";

const api = dojangApi;

export const dojangService = {

    getDojangs: async (searchParams?: DojangSearchParams): Promise<Dojang[]> => {
        const res = await api.getDojangs(searchParams);
        return res.data?? [];
    },

    createDojang: async (submitData: FormData): Promise<CreateDojangResponse> => {
        const res = await api.createDojang(submitData);
        if (res.data === undefined) {
            throw new ApiError(COMMON_ERRORS.NO_DATA.code, '도장 ID가 반환되지 않았습니다.');
        }
        return { createdDojangId: res.data };
    },

    updateDojang: async (dojangId: number, submitData: FormData): Promise<UpdateDojangResponse> => {
        const res = await api.updateDojang(dojangId, submitData);
        if (res.data === undefined) {
            throw new ApiError(COMMON_ERRORS.NO_DATA.code, '도장 ID가 반환되지 않았습니다.');
        }
        return { updatedDojangId: res.data };
    },

    deleteDojnag: async (dojangId: number): Promise<void> => {
        const response = await api.deleteDojang(dojangId);
        if (!response.success) {
            throw new ApiError(COMMON_ERRORS.DELETE_FAILED.code, `도장ID: ${dojangId}, 삭제에 실패했습니다.`);
        }
    }

}

export default dojangService;


