export interface Logger {
    info: (message: string, data?: unknown) => void;
    warn: (message: string, data?: unknown) => void;
    error: (message: string, data?: unknown) => void;
}

export const createLogger = (): Logger => {
    const isDev = import.meta.env.DEV;

    return {
        info: (message, data) => {
            if (isDev) console.info(`[API] ${message}`, data);
        },
        warn: (message, data) => {
            if (isDev) console.warn(`[API] ${message}`, data);
        },
        error: (message, data) => {
            if (isDev) console.error(`[API] ${message}`, data);
        },
    };
};