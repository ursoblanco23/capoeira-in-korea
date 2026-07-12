import { authApi} from './auth';
import { dojangApi } from './dojang';
import { uploadApi } from './upload';

export const apiEndpoints = {
    dojang: dojangApi,
    auth: authApi,
    upload: uploadApi,
} as const;

// 개별 API들도 export (하위 호환성)
export { dojangApi, authApi, uploadApi };
export { ENDPOINTS } from './base';

// 타입들도 re-export
export type {
    Dojang,
    DojangSearchParams,
    DojangListResponse,
    DojangFormRequest,
    // UpdateDojangRequest,
    ClassSchedule,
} from '@/types/dojang.ts';