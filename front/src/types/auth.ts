export interface TokenStorage {
    getToken(): string | null;
    setToken(token: string): void;
    removeToken(): void;
    refreshToken(): Promise<string>;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}