import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultThumbnail from '@/assets/images/default-dojang-thumbnail.png';
import { THUMBNAIL_IMG_UPLOAD_CONFIG as IMG_CONFIG } from '@/constants/fileConstants.ts';
import {createFormDataFromRequest, validateThumbnailImage} from '@/utils/util.ts';
import type {DojangFormRequest} from "@/types/dojang.ts";
import {useAuthStore} from "@/stores/authStore.ts";
import type {DojangFormData} from "@/components/features/Dojang/types/DojangFormData.ts";
import {openPostcodeSearch} from "@/utils/postcode.ts";
import {formatKoreanPhoneInput, formatPhoneForDisplay} from "@/utils";

const initialDojangFormData: DojangFormData = {
    id: 0,
    name: '',
    zipCode: '',
    roadAddress: '',
    detailAddress: '',
    sidoName: '',
    sigunguName: '',
    eupmyeondongName: '',
    phone: '',
    priceInfo: '',
    instructorName: '',
    description: '',
    thumbnailImage: null,
    latitude: 0,
    longitude: 0,
}

interface DojangFormProps {
    initialData?: Partial<DojangFormData>;
    mode: 'create' | 'update';
    onSubmit: (submitData: FormData) => Promise<void>;
}

const DojangForm: React.FC<DojangFormProps> = ({
    initialData = {},
    mode,
    onSubmit
}) => {
    const me = useAuthStore((state) => state.me);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<DojangFormData>(() => {
        const initializedFormData = {
            ...initialDojangFormData,
            ...initialData,
        };

        if (mode === 'update') {
            return {
                ...initializedFormData,
                phone: formatPhoneForDisplay(initialData.phone, 'national'),
            };
        }

        return initializedFormData;
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 초기 데이터가 있으면 previewImage 설정
    // useEffect(() => {
        // if (initialData.thumbnailImage) {
        //     // 기존 이미지가 있다면 미리보기 설정
        //     const url = URL.createObjectURL(initialData.thumbnailImage);
        //     setPreviewImage(url);
        //
        //     // 메모리 누수 방지: 컴포넌트 언마운트 시 URL 해제
        //     return () => URL.revokeObjectURL(url);
        // }
    // }, [initialData.thumbnailImage]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        //formatter
        const nextValue = name === 'phone'
            ? formatKoreanPhoneInput(value)
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: nextValue
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationResult = await validateThumbnailImage(file);

        if (!validationResult.isPass) {
            alert(validationResult.alertMsg);
            return;
        }

        // 이미지 미리보기 설정
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // 상태 저장

        setFormData(prev => ({
            ...prev,
            thumbnailImage: file
        }));
    };

    const handleZipCodeSearch = () => {
        openPostcodeSearch((address) => {
            setFormData((prev) => ({
                ...prev,
                ...address,
            }));
        });
    };

    const getCoordinate = (address: string): Promise<{
        latitude: number;
        longitude: number;
        error: string | null;
    }> => {
        return new Promise(resolve => {
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                    resolve({
                        latitude: coords.getLat(),
                        longitude: coords.getLng(),
                        error: null,
                    });
                } else {
                    resolve({
                        latitude: 0,
                        longitude: 0,
                        error: `getCoordinate 실패: ${status}`,
                    });
                }
            });
        });
    };

    const convertFormToRequest = async (formData: DojangFormData): Promise<DojangFormRequest> => {
        if (!me) {
            throw new Error("Authenticated user is unavailable.");
        }

        const roadAddress = formData.roadAddress.trim();
        const initialRoadAddress = initialData.roadAddress?.trim();
        const shouldRecalculateCoordinate =
            mode === 'create' || roadAddress !== initialRoadAddress;

        let latitude = formData.latitude;
        let longitude = formData.longitude;

        if (shouldRecalculateCoordinate) {
            const coordinate = await getCoordinate(roadAddress);

            if (coordinate.error) {
                throw new Error('위도, 경도 가져오기에 실패했습니다. 주소를 다시 확인해주세요.');
            }

            latitude = coordinate.latitude;
            longitude = coordinate.longitude;
        }

        let data: DojangFormRequest["data"] = {
            name: formData.name,
            address: {
                zipCode: formData.zipCode,
                roadAddress: formData.roadAddress,
                detailAddress: formData.detailAddress,
                sidoName: formData.sidoName,
                sigunguName: formData.sigunguName,
                eupmyeondongName: formData.eupmyeondongName,
            },
            phone: formData.phone || '',
            priceInfo: formData.priceInfo || '',
            instructorName: formData.instructorName || '',
            description: formData.description || '',
            latitude: latitude.toFixed(8),
            longitude: longitude.toFixed(8),
            altText: `도장 thumbnail image`
        }

        if (mode === 'update') {
            data = {
                ...data,
            }
        }

        return {
            data,
            file: {
                thumbnailImage: formData.thumbnailImage || null,
            }
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dojangFormRequestData = await convertFormToRequest(formData);

            // console.log('handleSubmit >>> dojangFormRequestData: ', dojangFormRequestData);

            const submitData = createFormDataFromRequest(dojangFormRequestData);

            // FormData 내용 확인 (디버깅용)
            for (const [key, value] of submitData.entries()) {
                console.log(key, value);
            }

            await onSubmit(submitData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitButtonText = mode === 'create' ? '도장 등록' : '도장 수정';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 썸네일 이미지 업로드 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    썸네일 이미지 <span className="text-gray-400">(선택사항)</span>
                </label>
                <div className="flex items-start space-x-4">
                    <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                        <img
                            src={previewImage || formData.thumbnailUrl || defaultThumbnail}
                            alt="썸네일 미리보기"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // 기본 이미지가 로드되지 않을 경우 placeholder 표시
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTI4IDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01NiAzNkg3MlY2MEg1NlYzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI1NiIgeT0iNDAiPgo8Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iMyIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4KPC9zdmc+';
                            }}
                        />
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="thumbnail-upload"
                        />
                        <label
                            htmlFor="thumbnail-upload"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-button text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <i className="ri-upload-2-line mr-2"></i>
                            이미지 선택
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                            권장 사이즈: {IMG_CONFIG.RECOMMENDED_WIDTH}x{IMG_CONFIG.RECOMMENDED_HEIGHT}px /
                            {IMG_CONFIG.ALLOWED_EXTENSIONS.map(ext => ext.toUpperCase()).join(', ')} 형식 /
                            최대 {(IMG_CONFIG.MAX_SIZE / (1024 * 1024)).toFixed(0)}MB<br /> 
                            권장 비율: {IMG_CONFIG.RECOMMENDED_RATIO_TEXT} (가로형 이미지)<br/>
                            이미지를 선택하지 않으면 기본 이미지를 사용합니다
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    도장명<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="예: 카포에라 브라질 강남점"
                />
            </div>

            <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    우편번호 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder=""
                    disabled={true}
                />
                <button
                    type="button"
                    className="ml-3 px-4 py-3 bg-primary text-white rounded-button hover:bg-blue-600 transition-colors"
                    onClick={handleZipCodeSearch}
                >
                    우편번호 찾기
                </button>
            </div>

            <div>
                <label htmlFor="roadAddr" className="block text-sm font-medium text-gray-700 mb-2">
                    도로명 주소 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="roadAddr"
                    name="roadAddr"
                    required
                    value={formData.roadAddress}
                    className="w-full px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="우편번호 찾기 시 자동으로 입력됩니다"
                    disabled={true}
                />
            </div>

            <div>
                <label htmlFor="detailAddr" className="block text-sm font-medium text-gray-700 mb-2">
                     상세주소 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="detailAddress"
                    name="detailAddress"
                    required
                    value={formData.detailAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="상세 주소를 입력해주세요"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    연락처
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="010-1234-5678"
                />
            </div>

            <div>
                <label htmlFor="priceInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    수강료
                </label>
                <input
                    type="text"
                    id="priceInfo"
                    name="priceInfo"
                    value={formData.priceInfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="예: 월 주1회 120,000원, 주 2회 150,000원, 주3회 200,000원 등"
                />
            </div>

            {/* 강사명 */}
            <div>
                <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-2">
                    강사명
                </label>
                <input
                    type="text"
                    id="instructorName"
                    name="instructorName"
                    value={formData.instructorName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="메스트레 이름"
                />
            </div>

            {/* 설명 */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    도장 설명
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-button focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="도장의 특징, 수업 시간, 특별한 프로그램 등을 소개해주세요."
                />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4 pt-6">
                <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-button text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-primary text-white rounded-button hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            {submitButtonText} 중...
                        </>
                    ) : (
                        <>
                            <i className="ri-save-line mr-2"></i>
                            {submitButtonText}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default DojangForm;