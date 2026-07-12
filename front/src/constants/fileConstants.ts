export const THUMBNAIL_IMG_UPLOAD_CONFIG = {
    MAX_SIZE: 2 * 1024 * 1024, // 최대 허용 크기: 2MB
    RECOMMENDED_MAX_SIZE: 500 * 1024, // 권장 크기: 500KB

    ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'] as string[],
    ACCEPT_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as string[],

    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,

    RECOMMENDED_WIDTH: 480,
    RECOMMENDED_HEIGHT: 320,

    RECOMMENDED_RATIO: 3 / 2, // 계산용
    RECOMMENDED_RATIO_TEXT: '3:2', // 표시용
} as const;