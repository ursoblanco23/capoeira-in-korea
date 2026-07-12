export const PAGE = {
    HOME: '/',
    DOJANG: (id: number | string) => `/dojang/${id}`,
    LOGIN: '/login',
    SIGN_UP: '/signup',
    MY_PAGE: '/mypage',

    // 관리자 도장 관리 관련
    ADMIN_DOJANG: '/admin/dojangs',
    ADMIN_DOJANG_REGIST: '/admin/dojangs/regist',
    ADMIN_DOJANG_EDIT: (id: number | string) => `/admin/dojangs/${id}/edit`,
} as const

