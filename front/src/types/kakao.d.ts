import "kakao.maps.d.ts";

interface DaumPostcodeData {
    zonecode: string;
    roadAddress: string;
    sido: string;
    sigungu: string;
    bname: string;
}

interface DaumPostcodeOptions {
    oncomplete: (data: DaumPostcodeData) => void;
}

interface DaumPostcode {
    open: () => void;
}

declare global {
    interface Window {
        kakao: {
          maps: typeof kakao.maps;
            // 필요한 다른 Kakao API 타입 추가
        };
        daum: {
            Postcode: new (options: DaumPostcodeOptions) => DaumPostcode;
        };
    }
}

export {}; // 모듈 컨텍스트 유지를 위해 필요