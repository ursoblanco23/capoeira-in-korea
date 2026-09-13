export const PAGE = {
    HOME: '/',
    DOJANG: (id: number | string) => `/dojang/${id}`,
    LOGIN: '/login',
    SIGN_UP: '/signup',
    MY_PAGE: '/mypage',
    CHANGE_PASSWORD: '/changePassword',

    // 관리자 도장 관리 관련
    ADMIN_DOJANG: '/admin/dojangs',
    ADMIN_DOJANG_REGISTER: 'register',
    ADMIN_DOJANG_EDIT: (id: number | string) => `edit/${id}`,

    UNAUTHORIZED: '/unauthorized',
    NOT_FOUND: '/not-found',
} as const

