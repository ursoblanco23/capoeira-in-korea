/* 도장 페이지 */
import {Link, useNavigate, useParams} from "react-router-dom";
import {useFindDojangById} from "@/stores/dojangStore.ts";
import {useEffect, useRef, useState} from "react";
import {type Dojang} from '@/types/dojang';
import DojangMediaGallery from "@/components/features/Dojang/DojangMediaGallery/DojangMediaGallery.tsx";
import {PAGE} from "@/constants/routes.ts";

const DojangDetail = () => {
    const {dojangId} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const findDojangById = useFindDojangById();
    const [dojang, setDojang] = useState<Dojang | null>(null);
    const likeBtnRef = useRef<HTMLElement | null>(null);


    useEffect(() => {
        if (!dojangId) {
            navigate('/not-found');
        } else {
            const res = findDojangById(parseInt(dojangId));
            if (res) {
                console.log('도장 정보:', res);
                setDojang((res));
            } else {
                alert('해당 도장 정보가 없습니다. 홈 화면으로 이동됩니다.');
                navigate('/');
            }
        }
    }, [])

    const handleLikeBtnClick = () => {
        const likeBtn = likeBtnRef.current;
        if (likeBtn) {
            if (likeBtn.classList.contains('ri-heart-line')) {
                likeBtn.classList.remove('ri-heart-line');
                likeBtn.classList.add('ri-heart-fill');
                likeBtn.classList.add('text-red-500');
            } else {
                likeBtn.classList.remove('ri-heart-fill');
                likeBtn.classList.remove('text-red-500');
                likeBtn.classList.add('ri-heart-line');
            }
        }

    };

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
                {/* TODO: 도장 목록 페이지 url 생기면 바꿔서 적어놓기 */}
                <Link to={PAGE.ADMIN_DOJANG} className="text-primary hover:underline flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center mr-1">
                        <i className="ri-arrow-left-line"></i>
                    </div>
                    도장 목록으로 돌아가기
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="lg:col-span-2 space-y-8">

                    {/*도장 기본 정보*/}
                    <section className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{dojang?.name}</h1>
                            <button
                                onClick={handleLikeBtnClick}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                <div className="w-6 h-6 flex items-center justify-center text-gray-500">
                                    <i ref={likeBtnRef} className="ri-heart-line"></i>
                                </div>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="w-6 h-6 flex items-center justify-center text-primary mr-3">
                                        <i className="ri-user-star-line"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">관장/사범</p>
                                        <p className="text-gray-900 font-medium">{dojang?.instructorName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 flex items-center justify-center text-primary mr-3">
                                        <i className="ri-phone-line"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">연락처</p>
                                        <p className="text-gray-900 font-medium">{dojang?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 flex items-center justify-center text-primary mr-3">
                                        <i className="ri-map-pin-line"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">주소</p>
                                        <p className="text-gray-900 font-medium">{dojang?.roadAddress}</p>
                                        <p className="text-gray-900 font-medium">{dojang?.detailAddress}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="w-6 h-6 flex items-center justify-center text-primary mr-3">
                                        <i className="ri-money-dollar-circle-line"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">수강료 범위</p>
                                        <p className="text-gray-900 font-medium">{dojang?.priceRange}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-6 h-6 flex items-center justify-center text-primary mr-3">
                                        <i className="ri-calendar-line"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">등록일</p>
                                        <p className="text-gray-900 font-medium">{dojang?.createdAt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*상세 설명*/}
                    <section className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">도장 소개</h2>
                        <div className="prose max-w-none text-gray-700">
                            {dojang?.description}
                        </div>
                    </section>

                    {/*사진 및 영상 갤러리*/}
                    <DojangMediaGallery />

                    {/*댓글 섹션*/}
                    <section className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">리뷰 및 댓글</h2>
                        {/*댓글 작성 폼*/}
                        <div className="mb-8">
                            <form className="space-y-4">
                                <div>
                    <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                        rows={3}
                        placeholder="도장에 대한 리뷰나 질문을 남겨주세요."
                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit"
                                            className="bg-primary text-white px-5 py-2 !rounded-button whitespace-nowrap">댓글
                                        등록
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/*댓글 목록*/}
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                            <div className="w-6 h-6 flex items-center justify-center text-gray-500">
                                                <i className="ri-user-line"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">김지훈</p>
                                            <p className="text-sm text-gray-500">2025년 6월 25일</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-sm text-gray-500 hover:text-primary">수정</button>
                                        <button className="text-sm text-gray-500 hover:text-red-500">삭제</button>
                                    </div>
                                </div>
                                <p className="text-gray-700">처음 카포에라를 접했는데, 선생님이 매우 친절하게 기초부터 가르쳐주셔서 즐겁게 배우고 있습니다. 음악과
                                    함께하는 수업이 특히
                                    좋아요. 다른 무술과는 다른 매력이 있어요!</p>
                            </div>
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                            <div className="w-6 h-6 flex items-center justify-center text-gray-500">
                                                <i className="ri-user-line"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">박서연</p>
                                            <p className="text-sm text-gray-500">2025년 6월 20일</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-sm text-gray-500 hover:text-primary">수정</button>
                                        <button className="text-sm text-gray-500 hover:text-red-500">삭제</button>
                                    </div>
                                </div>
                                <p className="text-gray-700">6개월 정도 다니고 있는데 체력도 많이 좋아지고 유연성도 늘었어요. 무엇보다 카포에라의 역사와 문화를 함께
                                    배울 수 있어서 더욱
                                    의미 있는 시간이 되고 있습니다. 주변 친구들에게도 많이 추천하고 있어요!</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                            <div className="w-6 h-6 flex items-center justify-center text-gray-500">
                                                <i className="ri-user-line"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">이민준</p>
                                            <p className="text-sm text-gray-500">2025년 6월 15일</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-sm text-gray-500 hover:text-primary">수정</button>
                                        <button className="text-sm text-gray-500 hover:text-red-500">삭제</button>
                                    </div>
                                </div>
                                <p className="text-gray-700">아이와 함께 다니고 있는데, 아이의 집중력과 신체 발달에 정말 도움이 많이 됩니다. 선생님들이 아이들을
                                    대하는 방식이 매우
                                    인상적이에요. 수업 시간도 적절하고 시설도 깨끗해서 만족하고 있습니다.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default DojangDetail;