import type {Dojang} from "@/types/dojang.ts";
import {Link} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import dojangService from "@/services/api/services/dojangService.ts";
import {useRemoveDojang} from "@/stores/dojangStore.ts";
import {ApiError} from "@/utils/apiError.ts";
import {toast} from "react-toastify";
import defaultThumbnail from '@/assets/images/default-dojang-thumbnail.png';
import {resolveMediaUrl} from "@/utils/media.ts";

interface Props {
    dojangList: Dojang[];
    isAdmin?: boolean;
}

const DojangCardSection = ({dojangList, isAdmin=false}: Props) => {
    const viewLimit = isAdmin ? dojangList.length : 3; // 보여줄 도장 카드의 개수
    const removeDojang = useRemoveDojang();

    const handleDeleteClick = async (dojangId: number, dojangName: string) => {
        try {
            await dojangService.deleteDojnag(dojangId);
            removeDojang(dojangId);
            toast.success(`${dojangName}이(가) 삭제되었습니다.`);
        } catch (error: ApiError | any) {
            if (error instanceof ApiError) {
                console.error('apiError:', error.code, error.message, error.apiResponse);
            } else {
                console.error('error:', error);
            }

            toast.error('도장 삭제에 실패했습니다. 관리자에게 문의해주세요.');
        }
    }

    return (
        <>
            <div id='card-wrapper' className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {dojangList.map((dojang, idx) => {
                    if (idx < viewLimit) {
                        return (
                            <div
                                key={`${dojang.name}-${idx}`}
                                className="card-hover-effect bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
                            >
                                {/*<div className="h-48 bg-gray-200 relative">*/}
                                {/*    <img*/}
                                {/*        src={dojang.thumbnailUrl || defaultThumbnail}*/}
                                {/*        alt={dojang.name}*/}
                                {/*        className="w-full h-full object-cover object-top"*/}
                                {/*    />*/}
                                {/*    <div*/}
                                {/*        className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">*/}
                                {/*        인기*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="w-full aspect-[3/2] bg-gray-200 relative overflow-hidden rounded-lg">
                                    <img
                                        src={resolveMediaUrl(dojang.thumbnailUrl) || defaultThumbnail}
                                        alt={dojang.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
                                    />
                                    {/*TODO: 인기 뱃지 향후 구현 필요*/}
                                    {/*<div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">*/}
                                    {/*    인기*/}
                                    {/*</div>*/}
                                </div>

                                <div className="p-6">
                                    <h4 className="text-xl font-bold mb-2">{dojang.name}</h4>
                                    <p className="text-gray-600 mb-4">
                                        {dojang.roadAddress}<br />
                                        {dojang.detailAddress}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <div className="flex items-center mr-4">
                                            <i className="ri-user-line mr-1"></i>
                                            <span>{dojang.instructorName}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <i className="ri-star-fill text-yellow-400 mr-1"></i>
                                            <span>4.9 (42)</span> {/* 실제 데이터가 있다면 dojang.rating 등을 사용 */}
                                        </div>
                                    </div>
                                    <div className={`flex`}>
                                        <Link to={PAGE.DOJANG(dojang.id)} className="dojang-detail-link text-primary font-medium hover:underline flex items-center">
                                            자세히 보기
                                            {/*<i className="ri-arrow-right-line ml-1"></i>*/}
                                        </Link>
                                        {isAdmin && (
                                            <>
                                                <Link to={PAGE.ADMIN_DOJANG_EDIT(dojang.id)} className="dojang-detail-link text-primary font-medium hover:underline flex items-center ml-3.5">
                                                    수정
                                                </Link>
                                                <button className="dojang-detail-link text-primary font-medium hover:underline flex items-center ml-3.5" onClick={() => {handleDeleteClick(dojang.id, dojang.name)}}>
                                                    삭제
                                                </button>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </>
    );
}

export default DojangCardSection;

