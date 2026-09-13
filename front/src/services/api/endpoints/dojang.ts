// import { api, createApiMethods } from '../client';
import { api } from '../client/index.ts';
import type { ApiResponse } from '../types/apiResponse.ts';
import type { Dojang, DojangSearchParams } from '@/types/dojang.ts';
import { ENDPOINTS } from './base';

// 도장 관련 API 함수들
export const dojangApi = {
    /**
     * 도장 목록 조회 (검색 포함)
     * params가 없으면 전체 도장 조회
     * @param params 도장명(name), 도로명주소(roadAddress), 상세주소(detailAddress) 기준 검색어
     */
    getDojangs: async (
        params?: DojangSearchParams
    ): Promise<ApiResponse<Dojang[]>> => {
        return api.get<Dojang[]>(ENDPOINTS.DOJANG.LIST, {
            params
        });
    },

    /**
     * 특정 도장 상세 조회
     * @param id 도장 ID
     */
    getDojangById: async (id: number): Promise<ApiResponse<Dojang>> => {
        return api.get<Dojang>(ENDPOINTS.DOJANG.DETAIL(id));
    },
    //
    // /**
    //  * 근처 도장 조회
    //  * @param latitude 위도
    //  * @param longitude 경도
    //  * @param radius 반경(km)
    //  */
    // getNearbyDojangs: async (
    //     latitude: number,
    //     longitude: number,
    //     radius: number = 5,
    // ): Promise<Response<DojangListResponse>> => {
    //     return api.get<DojangListResponse>(ENDPOINTS.DOJANG.NEARBY, {
    //         latitude,
    //         longitude,
    //         radius,
    //     });
    // },
    //
    // /**
    //  * 인기 도장 조회
    //  * @param limit 조회할 개수
    //  */
    // getPopularDojangs: async (
    //     limit: number = 10,
    // ): Promise<Response<DojangListResponse>> => {
    //     return api.get<DojangListResponse>(ENDPOINTS.DOJANG.POPULAR, { limit });
    // },
    //
    /**
     * 도장 생성
     * @param data 도장 생성 데이터
     */
    createDojang: async (
        data: FormData,
    ): Promise<ApiResponse<number>> => {
        return api.post<number>(ENDPOINTS.DOJANG.CREATE, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    /**
     * 도장 정보 수정
     * @param id 도장 ID
     * @param data 수정할 데이터
     */
    updateDojang: async (
        data: FormData,
        dojangId: number,
    ): Promise<ApiResponse<number>> => {
        return api.put<number>(ENDPOINTS.DOJANG.UPDATE(dojangId), data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    /**
     * 도장 삭제 (비활성화)
     * @param id 도장 ID
     */
    deleteDojang: async (id: number): Promise<ApiResponse<void>> => {
        return api.delete<void>(ENDPOINTS.DOJANG.DELETE(id));
    },
    //
    // /**
    //  * 도장명 중복 검사
    //  * @param name 검사할 도장명
    //  */
    // validateDojangName: async (
    //     name: string,
    // ): Promise<Response<{ isAvailable: boolean }>> => {
    //     return api.get<{ isAvailable: boolean }>(ENDPOINTS.DOJANG.VALIDATE_NAME, {
    //         name,
    //     });
    // },
    //
    // /**
    //  * 도장 검색 (간소화된 검색)
    //  * @param searchTerm 검색어
    //  */
    // searchDojangs: async (
    //     searchTerm: string,
    //     options?: Partial<DojangSearchParams>,
    // ): Promise<Response<DojangListResponse>> => {
    //     return dojangApi.getDojangs({
    //         searchVal: searchTerm,
    //         ...options,
    //     });
    // },
} as const;