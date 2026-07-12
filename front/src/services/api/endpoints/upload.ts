import {api} from "../client/index.ts";
import {ENDPOINTS} from "@/services/api/endpoints/base.ts";

export const uploadApi = {
    uploadDojangImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        return api.post(ENDPOINTS.UPLOAD.IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
} as const;