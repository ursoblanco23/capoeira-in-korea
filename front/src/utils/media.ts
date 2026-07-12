const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// 예: dev=http://localhost:8080/api, prod=""

export function resolveMediaUrl(path?: string | null): string {
    if (!path) return "";

    // 이미 절대 URL이면 그대로 사용 (확장성)
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    // 개발 환경에서는 backend origin 붙이기
    if (import.meta.env.DEV) {
        if (!API_BASE_URL) {
            console.warn("VITE_API_BASE_URL is not defined");
            return path;
        }
        return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
    }

    // 운영 환경에서는 path 그대로 (같은 도메인)
    return path;
}
