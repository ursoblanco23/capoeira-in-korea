
const Events = () => {

    return (
        <section id="events" className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">다가오는 이벤트</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">워크샵, 로다, 공연 등 다양한 카포에라 이벤트에 참여하고 커뮤니티와 함께하세요.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        className="card-hover-effect bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
                        <div className="h-48 bg-gray-200 relative">
                            <img
                                src="https://readdy.ai/api/search-image?query=A%20vibrant%20capoeira%20roda%20%28circle%29%20event%20in%20Seoul%20with%20Korean%20and%20international%20practitioners%20performing.%20The%20scene%20shows%20musicians%20playing%20berimbau%20and%20pandeiro%2C%20with%20two%20capoeira%20players%20in%20the%20center%20demonstrating%20acrobatic%20moves.%20The%20atmosphere%20is%20festive%20with%20colorful%20lighting%20and%20an%20engaged%20audience.&width=600&height=400&seq=5&orientation=landscape"
                                alt="서울 카포에라 로다" className="w-full h-full object-cover object-top"/>
                            <div className="absolute top-0 left-0 bg-primary text-white px-4 py-2 rounded-br-lg">
                                <div className="text-xs">2025년 6월</div>
                                <div className="text-xl font-bold">15</div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xl font-bold mb-2">서울 카포에라 로다</h4>
                            <p className="text-gray-600 mb-4">서울시 마포구 홍대 앞 놀이터</p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <div className="flex items-center mr-4">
                                    <i className="ri-time-line mr-1"></i>
                                    <span>오후 2:00 - 5:00</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-user-line mr-1"></i>
                                    <span>참가자 35명</span>
                                </div>
                            </div>
                            <button
                                className="w-full py-2 bg-primary text-white !rounded-button hover:bg-primary/90 transition-colors whitespace-nowrap">참가
                                신청
                            </button>
                        </div>
                    </div>
                    <div
                        className="card-hover-effect bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
                        <div className="h-48 bg-gray-200 relative">
                            <img
                                src="https://readdy.ai/api/search-image?query=A%20capoeira%20workshop%20in%20Busan%20with%20a%20famous%20Brazilian%20master%20teaching%20a%20group%20of%20Korean%20students.%20The%20workshop%20is%20taking%20place%20in%20a%20large%20studio%20with%20bamboo%20floors%20and%20ocean%20views.%20Students%20are%20arranged%20in%20rows%20practicing%20specific%20techniques%20while%20the%20master%20demonstrates%20on%20a%20small%20stage.&width=600&height=400&seq=6&orientation=landscape"
                                alt="부산 카포에라 워크샵" className="w-full h-full object-cover object-top"/>
                            <div className="absolute top-0 left-0 bg-secondary text-white px-4 py-2 rounded-br-lg">
                                <div className="text-xs">2025년 6월</div>
                                <div className="text-xl font-bold">22</div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xl font-bold mb-2">부산 카포에라 워크샵</h4>
                            <p className="text-gray-600 mb-4">부산시 해운대구 센텀시티</p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <div className="flex items-center mr-4">
                                    <i className="ri-time-line mr-1"></i>
                                    <span>오전 10:00 - 오후 4:00</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-user-line mr-1"></i>
                                    <span>참가자 28명</span>
                                </div>
                            </div>
                            <button
                                className="w-full py-2 bg-secondary text-white !rounded-button hover:bg-secondary/90 transition-colors whitespace-nowrap">참가
                                신청
                            </button>
                        </div>
                    </div>
                    <div
                        className="card-hover-effect bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
                        <div className="h-48 bg-gray-200 relative">
                            <img
                                src="https://readdy.ai/api/search-image?query=A%20capoeira%20performance%20at%20a%20cultural%20festival%20in%20Incheon%20with%20Korean%20capoeiristas%20performing%20for%20a%20large%20audience.%20The%20stage%20is%20decorated%20with%20both%20Korean%20and%20Brazilian%20flags%20and%20cultural%20symbols.%20The%20performers%20are%20wearing%20traditional%20capoeira%20whites%20and%20demonstrating%20spectacular%20acrobatic%20movements%20with%20live%20music.&width=600&height=400&seq=7&orientation=landscape"
                                alt="인천 문화축제 카포에라 공연" className="w-full h-full object-cover object-top"/>
                            <div className="absolute top-0 left-0 bg-purple-600 text-white px-4 py-2 rounded-br-lg">
                                <div className="text-xs">2025년 7월</div>
                                <div className="text-xl font-bold">5</div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xl font-bold mb-2">인천 문화축제 카포에라 공연</h4>
                            <p className="text-gray-600 mb-4">인천시 연수구 송도 센트럴파크</p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                <div className="flex items-center mr-4">
                                    <i className="ri-time-line mr-1"></i>
                                    <span>오후 6:00 - 7:30</span>
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-user-line mr-1"></i>
                                    <span>관람 무료</span>
                                </div>
                            </div>
                            <button
                                className="w-full py-2 bg-purple-600 text-white !rounded-button hover:bg-purple-700 transition-colors whitespace-nowrap">자세히
                                보기
                            </button>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <a href="#"
                       className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors !rounded-button whitespace-nowrap inline-block">모든
                        이벤트 보기</a>
                </div>
            </div>
        </section>
    )
}

export default Events;