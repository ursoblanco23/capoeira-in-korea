import type { ApiConfig } from "../types/apiConfig";

export const
    DEFAULT_CONFIG: Required<ApiConfig> = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    maxRetries: 1,
    retryDelayMs: 1000,
};