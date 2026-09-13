import type {CreateDojangResponse, Dojang, DojangSearchParams, UpdateDojangResponse} from "@/types/dojang.ts";
import {dojangApi} from "@/services/api/endpoints";
import {assertSuccess, assertSuccessData} from "@/services/api/utils/assertSuccess.ts";

const api = dojangApi;

export const dojangService = {

    getDojangs: async (searchParams?: DojangSearchParams): Promise<Dojang[]> => {
        const apiResponse = await api.getDojangs(searchParams);
        return apiResponse.data?? [];
    },

    getDojangById: async (dojangId: number): Promise<Dojang> => {
        const apiResponse = await api.getDojangById(dojangId);

        return assertSuccessData(
            apiResponse,
            `도장ID: ${dojangId} 정보를 찾을 수 없습니다.`,
        );
    },

    createDojang: async (submitData: FormData): Promise<CreateDojangResponse> => {
        const apiResponse = await api.createDojang(submitData);

        const createdDojangId = assertSuccessData(apiResponse, '도장 ID가 반환되지 않았습니다.');

        return { dojangId: createdDojangId };
    },

    updateDojang: async (submitData: FormData, dojangId: number): Promise<UpdateDojangResponse> => {
        const apiResponse = await api.updateDojang(submitData, dojangId);

        const updatedDojangId = assertSuccessData(apiResponse, '도장 ID가 반환되지 않았습니다.');

        return { updatedDojangId };
    },

    deleteDojnag: async (dojangId: number): Promise<void> => {
        const apiResponse = await api.deleteDojang(dojangId);

        assertSuccess(apiResponse, `도장ID: ${dojangId}, 삭제에 실패했습니다.`);
    }

}

export default dojangService;


