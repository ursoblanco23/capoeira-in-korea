import { ApiError } from "./apiError";

// 멱등 메서드만 retry -> 따라서 POST는 기본적으로 retry 대상에서 제외
export const createRetryLogic = (maxRetries: number, baseDelayMs: number) => {
    const totalAttempts = Math.max(1, 1 + maxRetries); // 최소 1회 시도

    return async <T>(fn: () => Promise<T>): Promise<T> => {
        let lastError: unknown;

        for (let attempt = 1; attempt <= totalAttempts; attempt++) {
            try {
                return await fn();
            } catch (err) {
                lastError = err;

                // ✅ 재시도 불가 조건이면 즉시 throw
                if (!shouldRetry(err)) {
                    throw err;
                }

                // ✅ 마지막 시도까지 왔으면 throw
                if (attempt === totalAttempts) {
                    throw err;
                }

                // ✅ exponential backoff (jitter 옵션은 팀마다)
                // 서버 과부하 방지
                const waitTime = baseDelayMs * Math.pow(2, attempt - 1);
                await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
        }

        throw lastError;
    };
};

const shouldRetry = (err: unknown): boolean => {
    // ApiError로 표준화되어 들어온다는 전제 (인터셉터에서 ApiError로 던지니까)
    if (err instanceof ApiError) {
        const status = err.status;

        // status가 없으면(네트워크/CORS 등) retry 대상
        if (status === undefined) return true;

        // 401은 인터셉터에서 refresh 처리 → retry.ts에서는 재시도하지 않음
        if (status === 401) return false;

        // 클라이언트 에러(4xx)는 재시도 금지 (단, 408/429는 예외로 retry 가능)
        if (status >= 400 && status < 500) {
            return status === 408 || status === 429;
        }

        // 서버 에러(5xx)는 retry 대상
        if (status >= 500 && status < 600) return true;

        return false;
    }

    // ApiError가 아니면(예상 외 throw) 보수적으로 재시도하지 않음
    // (원하면 true로 둬도 되지만, 실무에서는 보통 false가 안전)
    return false;
};
