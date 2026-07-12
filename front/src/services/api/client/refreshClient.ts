import axios from "axios";
import { DEFAULT_CONFIG } from "./apiConfig";

// refreshClient는 access token이 만료되어 새로 고침이 필요한 경우에만 사용됩니다.
// 해당 파일에서는 순수하게 생성만 담당. 실제로 토큰 갱신 요청을 보내는 로직은 refreshToken.ts에 있습니다.
export const refreshClient = axios.create({
    baseURL: DEFAULT_CONFIG.baseURL,
    timeout: DEFAULT_CONFIG.timeout,
    withCredentials: true,
});