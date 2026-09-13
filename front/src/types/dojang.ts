import type { AddressDto } from "@/services/api/types/AddressDto.ts";

export interface Dojang {
    id: number;
    name: string;
    address: AddressDto;
    latitude: number;
    longitude: number;
    phone: string;
    priceInfo?: string;
    instructorName: string;
    description?: string;
    createdAt: string; // "yyyy-MM-dd"
    updatedAt: string; // "yyyy-MM-dd"
    registrantId: number;
    thumbnailUrl?: string;
}

export interface DojangSearchParams {
    /** 도장명, 도로명주소, 상세주소를 대상으로 검색하는 키워드 */
    searchParam?: string;
}

export interface DojangFormRequest {
    data: {
        id?: string;
        name: string;
        address: {
            zipCode: string;
            roadAddress: string;
            detailAddress: string;
            sidoName: string;
            sigunguName: string;
            eupmyeondongName: string;
        };
        latitude: string;
        longitude: string;
        phone: string;
        priceInfo: string;
        instructorName: string;
        description: string;
        altText: string;
    }
    file: {
        thumbnailImage: File | null;
    }
}

export interface CreateDojangResponse {
    dojangId: number;
}
export interface UpdateDojangResponse {
    updatedDojangId: number;
}

export interface DojangListResponse {
    dojangs: Dojang[];

    // total: number;
    // page: number;
    // limit: number;
    // hasNext: boolean;
    // hasPrev: boolean;
}
