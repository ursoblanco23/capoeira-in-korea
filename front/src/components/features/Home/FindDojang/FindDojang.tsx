import React, {type ChangeEvent, useState} from 'react';
import type {Dojang} from '@/types/dojang.ts';
import '@/components/features/Home/FindDojang/FindDojang.css';
import KakaoMap from "@/components/features/Home/FindDojang/components/KakaoMap/KakaoMap.tsx";
import DojangCardSection from "@/components/features/Home/FindDojang/components/DojangCardSection.tsx";
import {useDojangList} from "@/stores/dojangStore.ts";


const FindDojang = () => {
    const dojangList = useDojangList();
    const [searchParam, setSearchParam] = useState<string>('');
    const [dojangs, setDojangs] = useState<Dojang[]>([]);

    const onChangeInput = ({target: {value}}: ChangeEvent<HTMLInputElement>) => {
        setSearchParam(value);
    };

    const onClickSearchBtn = () => {
        const lowerSearch = searchParam.toLowerCase();

        const res = dojangList.filter(dojang =>
            dojang.name.toLowerCase().includes(lowerSearch) ||
            dojang.roadAddress.toLowerCase().includes(lowerSearch) ||
            dojang.detailAddress.toLowerCase().includes(lowerSearch)
        );

        // 검색 결과가 없을 경우 변동 x
        // 검색 키워드 없을 때 -> 전체 도장 조회
        setDojangs(res);

        /* back에 직접 api로 조회 */
        // dojangService.getDojangs({searchParam})
        //     .then(res => {
        //         setDojangs(res)
        //     })
        //     .catch(err => {
        //         console.log('getDojangs err :', err)
        //     });
    }

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

                <KakaoMap dojangs={dojangs}/>

                <h3 className="text-2xl font-bold mb-6">이런 도장은 어떠세요?</h3>
                <DojangCardSection dojangList={dojangList}/>

                <div className="text-center mt-8">
                    <a href="#"
                       className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors !rounded-button whitespace-nowrap inline-block">모든
                        도장 보기</a>
                </div>
            </div>
        </section>
    )
}


export default FindDojang;