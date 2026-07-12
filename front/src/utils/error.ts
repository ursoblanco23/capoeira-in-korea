import axios from "axios";

export function extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? "요청 처리 중 오류가 발생했어요.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "알 수 없는 오류가 발생했어요.";
}
