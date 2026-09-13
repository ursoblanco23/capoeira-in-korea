import axios, {AxiosError} from "axios";
import type {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import type {ApiResponse} from "../types/apiResponse";
import type {ApiConfig} from "../types/apiConfig";
import {ApiError} from "@/utils/apiError";
import {createRetryLogic} from "@/utils/retry";
import {useAuthStore} from "@/stores/authStore";
import {normalizeApiError} from "../utils/normalizeApiError";
import {DEFAULT_CONFIG} from "./apiConfig";
import {createLogger} from "./logger";
import {refreshAccessToken} from "./refreshAccessToken";
import {ENDPOINTS} from "@/services/api/endpoints/base";
import {isAccessTokenExpired} from "../auth/utils/accessTokenUtils.ts";

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
const PUBLIC_AUTH_PATHS = [
    ENDPOINTS.AUTH.SIGN_UP,
    ENDPOINTS.AUTH.LOGIN,
];

const createApiClient = (config: ApiConfig = {}): AxiosInstance => {
    const finalConfig = {...DEFAULT_CONFIG, ...config};
    const logger = createLogger();
    const client = axios.create({
        baseURL: finalConfig.baseURL,
        timeout: finalConfig.timeout,
        withCredentials: true,
        headers: {},
        paramsSerializer: (params) => {
            // Axios의 기본 paramsSerializer는 URLSearchParams를 사용하지만, 이 방식은 배열이나 객체를 제대로 직렬화하지 못할 수 있습니다. 따라서 커스텀 paramsSerializer를 구현하여 모든 값이 문자열로 변환되고, undefined나 null인 값은 제외되도록 합니다.
            const searchParams = new URLSearchParams();

            Object.entries(params || {}).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });

            return searchParams.toString();
        },
    });

    client.interceptors.request.use(
        async (req: RetryableRequestConfig) => {
            const url = req.url ?? "";
            const isPublicAuthPath = PUBLIC_AUTH_PATHS.some((path) => url.startsWith(path));

            const accessTokenMeta = useAuthStore.getState().accessTokenMeta;

            // AccessToken 유효성 체크
            if (!isPublicAuthPath && accessTokenMeta !== null && isAccessTokenExpired(accessTokenMeta)) {
                try {
                    await refreshAccessToken();
                } catch (err) {
                    const refreshErr = normalizeApiError(
                        err,
                        "세션이 만료되었습니다. 다시 로그인해주세요."
                        );

                    logger.warn("Refresh failed before request", {
                        url,
                        code: refreshErr.code,
                        status: refreshErr.status,
                        message: refreshErr.message,
                        fieldErrors: refreshErr.fieldErrors,
                    });

                    return Promise.reject(refreshErr);
                }
            }

            const accessToken = useAuthStore.getState().accessToken;

            // 공개 인증 경로가 아닌 경우에만 토큰을 추가합니다. 로그인/회원가입 요청에는 토큰이 필요하지 않으므로, 해당 요청에서는 Authorization 헤더를 생략하여 불필요한 인증 시도를 방지합니다.
            if (!isPublicAuthPath && accessToken) {
                req.headers = req.headers ?? {};
                req.headers.Authorization = `Bearer ${accessToken}`;
            }

            const isFormData =
                typeof FormData !== "undefined" && req.data instanceof FormData;

            if (isFormData) {
                if (req.headers) {
                    /*
                    FormData는 브라우저가 자동으로 헤더를 만든다.
                    따라서 Content-Type을 명시적으로 설정하면 안 된다.
                    만약 Content-Type이 이미 설정되어 있다면,
                    이를 삭제하여 브라우저가 올바르게 처리할 수 있도록 한다.
                    * */
                    delete (req.headers as Record<string, unknown>)["Content-Type"];
                }
            } else {
                req.headers = req.headers ?? {};
                if (!(req.headers as Record<string, unknown>)["Content-Type"]) {
                    (req.headers as Record<string, unknown>)["Content-Type"] = "application/json";
                }
            }

            logger.info(`${req.method?.toUpperCase()} ${req.url}`, {
                params: req.params,
                data: isFormData ? "[FormData]" : req.data,
            });

            return req;
        },
        (error) => {
            logger.error("Request interceptor error", error);
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        (response: AxiosResponse<ApiResponse<unknown>>) => {
            if (process.env.NODE_ENV === "development") {
                logger.info(`Response ${response.status}`, {
                    url: response.config.url,
                    data: response.data,
                });
            }
            return response;
        },
        async (error: AxiosError<ApiResponse<unknown>>) => {
            const reqConfig = error.config as RetryableRequestConfig | undefined;
            const url = reqConfig?.url ?? "";
            const isPublicAuthPath = PUBLIC_AUTH_PATHS.some((path) => url.startsWith(path));

            // 네트워크/전송 오류 처리 (서버에서 응답이 없는 경우)
            if (!error.response) {
                let message = "네트워크 연결을 확인해주세요.";

                if (error.code === "ECONNABORTED") {
                    message = "요청 시간이 초과되었습니다.";
                } else if (error.code === "ERR_CANCELED") {
                    message = "요청이 취소되었습니다.";
                }

                logger.error("Network/transport error", {
                    url,
                    code: error.code,
                    message,
                });

                return Promise.reject(
                    new ApiError(error.code ?? "ERR_NETWORK", message, error.status ?? 0)
                );
            }

            // 원본 에러
            const requestApiError = normalizeApiError(
                error,
                error.response.status === 401
                    ? "로그인이 필요합니다."
                    : "요청 처리 중 오류가 발생했습니다."
            );

            // 401 에러 처리 - 토큰 갱신 시도
            if (requestApiError.status === 401 && !isPublicAuthPath && reqConfig) {
                if (reqConfig._retry) {
                    logger.warn("401 after retry", {
                        url,
                        code: requestApiError.code,
                        message: requestApiError.message,
                        fieldErrors: requestApiError.fieldErrors,
                    });

                    return Promise.reject(requestApiError);
                }

                // 재인증 요청
                reqConfig._retry = true;
                try {
                    await refreshAccessToken();
                    const newToken = useAuthStore.getState().accessToken;

                    reqConfig.headers = reqConfig.headers ?? {};
                    reqConfig.headers.Authorization = `Bearer ${newToken}`;

                    return client(reqConfig);
                } catch (refreshError) {
                    const refreshApiError = normalizeApiError(
                        refreshError,
                        "세션이 만료되었습니다. 다시 로그인해주세요."
                    );

                    logger.warn("Refresh failed while retrying request", {
                        url,
                        originalStatus: requestApiError.status,
                        refreshStatus: refreshApiError.status,
                        refreshCode: refreshApiError.code,
                        refreshMessage: refreshApiError.message,
                        refreshFieldErrors: refreshApiError.fieldErrors,
                    });

                    return Promise.reject(refreshApiError);
                }
            }

            // 401이면서 로그인 요청인 경우
            // , 또는 401이지만 이미 재시도한 경우에는 토큰 갱신 시도를 하지 않고 바로 에러를 반환합니다.
            // 또한, 401이 아닌 다른 에러에 대해서는 토큰 갱신 시도를 하지 않습니다.
            let logSubject = "";
            if (requestApiError.status >= 500) {
                logSubject = "Server error response";
            } else if (requestApiError.status >= 400) {
                logSubject = "Client error response";
            } else {
                logSubject = "Unexpected HTTP error response";
            }

            logger.warn(logSubject, {
                url,
                status: requestApiError.status,
                code: requestApiError.code,
                message: requestApiError.message,
                fieldErrors: requestApiError.fieldErrors,
            })

            // 에러는 기존과 동일하게 ApiError로 변환하여 반환합니다.
            return Promise.reject(
                new ApiError(
                    requestApiError.code,
                    requestApiError.message,
                    requestApiError.status,
                    requestApiError.fieldErrors,
                )
            );
        }
    );

    return client;
};

export const createApiMethods = (config?: ApiConfig) => {
    const client = createApiClient(config);
    const retry = createRetryLogic(
        config?.maxRetries ?? DEFAULT_CONFIG.maxRetries,
        config?.retryDelayMs ?? DEFAULT_CONFIG.retryDelayMs
    );

    return {
        get: async <T>(
            endpoint: string,
            params?: Record<string, unknown>,
            options?: AxiosRequestConfig
        ) => {
            return retry(async () => {
                const res: AxiosResponse<ApiResponse<T>> = await client.get(endpoint, {
                    params,
                    ...options,
                });
                return res.data;
            });
        },

        post: async <T>(
            endpoint: string,
            body?: unknown,
            options?: AxiosRequestConfig
        ) => {
            const res: AxiosResponse<ApiResponse<T>> = await client.post(
                endpoint,
                body,
                options
            );
            return res.data;
        },

        put: async <T>(
            endpoint: string,
            body?: unknown,
            options?: AxiosRequestConfig
        ) => {
            return retry(async () => {
                const res: AxiosResponse<ApiResponse<T>> = await client.put(
                    endpoint,
                    body,
                    options
                );
                return res.data;
            });
        },

        patch: async <T>(
            endpoint: string,
            body?: unknown,
            options?: AxiosRequestConfig
        ) => {
            return retry(async () => {
                const res: AxiosResponse<ApiResponse<T>> = await client.patch(
                    endpoint,
                    body,
                    options
                );
                return res.data;
            });
        },

        delete: async <T>(
            endpoint: string,
            params?: Record<string, unknown>,
            options?: AxiosRequestConfig
        ) => {
            return retry(async () => {
                const res: AxiosResponse<ApiResponse<T>> = await client.delete(endpoint, {
                    //현재 순서 주의 -> params 와 options.params 둘 다 존재 시 parmas가 우선이 되도록 의도했음.
                    ...options,
                    params,
                });
                return res.data;
            });
        },
    };
};