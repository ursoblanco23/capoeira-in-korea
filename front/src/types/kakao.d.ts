import "kakao.maps.d.ts";

declare global {
    interface Window {
        kakao: {
          maps: typeof kakao.maps;
            // 필요한 다른 Kakao API 타입 추가
        };
        daum: any;
    }
}

export {}; // 모듈 컨텍스트 유지를 위해 필요