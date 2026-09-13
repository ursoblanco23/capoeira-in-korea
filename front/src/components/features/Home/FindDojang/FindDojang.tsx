import React, {type ChangeEvent, useState} from 'react';
import '@/components/features/Home/FindDojang/FindDojang.css';
import KakaoMap from "@/components/features/Home/FindDojang/components/KakaoMap/KakaoMap.tsx";
import {useDojangsQuery} from "@/hooks/queries/useDojangsQuery.ts";


const FindDojang = () => {
    const [searchParam, setSearchParam] = useState<string>('');
    const [submittedSearchParam, setSubmittedSearchParam] = useState('');
    const {data: searchedDojangs = [], isPending, isError} = useDojangsQuery(
        submittedSearchParam
            ? {searchParam: submittedSearchParam}
            : undefined,
    );

    const onChangeInput = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        setSearchParam(value);
    };

    const onClickSearchBtn = () => {
        setSubmittedSearchParam(searchParam.trim());
    };

    return (
        <section id="find-dojang" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">가까운 카포에라 도장 찾기</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">지역별로 카포에라 도장을 검색하고 수업 일정, 가격, 연락처 등 필요한 모든 정보를
                        확인하세요.</p>
                </div>

                <div
                    className="bg-white rounded-lg shadow-md p-4 mb-8 flex items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-75">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <i className="ri-search-line text-gray-400"></i>
                    </div>
                    <input type="text" placeholder="지역 또는 도장명으로 검색"
                           className="w-full px-2 py-2 border-none text-gray-700"
                           onChange={onChangeInput}
                           onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                               if (e.key === 'Enter') onClickSearchBtn();
                           }}
                           value={searchParam}/>
                    <button className="px-6 py-2 bg-primary text-white !rounded-button whitespace-nowrap"
                            onClick={onClickSearchBtn}>검색
                    </button>
                </div>

                <KakaoMap dojangs={searchedDojangs}/>

                {isPending && (
                    <div className="text-center text-gray-600">도장 정보를 불러오는 중입니다.</div>
                )}

                {isError && searchedDojangs.length === 0 && (
                    <div className="text-center text-red-600">도장 정보를 불러오지 못했습니다.</div>
                )}

            </div>
        </section>
    )
}


export default FindDojang;