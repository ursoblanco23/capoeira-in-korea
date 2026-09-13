import type {Dojang} from "@/types/dojang.ts";
import {useState} from "react";
import {Link} from "react-router-dom";
import {PAGE} from "@/constants/routes.ts";
import dojangService from "@/services/api/services/dojangService.ts";
import {ApiError} from "@/utils/apiError.ts";
import {toast} from "react-toastify";
import defaultThumbnail from '@/assets/images/default-dojang-thumbnail.png';
import {resolveMediaUrl} from "@/utils/media.ts";

import {useMutation, useQueryClient} from "@tanstack/react-query";
import {dojangQueryKeys} from "@/hooks/queries/useDojangsQuery.ts";
interface Props {
    dojangList: Dojang[];
    isAdmin?: boolean;
}

const DOJANG_CARD_PAGE_SIZE = 3;

const DojangCardSection = ({dojangList, isAdmin=false}: Props) => {
    const [visibleCount, setVisibleCount] = useState(DOJANG_CARD_PAGE_SIZE);
    const queryClient = useQueryClient();
    const visibleDojangs = isAdmin
        ? dojangList
        : dojangList.slice(0, visibleCount);
    const hasMoreDojangs = !isAdmin && visibleCount < dojangList.length;
    const deleteMutation = useMutation({
        mutationFn: ({dojangId}: {dojangId: number; dojangName: string}) =>
            dojangService.deleteDojnag(dojangId),
        onSuccess: async (_, {dojangName}) => {
            await queryClient.invalidateQueries({
                queryKey: dojangQueryKeys.lists(),
            });
            toast.success(`${dojangName}이(가) 삭제되었습니다.`);
        },
        onError: (error: unknown) => {
            if (error instanceof ApiError) {
                console.error('apiError:', error.code, error.status, error.message);
            } else {
                console.error('error:', error);
            }

            toast.error('도장 삭제에 실패했습니다. 관리자에게 문의해주세요.');
        },
    });

    const handleLoadMoreClick = () => {
        setVisibleCount((currentCount) =>
            Math.min(currentCount + DOJANG_CARD_PAGE_SIZE, dojangList.length)
        );
    };

    const handleDeleteClick = (dojangId: number, dojangName: string) => {
        deleteMutation.mutate({dojangId, dojangName});
    };

    return (
        <>
            <div id='card-wrapper' className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {visibleDojangs.map((dojang) => (
                            <div
                                key={dojang.id}
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
                                        onError={(event) => {
                                            const image = event.currentTarget;

                                            if (image.dataset.fallbackApplied) {
                                                return;
                                            }

                                            image.dataset.fallbackApplied = 'true';
                                            image.src = defaultThumbnail;
                                        }}
                                    />
                                    {/*TODO: 인기 뱃지 향후 구현 필요*/}
                                    {/*<div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">*/}
                                    {/*    인기*/}
                                    {/*</div>*/}
                                </div>

                                <div className="p-6">
                                    <h4 className="text-xl font-bold mb-2">{dojang.name}</h4>
                                    <p className="text-gray-600 mb-4">
                                        {dojang.address.roadAddress}<br />
                                        {dojang.address.detailAddress}
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
                ))}
            </div>
            {hasMoreDojangs && (
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors !rounded-button whitespace-nowrap"
                        onClick={handleLoadMoreClick}
                    >
                        더보기...
                    </button>
                </div>
            )}
        </>
    );
}

export default DojangCardSection;

