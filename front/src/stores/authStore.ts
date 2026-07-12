import { create } from "zustand";
import type {AccessTokenDto} from "@/services/api/types/authApiTypes.ts";
import type {UserMeDto} from "@/services/api/user/types/UserMeDto.ts";

export type AccessTokenMeta = {
    tokenType: "Bearer";
    expiresInSeconds: number;
    issuedAtMs: number;
};

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type AuthState = {
    accessToken: string | null;
    accessTokenMeta: AccessTokenMeta | null;
    authStatus: AuthStatus;
    me: UserMeDto | null;

    setAuthenticatedSession: (accessTokenDto: AccessTokenDto) => void;
    setMe: (meDto: UserMeDto) => void;
    clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    accessTokenMeta: null,
    authStatus: "checking",
    me: null,

    setAuthenticatedSession: (accessTokenDto: AccessTokenDto) =>
        set({
            accessToken: accessTokenDto.accessToken,
            accessTokenMeta:
                {
                    tokenType: accessTokenDto.tokenType,
                    expiresInSeconds: accessTokenDto.expiresInSeconds,
                    issuedAtMs: Date.now(),
                },
            authStatus: "authenticated",
        }),

    setMe: (meDto: UserMeDto) => {
        console.log("setMe profile url test: ", meDto.profileImgUrl);
        set({me: meDto});
    },
    clearSession: () =>
        set({
            accessToken: null,
            accessTokenMeta: null,
            authStatus: "unauthenticated",
            me: null
        }),
}));
