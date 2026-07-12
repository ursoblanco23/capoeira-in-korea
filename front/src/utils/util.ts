import {THUMBNAIL_IMG_UPLOAD_CONFIG} from "@/constants/fileConstants.ts";

export type ValidationResult = {
    isPass: boolean;
    alertMsg?: string;
};

export function createFormDataFromRequest<T extends Record<string, any>>(requestData: T): FormData {
    const formData = new FormData();

    const { data, file } = requestData;

    const dataBlob = new Blob([JSON.stringify(data)], {
        type: 'application/json'
    });
    formData.append('data', dataBlob);

    if (file) {
        for (const[key, value] of Object.entries(file)) {
            if (value instanceof File) {
                formData.append(key, value);
            } else if (Array.isArray(value)) {
                value.forEach((fileItem: File) => {
                    if (fileItem instanceof File) {
                        formData.append(key, fileItem);
                    }
                });
            }
        }
    }

    return formData;
}

export const validateThumbnailImage = (
    file: File
): Promise<ValidationResult> => {
    return new Promise((resolve) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        const isValidExtension = extension && THUMBNAIL_IMG_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(extension);
        const isValidMimeType = THUMBNAIL_IMG_UPLOAD_CONFIG.ACCEPT_MIME_TYPES.includes(file.type);
        const isValidSize = file.size <= THUMBNAIL_IMG_UPLOAD_CONFIG.MAX_SIZE;

        if (!isValidExtension || !isValidMimeType) {
            return resolve({
                isPass: false,
                alertMsg: `지원되지 않는 이미지 형식입니다. (${THUMBNAIL_IMG_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(', ').toUpperCase()}만 가능)`,
            });
        }

        if (!isValidSize) {
            return resolve({
                isPass: false,
                alertMsg: `이미지 크기는 최대 ${(THUMBNAIL_IMG_UPLOAD_CONFIG.MAX_SIZE / 1024 / 1024).toFixed(0)}MB를 초과할 수 없습니다.`,
            });
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const { width, height } = img;
            const ratio = width / height;
            const recommendedRatio = THUMBNAIL_IMG_UPLOAD_CONFIG.RECOMMENDED_RATIO;
            const ratioDiff = Math.abs(ratio - recommendedRatio);

            if (ratioDiff > 0.1) {
                // 비율은 권장이므로 alert만 띄우고 통과시킴
                alert(`권장 비율은 ${THUMBNAIL_IMG_UPLOAD_CONFIG.RECOMMENDED_RATIO_TEXT} (예: ${THUMBNAIL_IMG_UPLOAD_CONFIG.RECOMMENDED_WIDTH}x${THUMBNAIL_IMG_UPLOAD_CONFIG.RECOMMENDED_HEIGHT})입니다.\n비율이 맞지 않을 경우 이미지가 잘려서 보일 수 있습니다.`);
            }

            resolve({ isPass: true });
        };

        img.onerror = () =>
            resolve({
                isPass: false,
                alertMsg: '이미지를 불러오는데 실패했습니다.',
            });
    });
};