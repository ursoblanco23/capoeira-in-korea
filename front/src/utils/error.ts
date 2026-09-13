import axios from "axios";
import type {ApiResponse} from "@/services/api/types/apiResponse.ts";
import {ApiError} from '@/utils/apiError.ts';

export function extractErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        return error.fieldErrors?.[0]?.reason ?? error.message;
    }

    if (axios.isAxiosError(error)) {
      const apiResponse: ApiResponse<void> | undefined = error.response?.data;

      let msg = "요청 처리 중 오류가 발생했어요.";

      if (apiResponse?.fieldErrors?.[0]?.reason) {
          msg = apiResponse.fieldErrors[0].reason;
      } else if (apiResponse?.error) {
          msg = apiResponse.error.message;
      }

        return msg;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "알 수 없는 오류가 발생했어요.";
}
