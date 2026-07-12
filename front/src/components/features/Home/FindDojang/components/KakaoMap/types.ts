import type {Dojang} from "@/types/dojang.ts";
import type {NavigateFunction} from "react-router-dom";
import type {RefObject} from "react";

export interface RenderDojangsOnMapOptions {
    dojangs: Dojang[];
    navigate: NavigateFunction;
    openOverlayRef: RefObject<kakao.maps.CustomOverlay | null>;
}

export interface MyPosition {
    latitude: number,
    longitude: number,
}

export type MarkerImageOptions = {spriteOrigin?: kakao.maps.Point, spriteSize?: kakao.maps.Size, offset?: kakao.maps.Point};