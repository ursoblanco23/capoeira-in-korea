import type {AccessTokenMeta} from "src/stores/authStore.ts";


export function isAccessTokenExpired(
    meta: AccessTokenMeta | null,
    bufferMs = 30_000
): boolean {
    if (!meta) return true;

    const expiresAtMs = meta.issuedAtMs + meta.expiresInSeconds * 1000;

    return Date.now() >= expiresAtMs - bufferMs;
}