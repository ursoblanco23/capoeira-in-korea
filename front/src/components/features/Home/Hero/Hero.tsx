import '@/assets/styles/hero-section.module.css';

// const Hero = () => {
//     return (
//         <section className="hero-section relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50"></div>
//             <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
//                 <div className="max-w-2xl">
//                     <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">한국 카포에라의 모든 것</h1>
//                     <p className="text-xl md:text-2xl text-gray-700 mb-8">가까운 도장찾기부터 이벤트 참여까지, 카포에라 커뮤니티의 중심에서 함께하세요</p>
//                     <div className="flex flex-wrap gap-4">
//                         <a href="#find-dojang" className="px-6 py-3 bg-primary text-white text-lg font-medium !rounded-button hover:bg-primary/90 transition-colors whitespace-nowrap">도장 찾아보기</a>
//                         <a href="#events" className="px-6 py-3 bg-white text-primary text-lg font-medium border border-primary !rounded-button hover:bg-gray-50 transition-colors whitespace-nowrap">이벤트 보기</a>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };
// export default Hero;

const Hero = () => {
    return (
        <section className="hero-section relative overflow-hidden">
            {/* ✅ 배경 이미지 (표준: picture + srcset + sizes) */}
            <picture className="absolute inset-0 -z-10">
                {/* AVIF (최우선) */}
                <source
                    type="image/avif"
                    srcSet={[
                        "/images/hero/hero-640.avif 640w",
                        "/images/hero/hero-960.avif 960w",
                        "/images/hero/hero-1280.avif 1280w",
                        "/images/hero/hero-1920.avif 1920w",
                        "/images/hero/hero-2560.avif 2560w",
                    ].join(", ")}
                    sizes="100vw"
                />

                {/* WebP (폴백) */}
                <source
                    type="image/webp"
                    srcSet={[
                        "/images/hero/hero-640.webp 640w",
                        "/images/hero/hero-960.webp 960w",
                        "/images/hero/hero-1280.webp 1280w",
                        "/images/hero/hero-1920.webp 1920w",
                        "/images/hero/hero-2560.webp 2560w",
                    ].join(", ")}
                    sizes="100vw"
                />

                {/* JPEG (최후 폴백) */}
                <img
                    className="h-full w-full object-cover object-center"
                    src="/images/hero/hero-1280.jpg"
                    srcSet={[
                        "/images/hero/hero-640.jpg 640w",
                        "/images/hero/hero-960.jpg 960w",
                        "/images/hero/hero-1280.jpg 1280w",
                        "/images/hero/hero-1920.jpg 1920w",
                        "/images/hero/hero-2560.jpg 2560w",
                    ].join(", ")}
                    sizes="100vw"
                    alt=""                // 배경이미지는 보통 장식용 → 빈 alt 권장
                    loading="eager"       // 히어로는 첫 화면(LCP) → eager
                    fetchPriority="high"  // 우선순위↑ (React에서 지원)
                    decoding="async"
                />
            </picture>

            {/* ✅ 오버레이(기존 그대로) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50"></div>

            {/* ✅ 콘텐츠(기존 그대로) */}
            <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        한국 카포에라의 모든 것
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-8">
                        가까운 도장찾기부터 이벤트 참여까지, 카포에라 커뮤니티의 중심에서 함께하세요
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="#find-dojang"
                            className="px-6 py-3 bg-primary text-white text-lg font-medium !rounded-button hover:bg-primary/90 transition-colors whitespace-nowrap"
                        >
                            도장 찾아보기
                        </a>
                        <a
                            href="#events"
                            className="px-6 py-3 bg-white text-primary text-lg font-medium border border-primary !rounded-button hover:bg-gray-50 transition-colors whitespace-nowrap"
                        >
                            이벤트 보기
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
