export interface Dojang {
    id: number;
    name: string;
    zipCode: string;
    roadAddress: string;
    detailAddress: string;
    sidoName: string;
    sigunguName: string;
    eupmyeondongName: string;
    latitude: number;
    longitude: number;
    phone: string;
    priceRange?: string;
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
        zipCode: string;
        roadAddress: string;
        detailAddress: string;
        sidoName: string;
        sigunguName: string;
        eupmyeondongName: string;
        latitude: string;
        longitude: string;
        phone: string;
        priceRange: string;
        instructorName: string;
        description: string;
        registrantId: string;
        altText: string;
    }
    file: {
        thumbnailImage: File | null;
    }
}

export interface CreateDojangResponse { // 특별한 응답 데이터 필요 없을 듯 성공 여부만 확인하기.
    createdDojangId: number;
}
export interface UpdateDojangResponse {
    updatedDojangId: number;
}

export interface ClassSchedule {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'all';
    instructor?: string;
}

export interface DojangListResponse {
    dojangs: Dojang[];

    // total: number;
    // page: number;
    // limit: number;
    // hasNext: boolean;
    // hasPrev: boolean;
}
