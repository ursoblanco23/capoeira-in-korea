
const MainContents = () => {

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">카포에라 커뮤니티의 중심</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div
                        className="card-hover-effect bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-map-pin-line text-primary ri-xl"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-4">도장 찾기</h3>
                        <p className="text-gray-600 mb-6">전국의 카포에라 도장을 한눈에 확인하고 위치, 수업 일정, 가격 정보를 쉽게 찾아보세요.</p>
                        <a href="#find-dojang" className="text-primary font-medium hover:underline flex items-center">
                            자세히 보기
                            <i className="ri-arrow-right-line ml-1"></i>
                        </a>
                    </div>
                    <div
                        className="card-hover-effect bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-calendar-event-line text-secondary ri-xl"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-4">이벤트/모임</h3>
                        <p className="text-gray-600 mb-6">워크샵, 로다, 공연 등 다양한 카포에라 이벤트 정보를 확인하고 참여해보세요.</p>
                        <a href="#events" className="text-secondary font-medium hover:underline flex items-center">
                            자세히 보기
                            <i className="ri-arrow-right-line ml-1"></i>
                        </a>
                    </div>
                    <div
                        className="card-hover-effect bg-white p-8 rounded-lg shadow-md border border-gray-100 transition-all duration-300">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-team-line text-purple-600 ri-xl"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-4">커뮤니티</h3>
                        <p className="text-gray-600 mb-6">카포에라 수련자들과 경험을 공유하고 질문하며 함께 성장하는 커뮤니티에 참여하세요.</p>
                        <a href="#community" className="text-purple-600 font-medium hover:underline flex items-center">
                            자세히 보기
                            <i className="ri-arrow-right-line ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default MainContents;



