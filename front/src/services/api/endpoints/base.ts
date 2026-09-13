export const STATIC_PATH = `/upload`;

//BASE 경로 상수 정의
const DOJANG_BASE = `/dojangs`;
const USER_BASE = `/users`;

// API 엔드포인트 상수들을 네임스페이스로 그룹화
export const ENDPOINTS = {
    // 도장 관련 엔드포인트
    DOJANG: {
        LIST: DOJANG_BASE,
        DETAIL: (id: number) => `${DOJANG_BASE}/${id}`,
        CREATE: DOJANG_BASE,
        UPDATE: (id: number) => `${DOJANG_BASE}/${id}`,
        DELETE: (id: number) => `${DOJANG_BASE}/${id}`,
    },

    //TODO: 기존 껀데 수정했음 -> 해당 서비스 부분 수정 해야함
    // DOJANG: {
    //     BASE: `/dojangs`,
    //     GET_DOJANGS: `${PUBLIC_PATH}/dojangs`,
    //     SEARCH: `${PUBLIC_PATH}/dojangs?searchParam=`,
    //     CREATE: `/dojangs`,
    //     DELETE: (id: number) => `/dojangs/${id}`,
    // },

    // 사용자 관련 엔드포인트 (향후 확장용)
    USER: {
        ME: `${USER_BASE}/me`,
        PROFILE: `/users/profile`,
        BY_ID: (id: number | string) => `/users/${id}`,
        WITHDRAW_ACCOUNT: `${USER_BASE}/me`,
    },

    // 인증 관련 엔드포인트
    AUTH: {
        SIGN_UP: `/auth/signup`,
        LOGIN: `/auth/login`,
        REFRESH: `/auth/refresh`,
        LOGOUT: `/auth/logout`,
        FORGOT_PASSWORD: `/auth/forgot-password`,
        RESET_PASSWORD: `/auth/reset-password`,
        CHANGE_PASSWORD: `/auth/password`,
    },

    // 커뮤니티 관련 엔드포인트 (향후 확장용)
    COMMUNITY: {
        POSTS: `/posts`,
        EVENTS: `/events`,
        GROUPS: `/groups`,
    },

    // 파일 업로드 관련
    UPLOAD: {
        IMAGE: `${STATIC_PATH}/images`,
        // PROFILE_IMAGE: `${STATIC_PATH}/profile-image`,
        // DOJANG_IMAGE: `${STATIC_PATH}/dojang-image`,
    },
} as const;