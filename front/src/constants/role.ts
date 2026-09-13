export const ROLE = {
    USER: "ROLE_USER",
    DOJANG_ADMIN: "ROLE_DOJANG_ADMIN",
    SITE_ADMIN: "ROLE_SITE_ADMIN",
} as const;

export type RoleName = (typeof ROLE)[keyof typeof ROLE];