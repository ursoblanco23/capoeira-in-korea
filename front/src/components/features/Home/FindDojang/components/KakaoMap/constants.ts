// import { createMarkerImage } from "@/components/features/Home/FindDojang/components/KakaoMap/utils.ts";
//
// const MARKER_IMG_CONFIG = {
//     DIMENSION: {
//         DEFAULT: { width: 36, height: 36 },
//         HOVER: { width: 42, height: 42 }
//     },
//     URL: {
//         DEFAULT: 'src/assets/images/black-marker.png',
//         HOVER: 'src/assets/images/red-marker.png'
//     },
//     get SIZE() {
//         return {
//             DEFAULT: new kakao.maps.Size(this.DIMENSION.DEFAULT.width, this.DIMENSION.DEFAULT.height),
//             HOVER: new kakao.maps.Size(this.DIMENSION.HOVER.width, this.DIMENSION.HOVER.height)
//         };
//     },
//     get OPTIONS() {
//         return {
//             DEFAULT: { offset: new kakao.maps.Point(this.DIMENSION.DEFAULT.width / 2, this.DIMENSION.DEFAULT.height) },
//             HOVER: { offset: new kakao.maps.Point(this.DIMENSION.HOVER.width / 2, this.DIMENSION.HOVER.height) }
//         };
//     }
// } as const;
//
// export const KAKAO_MAP = {
//     LEVEL: {
//         DEFAULT: 3,
//     },
//     POSITION: {
//         DEFAULT: { NAME: '기본 위치 (서울시청)', LATITUDE: 37.5668, LONGITUDE: 126.9787 }
//     },
//     MARKER: {
//         IMG: {
//             DEFAULT: createMarkerImage(
//                 MARKER_IMG_CONFIG.URL.DEFAULT,
//                 MARKER_IMG_CONFIG.SIZE.DEFAULT,
//                 MARKER_IMG_CONFIG.OPTIONS.DEFAULT
//             ),
//             HOVER: createMarkerImage(
//                 MARKER_IMG_CONFIG.URL.HOVER,
//                 MARKER_IMG_CONFIG.SIZE.HOVER,
//                 MARKER_IMG_CONFIG.OPTIONS.HOVER
//             ),
//         },
//     }
// };

import { createMarkerImage } from "./utils";
import blackMarkerUrl from "@/assets/images/black-marker.png";
import redMarkerUrl from "@/assets/images/red-marker.png";

const DIMENSION = {
    DEFAULT: { width: 36, height: 36 },
    HOVER: { width: 42, height: 42 },
} as const;

export function createMarkerImages() {
    const { kakao } = window as any;
    if (!kakao?.maps) {
        throw new Error("Kakao Maps SDK is not loaded yet.");
    }

    const defaultSize = new kakao.maps.Size(DIMENSION.DEFAULT.width, DIMENSION.DEFAULT.height);
    const hoverSize = new kakao.maps.Size(DIMENSION.HOVER.width, DIMENSION.HOVER.height);

    const defaultOpt = { offset: new kakao.maps.Point(DIMENSION.DEFAULT.width / 2, DIMENSION.DEFAULT.height) };
    const hoverOpt = { offset: new kakao.maps.Point(DIMENSION.HOVER.width / 2, DIMENSION.HOVER.height) };

    return {
        DEFAULT: createMarkerImage(blackMarkerUrl, defaultSize, defaultOpt),
        HOVER: createMarkerImage(redMarkerUrl, hoverSize, hoverOpt),
    };
}

export const KAKAO_MAP = {
    LEVEL: { DEFAULT: 3 },
    POSITION: {
        DEFAULT: { NAME: "기본 위치 (서울시청)", LATITUDE: 37.5668, LONGITUDE: 126.9787 },
    },
} as const;
