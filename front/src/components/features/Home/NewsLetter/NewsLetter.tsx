const Newsletter = () => {

    return (
        <section className="py-16 bg-primary">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">카포에라 소식 받아보기</h2>
                    <p className="text-white/80 mb-8">최신 이벤트, 워크샵, 트레이닝 팁을 이메일로 받아보세요.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input type="email" placeholder="이메일 주소"
                               className="flex-1 px-4 py-3 rounded-lg border-none text-gray-700"/>
                        <button
                            className="px-6 py-3 bg-white text-primary font-medium !rounded-button hover:bg-gray-100 transition-colors whitespace-nowrap">구독하기
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Newsletter