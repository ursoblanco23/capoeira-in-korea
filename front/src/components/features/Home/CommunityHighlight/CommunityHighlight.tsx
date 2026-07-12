
const CommunityHighlight = () => {

    return (
        <section id="community" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">커뮤니티 하이라이트</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">카포에라 수련자들의 경험과 지식을 공유하는 활발한 커뮤니티에 참여하세요.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-6">최신 게시글</h3>
                        <div className="space-y-6">
                            <div
                                className="card-hover-effect bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                                        <img
                                            src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20capoeira%20instructor%20in%20his%2030s%20with%20short%20black%20hair%20and%20a%20friendly%20smile%2C%20wearing%20a%20white%20capoeira%20t-shirt%20against%20a%20neutral%20background&width=100&height=100&seq=8&orientation=squarish"
                                            alt="김태우" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold">김태우</h4>
                                                <p className="text-gray-500 text-sm">2025년 6월 10일</p>
                                            </div>
                                            <div
                                                className="px-2 py-1 bg-blue-100 text-primary text-xs rounded-full">질문
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">카포에라 초보자를 위한 기본 동작 연습 방법</h3>
                                        <p className="text-gray-600 mb-4">안녕하세요, 카포에라를 시작한 지 한 달 된 초보자입니다. 집에서 기본 동작인
                                            징가(Ginga)를 연습하고 있는데, 균형을 잡는 것이 어렵네요. 혹시 집에서 효과적으로 연습할 수 있는 방법이나 팁이 있을까요?</p>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <div className="flex items-center mr-4">
                                                <i className="ri-chat-1-line mr-1"></i>
                                                <span>댓글 8개</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="ri-heart-line mr-1"></i>
                                                <span>좋아요 12개</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="card-hover-effect bg-white rounded-lg shadow-md p-6 transition-all duration-300">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                                        <img
                                            src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20female%20capoeira%20practitioner%20in%20her%2020s%20with%20long%20black%20hair%20tied%20back%2C%20wearing%20a%20white%20capoeira%20uniform%20against%20a%20neutral%20background%2C%20confident%20expression&width=100&height=100&seq=9&orientation=squarish"
                                            alt="이지은" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold">이지은</h4>
                                                <p className="text-gray-500 text-sm">2025년 6월 9일</p>
                                            </div>
                                            <div
                                                className="px-2 py-1 bg-green-100 text-secondary text-xs rounded-full">정보
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">브라질 카포에라 역사와 한국에서의 발전</h3>
                                        <p className="text-gray-600 mb-4">카포에라의 역사적 배경과 한국에 어떻게 전파되었는지에 대한 자료를 정리해봤습니다.
                                            브라질 노예 시대부터 시작된 카포에라가 어떻게 한국에서 20년 동안 발전해왔는지 알아보세요. 관심 있으신 분들께 도움이 되길
                                            바랍니다.</p>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <div className="flex items-center mr-4">
                                                <i className="ri-chat-1-line mr-1"></i>
                                                <span>댓글 15개</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="ri-heart-line mr-1"></i>
                                                <span>좋아요 34개</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-8">
                            <a href="#"
                               className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors !rounded-button whitespace-nowrap inline-block">더
                                많은 게시글 보기</a>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-xl font-bold mb-4">인기 토픽</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="flex items-center text-gray-700 hover:text-primary">
                                        <span
                                            className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center mr-3 font-bold">1</span>
                                        <span>카포에라 기본 동작</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center text-gray-700 hover:text-primary">
                                        <span
                                            className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center mr-3 font-bold">2</span>
                                        <span>카포에라 음악과 악기</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center text-gray-700 hover:text-primary">
                                        <span
                                            className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center mr-3 font-bold">3</span>
                                        <span>카포에라 벨트 시스템</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center text-gray-700 hover:text-primary">
                                        <span
                                            className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center mr-3 font-bold">4</span>
                                        <span>카포에라 트레이닝 팁</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center text-gray-700 hover:text-primary">
                                        <span
                                            className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center mr-3 font-bold">5</span>
                                        <span>브라질 카포에라 여행</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold mb-4">활발한 사용자</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                            <img
                                                src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20male%20capoeira%20master%20in%20his%2040s%20with%20athletic%20build%2C%20wearing%20a%20white%20capoeira%20uniform%20with%20a%20colored%20belt%2C%20confident%20pose%20against%20a%20neutral%20background&width=100&height=100&seq=10&orientation=squarish"
                                                alt="박준호" className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">박준호</h4>
                                            <p className="text-gray-500 text-sm">게시글 42개</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                            <img
                                                src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Korean%20female%20capoeira%20instructor%20in%20her%2030s%20with%20athletic%20build%20and%20short%20hair%2C%20wearing%20a%20white%20capoeira%20uniform%20with%20a%20colored%20belt%20against%20a%20neutral%20background&width=100&height=100&seq=11&orientation=squarish"
                                                alt="김민지" className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">김민지</h4>
                                            <p className="text-gray-500 text-sm">게시글 36개</p>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                            <img
                                                src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20Brazilian-Korean%20male%20capoeira%20instructor%20in%20his%2030s%20with%20mixed%20features%2C%20wearing%20a%20white%20capoeira%20uniform%20against%20a%20neutral%20background%2C%20friendly%20expression&width=100&height=100&seq=12&orientation=squarish"
                                                alt="호베르투 김" className="w-full h-full object-cover"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">호베르투 김</h4>
                                            <p className="text-gray-500 text-sm">게시글 29개</p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CommunityHighlight;