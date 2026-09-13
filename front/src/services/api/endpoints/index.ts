import { authApi} from '../auth/api/authApi';
import { dojangApi } from './dojang';
import { uploadApi } from './upload';

// 개별 API들도 export (하위 호환성)
export { dojangApi, authApi, uploadApi };
export { ENDPOINTS } from './base';

// 타입들도 re-export
export type {
    Dojang,
    DojangSearchParams,
    DojangListResponse,
    DojangFormRequest,
} from '@/types/dojang.ts';