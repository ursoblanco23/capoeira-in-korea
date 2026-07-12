// import {KAKAO_MAP} from "@/components/features/Home/FindDojang/components/KakaoMap/constants.ts";
// import type {
//     MarkerImageOptions,
//     MyPosition, RenderDojangsOnMapOptions,
// } from "@/components/features/Home/FindDojang/components/KakaoMap/types.ts";
// import type {Dojang} from "@/types/dojang.ts";
// import type {NavigateFunction} from "react-router-dom";
// import {bindNavigateEventToTarget} from "@/utils/event.ts";
// import {PAGE} from "@/constants/routes.ts";
// import type {RefObject} from "react";
//
// /**
//  * 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 반환합니다.
//  * @param {string} src - 마커 이미지의 주소(URL).
//  * @param {kakao.maps.Size} size - 마커 이미지의 크기. 예: new kakao.maps.Size(22, 26)
//  * @param {MarkerImageOptions} options - 마커 이미지에 적용할 추가 옵션 객체. 예: {
//  *         offset: new window.kakao.maps.Point(DEFAULT_MARKER_DIM.width / 2, DEFAULT_MARKER_DIM.height),
//  *     }
//  * @returns {kakao.maps.MarkerImage} 생성된 마커 이미지 객체.
//  */
// export function createMarkerImage(src: string, size: kakao.maps.Size, options: MarkerImageOptions): kakao.maps.MarkerImage {
//     const markerImage = new window.kakao.maps.MarkerImage(src, size, options);
//     return markerImage;
// }
//
// function getPosition(latitude: number, longitude: number): kakao.maps.LatLng {
//     return new window.kakao.maps.LatLng(latitude, longitude);
// }
//
// function createKakaoMap(container: HTMLElement, center: kakao.maps.LatLng, level: number =3): kakao.maps.Map {
//     const options = {
//         center,
//         level,
//     };
//     return new window.kakao.maps.Map(container, options);
// }
//
// function createMarkerByImg(position: kakao.maps.LatLng, markerImage: kakao.maps.MarkerImage = KAKAO_MAP.MARKER.IMG.DEFAULT) {
//     return new window.kakao.maps.Marker({
//         position,
//         image: markerImage,
//     });
// }
//
// function createNameOverlay(position: kakao.maps.LatLng, positionName: string) {
//     return new window.kakao.maps.CustomOverlay({
//         content: `
//                   <div class="custom-name-overlay">
//                     <div class="custom-name-info"
//                          data-name= "${positionName}"
//                     >${positionName}</div>
//                   </div>
//                 `,
//         position: position,
//         xAnchor: 0.5,
//         yAnchor: 2.4
//     });
// }
//
// function createDojangInfoOverlay(dojang: Dojang, position: kakao.maps.LatLng): kakao.maps.CustomOverlay {
//     return new window.kakao.maps.CustomOverlay({
//         content: `
//                           <div class="custom-overlay custom-infoWindow">
//                             <div class="custom-title">
//                               ${dojang.name}
//                               <div class="close">X</div>
//                             </div>
//                             <div class="custom-body">
//                               <div class="roadAddress">${dojang.roadAddress}</div>
//                               <div class="phone">${dojang.phone}</div>
//                               <nav>
//                                 <a class="dojang-detail-link text-primary font-medium hover:underline cursor-pointer">
//                                     상세보기
//                                 </a>
//                               </nav>
//                             </div>
//                           </div>
//                         `,
//         position: position,
//         yAnchor: 1.9,
//     });
// }
//
// function moveCenter(map: kakao.maps.Map, position: kakao.maps.LatLng, level: number = KAKAO_MAP.LEVEL.DEFAULT) {
//     /* 호출 순서 중요 !
//     * setLevel 후에 setCenter 해야함. */
//     map.setLevel(level);
//     map.setCenter(position);
// }
//
// function openDojangInfoOverlay(dojangInfoOverlay: kakao.maps.CustomOverlay, openOverlayRef: RefObject<kakao.maps.CustomOverlay | null>, map: kakao.maps.Map, navigate: NavigateFunction, dojang: Dojang) {
//     if (openOverlayRef.current !== null) {
//         openOverlayRef.current.setMap(null);
//     }
//     dojangInfoOverlay.setMap(map);
//     openOverlayRef.current = dojangInfoOverlay;
//
//     bindNavigateEventToTarget('.dojang-detail-link', navigate, PAGE.DOJANG(dojang.id));
//
//     // x 버튼 클릭 이벤트 핸들러 바인드
//     const closeBtn: HTMLElement | null = document.querySelector('.close') as HTMLElement;
//     if (closeBtn) {
//         closeBtn.addEventListener('click', () => {
//             dojangInfoOverlay.setMap(null);
//             openOverlayRef.current = null
//         });
//     }
// }
//
// /**
//  * 마커 클릭 시
//  * 1. 해당 마커로 지도 중심 이동
//  * 2. 기존에 열려있는 도장의 info overlay를 닫고, 해당 도장의 info oopenDojangInfoOverlay verlay 띄워줌.
//  * @param marker
//  * @param position
//  * @param map
//  * @param dojang
//  * @param navigate
//  * @param openOverlayRef
//  */
// function bindDojangMarkerClickEvent(marker: kakao.maps.Marker
//                                     , position: kakao.maps.LatLng
//                                     , map: kakao.maps.Map
//                                     , dojang: Dojang
//                                     , navigate: NavigateFunction
//                                     , openOverlayRef: RefObject<kakao.maps.CustomOverlay | null>) {
//     kakao.maps.event.addListener(marker, 'click', () => {
//         moveCenter(map, position);
//         openDojangInfoOverlay(createDojangInfoOverlay(dojang, position), openOverlayRef, map, navigate, dojang);
//     });
// }
//
// function nameOverlayStyleUpdate(name: string, color: string, zIdx: number) {
//     const nameOverlayEl = document.querySelector(
//         `.custom-name-info[data-name="${name}"]`
//     ) as HTMLElement;
//
//     if (nameOverlayEl) {
//         nameOverlayEl.style.backgroundColor = color;
//         nameOverlayEl.parentElement!.parentElement!.style.zIndex = zIdx + '';
//     }
// }
//
// function bindMarkerHoverEffect(marker: kakao.maps.Marker, name: string) {
//     // 마커 마우스 오버 시 효과 적용
//     kakao.maps.event.addListener(marker, 'mouseover', () => {
//         const zIdx = 9999;
//
//         // 마커 스타일 업데이트
//         marker.setImage(KAKAO_MAP.MARKER.IMG.HOVER);
//         marker.setZIndex(9999)
//
//         // name overlay 스타일 업데이트
//         const hoverMarkerColor = '#F44336';
//         nameOverlayStyleUpdate(name, hoverMarkerColor, zIdx);
//     });
//
//     // 마커 마우스 아웃 시 default로 복귀
//     kakao.maps.event.addListener(marker, 'mouseout', () => {
//         const zIdx = 0;
//
//         // 마커 스타일 업데이트
//         marker.setImage(KAKAO_MAP.MARKER.IMG.DEFAULT);
//         marker.setZIndex(zIdx)
//
//         // name overlay 스타일 업데이트
//         const customNameInfoBgColor = '#222';
//         nameOverlayStyleUpdate(name, customNameInfoBgColor, zIdx);
//     });
// }
//
// function renderDojangsOnMap(container: HTMLElement, RenderDojangsOnMapOptions: RenderDojangsOnMapOptions) {
//     const {dojangs, navigate, openOverlayRef} = RenderDojangsOnMapOptions;
//
//     // map 객체 생성 (지도의 center는 우선 아무데나)
//     const center = getPosition(KAKAO_MAP.POSITION.DEFAULT.LATITUDE, KAKAO_MAP.POSITION.DEFAULT.LONGITUDE);
//     const map = createKakaoMap(container, center, KAKAO_MAP.LEVEL.DEFAULT);
//
//     // LatLngBounds로 전체 도장 마커 포함되도록 확대/이동
//     const bounds = new window.kakao.maps.LatLngBounds();
//
//     dojangs.forEach((dojang) => {
//         const position = new window.kakao.maps.LatLng(dojang.latitude, dojang.longitude);
//         const marker = createMarkerByImg(position, KAKAO_MAP.MARKER.IMG.DEFAULT);
//         const dojangNameOverlay = createNameOverlay(position, dojang.name);
//
//         marker.setMap(map);
//         dojangNameOverlay.setMap(map);
//
//         // DOM이 삽입된 후 이벤트 바인딩
//         bindDojangMarkerClickEvent(marker, position, map, dojang, navigate, openOverlayRef);
//         bindMarkerHoverEffect(marker, dojang.name);
//
//         // bounds 에 포함시키기
//         bounds.extend(position);
//
//     }); // 도장들 지도 표시 작업 end
//
//     // 모든 마커 보이도록 지도 영역 조절
//     map.setBounds(bounds);
// }
//
// async function setKakaoMap(options?: RenderDojangsOnMapOptions, containerId: string = 'map'): Promise<void> {
//     const container: HTMLElement | null = document.getElementById(containerId);
//
//     if (container !== null && kakao.maps) {
//         if (options === undefined) { // 페이지 init 시
//             try { // 내 위치정보 제공 시
//                 const myPosition: MyPosition = await getCurrentPositionPromise();
//                 const position = getPosition(myPosition.latitude, myPosition.longitude);
//                 const map = createKakaoMap(container, position, KAKAO_MAP.LEVEL.DEFAULT);
//                 const marker = createMarkerByImg(position);
//                 const positionName = '내 위치'
//                 const nameOverlay = createNameOverlay(position, positionName);
//
//                 marker.setMap(map);
//                 nameOverlay.setMap(map);
//
//                 // DOM이 삽입된 후 이벤트 바인딩
//                 bindMarkerHoverEffect(marker, positionName)
//
//             } catch (error) { //위치정보 제공 x
//                 console.log('getCurrentPositionPromise error :', error);
//                 const position = new window.kakao.maps.LatLng(KAKAO_MAP.POSITION.DEFAULT.LATITUDE, KAKAO_MAP.POSITION.DEFAULT.LONGITUDE);
//                 const map = createKakaoMap(container, position, KAKAO_MAP.LEVEL.DEFAULT);
//                 const marker = createMarkerByImg(position);
//                 const positionName = KAKAO_MAP.POSITION.DEFAULT.NAME;
//                 const nameOverlay = createNameOverlay(position, positionName);
//
//                 marker.setMap(map);
//                 nameOverlay.setMap(map);
//
//                 // DOM이 삽입된 후 이벤트 바인딩
//                 bindMarkerHoverEffect(marker, positionName)
//             }
//         } else if (options && 'dojangs' in options) {
//             renderDojangsOnMap(container, options);
//         }
//     }
// }
//
// function getCurrentPositionPromise(): Promise<MyPosition> {
//     return new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const latitude = position.coords.latitude;
//                 const longitude = position.coords.longitude;
//                 resolve({latitude, longitude});
//             },
//             (error) => {
//                 reject(error);
//             }
//         );
//     });
// }
//
//
// export {setKakaoMap};

import { KAKAO_MAP, createMarkerImages } from "@/components/features/Home/FindDojang/components/KakaoMap/constants";
import type {
    MarkerImageOptions,
    MyPosition,
    RenderDojangsOnMapOptions,
} from "@/components/features/Home/FindDojang/components/KakaoMap/types";
import type { Dojang } from "@/types/dojang";
import type { NavigateFunction } from "react-router-dom";
import { bindNavigateEventToTarget } from "@/utils/event";
import { PAGE } from "@/constants/routes";
import type { RefObject } from "react";

/**
 * 마커이미지의 주소와, 크기, 옵션으로 마커 이미지를 생성하여 반환합니다.
 * @param {string} src - 마커 이미지의 주소(URL).
 * @param {kakao.maps.Size} size - 마커 이미지의 크기.
 * @param {MarkerImageOptions} options - 마커 이미지 옵션.
 * @returns {kakao.maps.MarkerImage} 생성된 마커 이미지 객체.
 */
export function createMarkerImage(
    src: string,
    size: kakao.maps.Size,
    options: MarkerImageOptions
): kakao.maps.MarkerImage {
    return new window.kakao.maps.MarkerImage(src, size, options);
}

function getPosition(latitude: number, longitude: number): kakao.maps.LatLng {
    return new window.kakao.maps.LatLng(latitude, longitude);
}

function createKakaoMap(
    container: HTMLElement,
    center: kakao.maps.LatLng,
    level: number = 3
): kakao.maps.Map {
    return new window.kakao.maps.Map(container, { center, level });
}

/**
 * ✅ 변경: 기본 마커이미지를 KAKAO_MAP에서 바로 참조하지 않고
 * 호출하는 쪽에서 markerImage를 넘겨주도록 변경
 */
function createMarkerByImg(
    position: kakao.maps.LatLng,
    markerImage?: kakao.maps.MarkerImage
) {
    return new window.kakao.maps.Marker({
        position,
        image: markerImage,
    });
}

function createNameOverlay(position: kakao.maps.LatLng, positionName: string) {
    return new window.kakao.maps.CustomOverlay({
        content: `
      <div class="custom-name-overlay">
        <div class="custom-name-info"
             data-name="${positionName}"
        >${positionName}</div>
      </div>
    `,
        position,
        xAnchor: 0.5,
        yAnchor: 2.4,
    });
}

function createDojangInfoOverlay(dojang: Dojang, position: kakao.maps.LatLng): kakao.maps.CustomOverlay {
    return new window.kakao.maps.CustomOverlay({
        content: `
      <div class="custom-overlay custom-infoWindow">
        <div class="custom-title">
          ${dojang.name}
          <div class="close">X</div>
        </div>
        <div class="custom-body">
          <div class="roadAddress">${dojang.roadAddress}</div>
          <div class="phone">${dojang.phone}</div>
          <nav>
            <a class="dojang-detail-link text-primary font-medium hover:underline cursor-pointer">
              상세보기
            </a>
          </nav>
        </div>
      </div>
    `,
        position,
        yAnchor: 1.9,
    });
}

function moveCenter(
    map: kakao.maps.Map,
    position: kakao.maps.LatLng,
    level: number = KAKAO_MAP.LEVEL.DEFAULT
) {
    // 호출 순서 중요: setLevel 후 setCenter
    map.setLevel(level);
    map.setCenter(position);
}

function openDojangInfoOverlay(
    dojangInfoOverlay: kakao.maps.CustomOverlay,
    openOverlayRef: RefObject<kakao.maps.CustomOverlay | null>,
    map: kakao.maps.Map,
    navigate: NavigateFunction,
    dojang: Dojang
) {
    if (openOverlayRef.current !== null) {
        openOverlayRef.current.setMap(null);
    }

    dojangInfoOverlay.setMap(map);
    openOverlayRef.current = dojangInfoOverlay;

    bindNavigateEventToTarget(".dojang-detail-link", navigate, PAGE.DOJANG(dojang.id));

    const closeBtn: HTMLElement | null = document.querySelector(".close") as HTMLElement;
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            dojangInfoOverlay.setMap(null);
            openOverlayRef.current = null;
        });
    }
}

function bindDojangMarkerClickEvent(
    marker: kakao.maps.Marker,
    position: kakao.maps.LatLng,
    map: kakao.maps.Map,
    dojang: Dojang,
    navigate: NavigateFunction,
    openOverlayRef: RefObject<kakao.maps.CustomOverlay | null>
) {
    kakao.maps.event.addListener(marker, "click", () => {
        moveCenter(map, position);
        openDojangInfoOverlay(createDojangInfoOverlay(dojang, position), openOverlayRef, map, navigate, dojang);
    });
}

function nameOverlayStyleUpdate(name: string, color: string, zIdx: number) {
    const nameOverlayEl = document.querySelector(
        `.custom-name-info[data-name="${name}"]`
    ) as HTMLElement;

    if (nameOverlayEl) {
        nameOverlayEl.style.backgroundColor = color;
        nameOverlayEl.parentElement!.parentElement!.style.zIndex = String(zIdx);
    }
}

/**
 * ✅ 변경: HOVER/DEFAULT MarkerImage를 인자로 받아서 사용
 */
function bindMarkerHoverEffect(
    marker: kakao.maps.Marker,
    name: string,
    markerImages: { DEFAULT: kakao.maps.MarkerImage; HOVER: kakao.maps.MarkerImage }
) {
    kakao.maps.event.addListener(marker, "mouseover", () => {
        const zIdx = 9999;

        marker.setImage(markerImages.HOVER);
        marker.setZIndex(zIdx);

        const hoverMarkerColor = "#F44336";
        nameOverlayStyleUpdate(name, hoverMarkerColor, zIdx);
    });

    kakao.maps.event.addListener(marker, "mouseout", () => {
        const zIdx = 0;

        marker.setImage(markerImages.DEFAULT);
        marker.setZIndex(zIdx);

        const customNameInfoBgColor = "#222";
        nameOverlayStyleUpdate(name, customNameInfoBgColor, zIdx);
    });
}

function renderDojangsOnMap(container: HTMLElement, options: RenderDojangsOnMapOptions) {
    const { dojangs, navigate, openOverlayRef } = options;

    // ✅ 여기 시점이면 SDK가 로드된 상태여야 하므로 MarkerImage 생성 가능
    const markerImages = createMarkerImages();

    const center = getPosition(KAKAO_MAP.POSITION.DEFAULT.LATITUDE, KAKAO_MAP.POSITION.DEFAULT.LONGITUDE);
    const map = createKakaoMap(container, center, KAKAO_MAP.LEVEL.DEFAULT);

    const bounds = new window.kakao.maps.LatLngBounds();

    dojangs.forEach((dojang) => {
        const position = new window.kakao.maps.LatLng(dojang.latitude, dojang.longitude);

        const marker = createMarkerByImg(position, markerImages.DEFAULT);
        const dojangNameOverlay = createNameOverlay(position, dojang.name);

        marker.setMap(map);
        dojangNameOverlay.setMap(map);

        bindDojangMarkerClickEvent(marker, position, map, dojang, navigate, openOverlayRef);
        bindMarkerHoverEffect(marker, dojang.name, markerImages);

        bounds.extend(position);
    });

    map.setBounds(bounds);
}

async function setKakaoMap(
    options?: RenderDojangsOnMapOptions,
    containerId: string = "map"
): Promise<void> {
    const container: HTMLElement | null = document.getElementById(containerId);
    if (!container) return;

    // ✅ window.kakao 체크를 확실히
    const { kakao } = window as any;
    if (!kakao?.maps) return;

    if (options === undefined) {
        // 페이지 init 시: 내 위치 기반으로 마커 1개 표시
        const markerImages = createMarkerImages();

        try {
            const myPosition: MyPosition = await getCurrentPositionPromise();
            const position = getPosition(myPosition.latitude, myPosition.longitude);

            const map = createKakaoMap(container, position, KAKAO_MAP.LEVEL.DEFAULT);
            const marker = createMarkerByImg(position, markerImages.DEFAULT);

            const positionName = "내 위치";
            const nameOverlay = createNameOverlay(position, positionName);

            marker.setMap(map);
            nameOverlay.setMap(map);

            bindMarkerHoverEffect(marker, positionName, markerImages);
        } catch (error) {
            console.log("getCurrentPositionPromise error :", error);

            const fallbackPos = new window.kakao.maps.LatLng(
                KAKAO_MAP.POSITION.DEFAULT.LATITUDE,
                KAKAO_MAP.POSITION.DEFAULT.LONGITUDE
            );

            const map = createKakaoMap(container, fallbackPos, KAKAO_MAP.LEVEL.DEFAULT);
            const marker = createMarkerByImg(fallbackPos, markerImages.DEFAULT);

            const positionName = KAKAO_MAP.POSITION.DEFAULT.NAME;
            const nameOverlay = createNameOverlay(fallbackPos, positionName);

            marker.setMap(map);
            nameOverlay.setMap(map);

            bindMarkerHoverEffect(marker, positionName, markerImages);
        }
    } else if (options && "dojangs" in options) {
        renderDojangsOnMap(container, options);
    }
}

function getCurrentPositionPromise(): Promise<MyPosition> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => reject(error)
        );
    });
}

export { setKakaoMap };
